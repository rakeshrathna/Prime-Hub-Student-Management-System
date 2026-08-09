import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getStudentTasks } from "../../api/student";
import { formatDate, dueLabel } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentTasks(user.id)
      .then((data) => active && setAssignments(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user.id]);

  const pending = useMemo(() => assignments.filter((a) => a.status === "PENDING"), [assignments]);
  const completed = useMemo(() => assignments.filter((a) => a.status === "COMPLETED"), [assignments]);
  const graded = useMemo(() => assignments.filter((a) => a.score != null), [assignments]);
  const upcoming = useMemo(
    () =>
      [...pending]
        .filter((a) => a.task?.dueDate)
        .sort((a, b) => new Date(a.task.dueDate) - new Date(b.task.dueDate))
        .slice(0, 6),
    [pending]
  );

  if (loading) return <Loader label="Loading dashboard" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}`}
        description="Track what's due, what you've submitted, and how you're graded."
      />

      <div className="page-section">
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="stat-tile-accent warning" />
            <div className="stat-tile-value mono">{pending.length}</div>
            <div className="stat-tile-label">Pending tasks</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent success" />
            <div className="stat-tile-value mono">{completed.length}</div>
            <div className="stat-tile-label">Submitted</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{graded.length}</div>
            <div className="stat-tile-label">Graded</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{assignments.length}</div>
            <div className="stat-tile-label">Total assigned</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-text">
            <h3>Coming up</h3>
            <p>Your pending tasks sorted by due date</p>
          </div>
          <Link to="/student/tasks" className="btn btn-secondary btn-sm">
            View all tasks
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState title="Nothing due" description="You're all caught up on pending tasks." />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((a) => (
                  <tr key={a.assignmentId}>
                    <td className="cell-primary">{a.task?.title}</td>
                    <td><StatusBadge status={a.task?.priority} /></td>
                    <td className="mono">
                      {formatDate(a.task?.dueDate)}
                      <div className="cell-secondary" style={{ marginTop: 2 }}>{dueLabel(a.task?.dueDate)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
