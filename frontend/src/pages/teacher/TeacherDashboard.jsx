import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getTasksByTeacher, getTeacherAssignments } from "../../api/tasks";
import { getTeacherTeams, getAllStudents } from "../../api/teacher";
import { getPendingLeaves } from "../../api/school";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [t, a, tm, s, l] = await Promise.all([
          getTasksByTeacher(user.id),
          getTeacherAssignments(user.id),
          getTeacherTeams(user.id),
          getAllStudents(),
          getPendingLeaves(),
        ]);
        if (!active) return;
        setTasks(t);
        setAssignments(a);
        setTeams(tm);
        setStudents(s);
        setPendingLeaves(l);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user.id]);

  if (loading) return <Loader label="Loading dashboard" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const awaitingGrade = assignments.filter((a) => a.status === "COMPLETED" && a.score == null);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Teacher"}`}
        description="Your classroom at a glance — tasks, teams and what needs your attention."
      />

      <div className="page-section">
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{tasks.length}</div>
            <div className="stat-tile-label">Tasks created</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{teams.length}</div>
            <div className="stat-tile-label">Teams</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{students.length}</div>
            <div className="stat-tile-label">Students in school</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent warning" />
            <div className="stat-tile-value mono">{awaitingGrade.length}</div>
            <div className="stat-tile-label">Submissions to grade</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent warning" />
            <div className="stat-tile-value mono">{pendingLeaves.length}</div>
            <div className="stat-tile-label">Leave requests pending</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>Needs grading</h3>
              <p>Submitted work awaiting a score</p>
            </div>
            <Link to="/teacher/grading" className="btn btn-secondary btn-sm">
              Open grading
            </Link>
          </div>
          {awaitingGrade.length === 0 ? (
            <EmptyState title="All caught up" description="Nothing is waiting on a grade right now." />
          ) : (
            <div className="table-wrap" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Task</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {awaitingGrade.slice(0, 6).map((a) => (
                    <tr key={a.assignmentId}>
                      <td className="cell-primary">{a.student?.name || "—"}</td>
                      <td className="text-soft">{a.task?.title || "—"}</td>
                      <td className="mono">{formatDate(a.submissionDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>My tasks</h3>
              <p>Most recently created</p>
            </div>
            <Link to="/teacher/tasks" className="btn btn-secondary btn-sm">
              Manage
            </Link>
          </div>
          {tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Create your first task to assign to students." />
          ) : (
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tasks.slice(0, 5).map((t) => (
                <div key={t.taskId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div className="cell-primary" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.title}
                    </div>
                    <div className="cell-secondary mono">Due {formatDate(t.dueDate)}</div>
                  </div>
                  <StatusBadge status={t.priority} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
