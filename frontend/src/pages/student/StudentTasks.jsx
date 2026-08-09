import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Field from "../../components/common/Field";
import StatusBadge from "../../components/common/StatusBadge";
import { IconTasks } from "../../components/common/icons";
import { getStudentTasks, submitWork } from "../../api/student";
import { formatDate, formatDateTime, dueLabel } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const FILTERS = [
  { key: "PENDING", label: "Pending" },
  { key: "COMPLETED", label: "Submitted" },
  { key: "ALL", label: "All" },
];

export default function StudentTasks() {
  const { user } = useAuth();
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING");

  const [submitTarget, setSubmitTarget] = useState(null);
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setAssignments(await getStudentTasks(user.id));
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

  const visible = useMemo(() => {
    if (filter === "ALL") return assignments;
    return assignments.filter((a) => a.status === filter);
  }, [assignments, filter]);

  function openSubmit(a) {
    setSubmitTarget(a);
    setContent(a.submissionText || "");
    setSubmitError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const updated = await submitWork(submitTarget.assignmentId, content.trim());
      setAssignments((prev) => prev.map((a) => (a.assignmentId === updated.assignmentId ? updated : a)));
      toast.success(`"${submitTarget.task?.title}" submitted.`);
      setSubmitTarget(null);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="My tasks" description="Everything assigned to you, individually or through a team." />

      <div className="tab-row" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className={`tab-btn ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <Loader label="Loading tasks" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : visible.length === 0 ? (
          <EmptyState icon={<IconTasks width={18} height={18} />} title="Nothing here" description="No tasks match this filter." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.assignmentId}>
                    <td>
                      <div className="cell-primary">{a.task?.title}</div>
                      {a.task?.description && <div className="cell-secondary">{a.task.description}</div>}
                    </td>
                    <td><StatusBadge status={a.task?.priority} /></td>
                    <td className="mono">
                      {formatDate(a.task?.dueDate)}
                      {a.status === "PENDING" && <div className="cell-secondary">{dueLabel(a.task?.dueDate)}</div>}
                    </td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>{a.score != null ? <span className="mono cell-primary">{a.score}</span> : <span className="text-muted">—</span>}</td>
                    <td className="col-actions">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openSubmit(a)}>
                        {a.status === "COMPLETED" ? "View / resubmit" : "Submit"}
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
        open={Boolean(submitTarget)}
        onClose={() => !submitting && setSubmitTarget(null)}
        title={submitTarget?.task?.title || "Submit work"}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setSubmitTarget(null)} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" form="submit-form" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit work"}
            </button>
          </>
        }
      >
        <form id="submit-form" className="form-grid-1" onSubmit={handleSubmit} noValidate>
          {submitError && <div className="alert alert-danger">{submitError}</div>}
          {submitTarget?.task?.description && (
            <div className="card" style={{ background: "var(--bg-subtle)", padding: 12 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Instructions</div>
              <p className="text-soft" style={{ fontSize: 13 }}>{submitTarget.task.description}</p>
            </div>
          )}
          <Field label="Your submission" htmlFor="submit-content">
            <textarea
              id="submit-content"
              className="field-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your answer, notes, or a link to your work..."
              style={{ minHeight: 140 }}
            />
          </Field>
          {submitTarget?.feedback && (
            <div className="alert alert-info">
              <strong>Previous feedback:</strong> {submitTarget.feedback}
            </div>
          )}
          {submitTarget?.submissionDate && (
            <span className="cell-secondary">Last submitted {formatDateTime(submitTarget.submissionDate)}</span>
          )}
        </form>
      </Modal>
    </>
  );
}
