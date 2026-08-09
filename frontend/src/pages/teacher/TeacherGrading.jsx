import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import Field from "../../components/common/Field";
import StatusBadge from "../../components/common/StatusBadge";
import { IconGrade } from "../../components/common/icons";
import { getTeacherAssignments, gradeTask } from "../../api/tasks";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const FILTERS = [
  { key: "PENDING_GRADE", label: "Needs grading" },
  { key: "GRADED", label: "Graded" },
  { key: "ALL", label: "All submissions" },
];

export default function TeacherGrading() {
  const { user } = useAuth();
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("PENDING_GRADE");

  const [gradeTarget, setGradeTarget] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [gradeError, setGradeError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getTeacherAssignments(user.id);
      setAssignments(data);
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

  const submitted = useMemo(() => assignments.filter((a) => a.status === "COMPLETED"), [assignments]);

  const visible = useMemo(() => {
    if (filter === "PENDING_GRADE") return submitted.filter((a) => a.score == null);
    if (filter === "GRADED") return submitted.filter((a) => a.score != null);
    return submitted;
  }, [submitted, filter]);

  function openGrade(a) {
    setGradeTarget(a);
    setScore(a.score ?? "");
    setFeedback(a.feedback ?? "");
    setGradeError("");
  }

  async function handleGrade(e) {
    e.preventDefault();
    setGradeError("");
    if (score === "" || Number.isNaN(Number(score))) {
      setGradeError("Enter a numeric score.");
      return;
    }
    setSaving(true);
    try {
      await gradeTask({
        teacherId: user.id,
        taskId: gradeTarget.task.taskId,
        studentId: gradeTarget.student.userId,
        score: Number(score),
        feedback: feedback.trim(),
      });
      setAssignments((prev) =>
        prev.map((a) =>
          a.assignmentId === gradeTarget.assignmentId ? { ...a, score: Number(score), feedback: feedback.trim() } : a
        )
      );
      toast.success(`Graded ${gradeTarget.student?.name}'s submission.`);
      setGradeTarget(null);
    } catch (err) {
      setGradeError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Grading" description="Review submitted work and record scores with feedback." />

      <div className="tab-row" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className={`tab-btn ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
            {f.key === "PENDING_GRADE" && submitted.filter((a) => a.score == null).length > 0 && (
              <span className="mono" style={{ marginLeft: 6, color: "var(--warning)" }}>
                {submitted.filter((a) => a.score == null).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <Loader label="Loading submissions" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : visible.length === 0 ? (
          <EmptyState icon={<IconGrade width={18} height={18} />} title="Nothing here" description="No submissions match this filter." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Task</th>
                  <th>Submission</th>
                  <th>Submitted</th>
                  <th>Score</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.assignmentId}>
                    <td className="cell-primary">{a.student?.name || "—"}</td>
                    <td className="text-soft">{a.task?.title || "—"}</td>
                    <td className="text-soft" style={{ maxWidth: 260 }}>
                      {a.submissionText || <span className="text-muted">No text submitted</span>}
                    </td>
                    <td className="mono">{formatDateTime(a.submissionDate)}</td>
                    <td>
                      {a.score != null ? (
                        <span className="mono cell-primary">{a.score}</span>
                      ) : (
                        <StatusBadge status="PENDING" label="ungraded" />
                      )}
                    </td>
                    <td className="col-actions">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => openGrade(a)}>
                        {a.score != null ? "Update grade" : "Grade"}
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
        open={Boolean(gradeTarget)}
        onClose={() => !saving && setGradeTarget(null)}
        title={`Grade — ${gradeTarget?.student?.name || ""}`}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setGradeTarget(null)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="grade-form" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save grade"}
            </button>
          </>
        }
      >
        <form id="grade-form" className="form-grid-1" onSubmit={handleGrade} noValidate>
          {gradeError && <div className="alert alert-danger">{gradeError}</div>}
          <div className="card" style={{ background: "var(--bg-subtle)", padding: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Task</div>
            <div className="cell-primary">{gradeTarget?.task?.title}</div>
            <div className="divider" style={{ margin: "10px 0" }} />
            <div className="eyebrow" style={{ marginBottom: 6 }}>Submission</div>
            <p className="text-soft" style={{ fontSize: 13 }}>
              {gradeTarget?.submissionText || "No text submitted."}
            </p>
          </div>
          <Field label="Score" htmlFor="grade-score">
            <input
              id="grade-score"
              type="number"
              className="field-input"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="0 – 100"
            />
          </Field>
          <Field label="Feedback" htmlFor="grade-feedback" optional>
            <textarea
              id="grade-feedback"
              className="field-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Notes for the student..."
            />
          </Field>
        </form>
      </Modal>
    </>
  );
}
