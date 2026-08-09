import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Field from "../../components/common/Field";
import { IconPlus, IconTeam } from "../../components/common/icons";
import { getTeacherTeams, createTeam, getAllStudents } from "../../api/teacher";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function TeacherTeams() {
  const { user } = useAuth();
  const toast = useToast();
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [t, s] = await Promise.all([getTeacherTeams(user.id), getAllStudents()]);
      setTeams(t);
      setStudents(s);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleStudent(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function openCreate() {
    setName("");
    setSelected([]);
    setFormError("");
    setModalOpen(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) {
      setFormError("Give the team a name.");
      return;
    }
    if (selected.length === 0) {
      setFormError("Select at least one student.");
      return;
    }
    setSaving(true);
    try {
      const created = await createTeam(user.id, name.trim(), selected);
      setTeams((prev) => [...prev, created]);
      toast.success(`Team "${created.teamName}" created.`);
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Teams"
        description="Group students into teams for collaborative assignments."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus width={15} height={15} />
            Create team
          </button>
        }
      />

      {loading ? (
        <Loader label="Loading teams" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : teams.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconTeam width={18} height={18} />}
            title="No teams yet"
            description="Create a team to assign group work to a set of students."
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {teams.map((t) => (
            <div className="card" key={t.teamId}>
              <div className="card-header">
                <div className="card-header-text">
                  <h3>{t.teamName}</h3>
                  <p>{t.members?.length || 0} member{(t.members?.length || 0) === 1 ? "" : "s"}</p>
                </div>
              </div>
              <div className="card-body">
                {t.members?.length ? (
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.members.map((m) => (
                      <li key={m.userId} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                        <span>{m.name}</span>
                        <span className="mono text-muted">#{m.userId}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted" style={{ fontSize: 12.5 }}>
                    No members
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title="Create team"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="team-form" className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create team"}
            </button>
          </>
        }
      >
        <form id="team-form" className="form-grid-1" onSubmit={handleCreate} noValidate>
          {formError && <div className="alert alert-danger">{formError}</div>}
          <Field label="Team name" htmlFor="t-name">
            <input id="t-name" className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Coders" />
          </Field>
          <Field label={`Members (${selected.length} selected)`}>
            <div className="checkbox-list">
              {students.map((s) => (
                <label className="checkbox-list-item" key={s.userId}>
                  <input type="checkbox" checked={selected.includes(s.userId)} onChange={() => toggleStudent(s.userId)} />
                  {s.name}
                  <span className="mono text-muted" style={{ marginLeft: "auto" }}>
                    #{s.userId}
                  </span>
                </label>
              ))}
            </div>
          </Field>
        </form>
      </Modal>
    </>
  );
}
