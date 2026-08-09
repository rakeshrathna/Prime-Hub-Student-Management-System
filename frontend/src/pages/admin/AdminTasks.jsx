import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { IconTrash } from "../../components/common/icons";
import { getAllTasks, deleteTask } from "../../api/tasks";
import { formatDate } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function AdminTasks() {
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setTasks(await getAllTasks());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
      <PageHeader title="Tasks" description="Every task issued across all teachers, school-wide." />

      <div className="card">
        {loading ? (
          <Loader label="Loading tasks" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks yet" description="Tasks created by teachers will appear here." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Type</th>
                  <th>Due date</th>
                  <th>Created by</th>
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
                    <td className="text-soft">{t.createdBy?.name || "—"}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm btn-icon"
                        onClick={() => setDeleteTarget(t)}
                        aria-label="Delete task"
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
