import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllUsers } from "../../api/admin";
import { getAllTasks } from "../../api/tasks";
import { getPendingLeaves } from "../../api/school";
import { getAnnouncements } from "../../api/school";
import { formatDate, formatDateTime } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [u, t, l, a] = await Promise.all([
          getAllUsers(),
          getAllTasks(),
          getPendingLeaves(),
          getAnnouncements(),
        ]);
        if (!active) return;
        setUsers(u);
        setTasks(t);
        setPendingLeaves(l);
        setAnnouncements(a);
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
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const teacherCount = users.filter((u) => u.role === "TEACHER").length;
  const studentCount = users.filter((u) => u.role === "STUDENT").length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}`}
        description="A system-wide view of accounts, coursework and pending approvals."
      />

      <div className="page-section">
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{users.length}</div>
            <div className="stat-tile-label">Total accounts</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{teacherCount}</div>
            <div className="stat-tile-label">Teachers</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{studentCount}</div>
            <div className="stat-tile-label">Students</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{adminCount}</div>
            <div className="stat-tile-label">Administrators</div>
          </div>
          <div className="stat-tile">
            <div className="stat-tile-accent" />
            <div className="stat-tile-value mono">{tasks.length}</div>
            <div className="stat-tile-label">Tasks issued</div>
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
              <h3>Pending leave requests</h3>
              <p>Awaiting a decision from Admin or Teacher</p>
            </div>
            <Link to="/admin/leaves" className="btn btn-secondary btn-sm">
              Review all
            </Link>
          </div>
          {pendingLeaves.length === 0 ? (
            <EmptyState title="No pending requests" description="All leave applications have been reviewed." />
          ) : (
            <div className="table-wrap" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Dates</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLeaves.slice(0, 6).map((l) => (
                    <tr key={l.leaveId}>
                      <td className="cell-primary">{l.student?.name || "—"}</td>
                      <td className="mono">
                        {formatDate(l.startDate)} → {formatDate(l.endDate)}
                      </td>
                      <td className="text-soft">{l.reason}</td>
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
              <h3>Latest announcements</h3>
              <p>Most recent school-wide posts</p>
            </div>
            <Link to="/admin/announcements" className="btn btn-secondary btn-sm">
              View all
            </Link>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {announcements.length === 0 ? (
              <EmptyState title="No announcements yet" description="Post the first school-wide update." />
            ) : (
              announcements.slice(0, 4).map((a) => (
                <div key={a.announcementId}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <strong style={{ fontSize: 13 }}>{a.title}</strong>
                    <span className="cell-secondary mono">{formatDateTime(a.postedAt)}</span>
                  </div>
                  <p className="text-soft" style={{ fontSize: 12.5, marginTop: 4 }}>
                    {a.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="page-section" style={{ marginTop: 24 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>Recent tasks</h3>
              <p>Across every teacher</p>
            </div>
            <Link to="/admin/tasks" className="btn btn-secondary btn-sm">
              View all
            </Link>
          </div>
          {tasks.length === 0 ? (
            <EmptyState title="No tasks yet" />
          ) : (
            <div className="table-wrap" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Type</th>
                    <th>Due</th>
                    <th>Created by</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 6).map((t) => (
                    <tr key={t.taskId}>
                      <td className="cell-primary">{t.title}</td>
                      <td><StatusBadge status={t.priority} /></td>
                      <td><StatusBadge status={t.taskType} /></td>
                      <td className="mono">{formatDate(t.dueDate)}</td>
                      <td className="text-soft">{t.createdBy?.name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
