import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Field from "../../components/common/Field";
import Avatar from "../../components/common/Avatar";
import { IconPlus, IconEdit, IconTrash } from "../../components/common/icons";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../api/admin";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { resolveAssetUrl } from "../../utils/format";

const ROLES = ["ADMIN", "TEACHER", "STUDENT"];

const emptyForm = { name: "", email: "", password: "", role: "STUDENT", phoneNumber: "" };

export default function AdminUsers() {
  const toast = useToast();
  const { user: currentUser, apiBaseUrl } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEdit(u) {
    setEditingUser(u);
    setForm({ name: u.name || "", email: u.email || "", password: "", role: u.role, phoneNumber: u.phoneNumber || "" });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Name and email are required.");
      return;
    }
    if (!editingUser && !form.password.trim()) {
      setFormError("A password is required for new accounts.");
      return;
    }

    setSaving(true);
    try {
      if (editingUser) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          phoneNumber: form.phoneNumber.trim() || null,
        };
        if (form.password.trim()) payload.password = form.password.trim();
        const updated = await updateUser(editingUser.userId, payload);
        setUsers((prev) => prev.map((u) => (u.userId === updated.userId ? updated : u)));
        toast.success(`${updated.name} was updated.`);
      } else {
        const created = await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role: form.role,
          phoneNumber: form.phoneNumber.trim() || null,
        });
        setUsers((prev) => [...prev, created]);
        toast.success(`${created.name} was added as ${created.role.toLowerCase()}.`);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.userId);
      setUsers((prev) => prev.filter((u) => u.userId !== deleteTarget.userId));
      toast.success(`${deleteTarget.name} was removed.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Create, update and remove Admin, Teacher and Student accounts."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus width={15} height={15} />
            Add user
          </button>
        }
      />

      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <input
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["ALL", ...ROLES].map((r) => (
              <button
                key={r}
                type="button"
                className={`btn btn-sm ${roleFilter === r ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setRoleFilter(r)}
              >
                {r === "ALL" ? "All" : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loader label="Loading users" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" description="Try a different search or filter." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>ID</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.userId}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={u.name} src={resolveAssetUrl(u.profileImageUrl, apiBaseUrl)} />
                        <span className="cell-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-soft">{u.email}</td>
                    <td>
                      <span className={`role-tag role-tag-${u.role.toLowerCase()}`}>{u.role}</span>
                    </td>
                    <td className="text-soft">{u.phoneNumber || "—"}</td>
                    <td className="mono text-muted">#{u.userId}</td>
                    <td className="col-actions">
                      <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(u)} aria-label="Edit">
                        <IconEdit width={15} height={15} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-icon"
                        onClick={() => setDeleteTarget(u)}
                        aria-label="Delete"
                        disabled={u.userId === currentUser?.id}
                        title={u.userId === currentUser?.id ? "You cannot delete your own account" : "Delete"}
                      >
                        <IconTrash width={15} height={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editingUser ? "Edit user" : "Add user"}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="user-form" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingUser ? "Save changes" : "Create account"}
            </button>
          </>
        }
      >
        <form id="user-form" className="form-grid" onSubmit={handleSave} noValidate>
          {formError && (
            <div className="alert alert-danger" style={{ gridColumn: "1 / -1" }}>
              {formError}
            </div>
          )}
          <Field label="Full name" htmlFor="u-name">
            <input
              id="u-name"
              className="field-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email address" htmlFor="u-email">
            <input
              id="u-email"
              type="email"
              className="field-input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="jane@school.com"
            />
          </Field>
          <Field label="Role" htmlFor="u-role">
            <select
              id="u-role"
              className="field-select"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone number" htmlFor="u-phone" optional>
            <input
              id="u-phone"
              className="field-input"
              value={form.phoneNumber}
              onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
              placeholder="+91 90000 00000"
            />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field
              label={editingUser ? "New password" : "Password"}
              htmlFor="u-password"
              optional={Boolean(editingUser)}
              hint={editingUser ? "Leave blank to keep the current password." : "Minimum 6 characters recommended."}
            >
              <input
                id="u-password"
                type="password"
                className="field-input"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
            </Field>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete user"
        message={`This permanently removes ${deleteTarget?.name || "this user"}'s account. This cannot be undone.`}
        confirmLabel="Delete user"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
