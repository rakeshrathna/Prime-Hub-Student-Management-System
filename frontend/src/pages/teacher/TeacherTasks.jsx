import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Field from "../../components/common/Field";
import StatusBadge from "../../components/common/StatusBadge";
import { IconPlus, IconTrash, IconArrowRight } from "../../components/common/icons";
import { createTask, getTasksByTeacher, assignToStudents, assignToTeam, deleteTask } from "../../api/tasks";
import { getAllStudents, getTeacherTeams } from "../../api/teacher";
import { formatDate, todayISO } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const emptyTask = { title: "", description: "", priority: "NORMAL", taskType: "INDIVIDUAL", dueDate: "" };

export default function TeacherTasks() {
  const { user } = useAuth();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyTask);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [assignTarget, setAssignTarget] = useState(null);
  const [assignMode, setAssignMode] = useState("students");
  const [assignStudentIds, setAssignStudentIds] = useState([]);
  const [assignTeamId, setAssignTeamId] = useState("");
  const [assignError, setAssignError] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [t, s, tm] = await Promise.all([getTasksByTeacher(user.id), getAllStudents(), getTeacherTeams(user.id)]);
      setTasks(t);
      setStudents(s);
      setTeams(tm);
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

  function openCreate() {
    setForm(emptyTask);
    setFormError("");
    setCreateOpen(true);
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    if (!form.title.trim()) {
      setFormError("Give the task a title.");
      return;
    }
    setSaving(true);
    try {
      const created = await createTask({
        teacherId: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        taskType: form.taskType,
        dueDate: form.dueDate || null,
      });
      setTasks((prev) => [created, ...prev]);
      toast.success(`Task "${created.title}" created.`);
      setCreateOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function openAssign(task) {
    setAssignTarget(task);
    setAssignMode(task.taskType === "TEAM" ? "team" : "students");
    setAssignStudentIds([]);
    setAssignTeamId("");
    setAssignError("");
  }

  function toggleAssignStudent(id) {
    setAssignStudentIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleAssign(e) {
    e.preventDefault();
    setAssignError("");
    setAssigning(true);
    try {
      if (assignMode === "students") {
        if (assignStudentIds.length === 0) {
          setAssignError("Select at least one student.");
          setAssigning(false);
          return;
        }
        await assignToStudents(assignTarget.taskId, assignStudentIds);
        toast.success(`Assigned to ${assignStudentIds.length} student${assignStudentIds.length === 1 ? "" : "s"}.`);
      } else {
        if (!assignTeamId) {
          setAssignError("Choose a team.");
          setAssigning(false);
          return;
        }
        await assignToTeam(assignTarget.taskId, Number(assignTeamId));
        toast.success("Assigned to team.");
      }
      setAssignTarget(null);
    } catch (err) {
      setAssignError(err.message);
    } finally {
      setAssigning(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.taskId);
      setTasks((prev) => prev.filter((t) => t.taskId !== deleteTarget.taskId));
      toast.success(`"${deleteTarget.title}" was deleted.`);
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
        title="Tasks"
        description="Create tasks and assign them to individual students or a whole team."
        actions={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <IconPlus width={15} height={15} />
            New task
          </button>
        }
      />

      <div className="card">
        {loading ? (
          <Loader label="Loading tasks" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Create your first task, then assign it to students or a team." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Type</th>
                  <th>Due date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.taskId}>
                    <td>
                      <div className="cell-primary">{t.title}</div>
                      {t.description && <div className="cell-secondary">{t.description}</div>}
                    </td>
                    <td><StatusBadge status={t.priority} /></td>
                    <td><StatusBadge status={t.taskType} /></td>
                    <td className="mono">{formatDate(t.dueDate)}</td>
                    <td className="col-actions">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openAssign(t)} style={{ marginRight: 8 }}>
                        Assign
                        <IconArrowRight width={13} height={13} />
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={() => setDeleteTarget(t)} aria-label="Delete task">
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
        open={createOpen}
        onClose={() => !saving && setCreateOpen(false)}
        title="Create task"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setCreateOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="task-form" className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create task"}
            </button>
          </>
        }
      >
        <form id="task-form" className="form-grid" onSubmit={handleCreate} noValidate>
          {formError && (
            <div className="alert alert-danger" style={{ gridColumn: "1 / -1" }}>
              {formError}
            </div>
          )}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Title" htmlFor="task-title">
              <input
                id="task-title"
                className="field-input"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Build a flying car"
              />
            </Field>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Description" htmlFor="task-desc" optional>
              <textarea
                id="task-desc"
                className="field-textarea"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What should students do?"
              />
            </Field>
          </div>
          <Field label="Priority" htmlFor="task-priority">
            <select
              id="task-priority"
              className="field-select"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            >
              <option value="NORMAL">Normal</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </Field>
          <Field label="Type" htmlFor="task-type">
            <select
              id="task-type"
              className="field-select"
              value={form.taskType}
              onChange={(e) => setForm((f) => ({ ...f, taskType: e.target.value }))}
            >
              <option value="INDIVIDUAL">Individual</option>
              <option value="TEAM">Team</option>
            </select>
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Due date" htmlFor="task-due" optional>
              <input
                id="task-due"
                type="date"
                className="field-input"
                min={todayISO()}
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </Field>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(assignTarget)}
        onClose={() => !assigning && setAssignTarget(null)}
        title={`Assign "${assignTarget?.title || ""}"`}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setAssignTarget(null)} disabled={assigning}>
              Cancel
            </button>
            <button type="submit" form="assign-form" className="btn btn-primary" disabled={assigning}>
              {assigning ? "Assigning..." : "Assign"}
            </button>
          </>
        }
      >
        <div className="tab-row" style={{ marginBottom: 16 }}>
          <button type="button" className={`tab-btn ${assignMode === "students" ? "active" : ""}`} onClick={() => setAssignMode("students")}>
            Individual students
          </button>
          <button type="button" className={`tab-btn ${assignMode === "team" ? "active" : ""}`} onClick={() => setAssignMode("team")}>
            A team
          </button>
        </div>

        <form id="assign-form" onSubmit={handleAssign} noValidate>
          {assignError && (
            <div className="alert alert-danger" style={{ marginBottom: 14 }}>
              {assignError}
            </div>
          )}

          {assignMode === "students" ? (
            <Field label={`Students (${assignStudentIds.length} selected)`}>
              <div className="checkbox-list">
                {students.length === 0 ? (
                  <div style={{ padding: 12 }} className="text-muted">
                    No students found.
                  </div>
                ) : (
                  students.map((s) => (
                    <label className="checkbox-list-item" key={s.userId}>
                      <input type="checkbox" checked={assignStudentIds.includes(s.userId)} onChange={() => toggleAssignStudent(s.userId)} />
                      {s.name}
                      <span className="mono text-muted" style={{ marginLeft: "auto" }}>
                        #{s.userId}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </Field>
          ) : (
            <Field label="Team" htmlFor="assign-team">
              <select id="assign-team" className="field-select" value={assignTeamId} onChange={(e) => setAssignTeamId(e.target.value)}>
                <option value="">Select a team...</option>
                {teams.map((t) => (
                  <option key={t.teamId} value={t.teamId}>
                    {t.teamName} ({t.members?.length || 0} members)
                  </option>
                ))}
              </select>
              {teams.length === 0 && <span className="field-hint">You haven't created any teams yet.</span>}
            </Field>
          )}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}" and all of its assignments? This cannot be undone.`}
        confirmLabel="Delete task"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
