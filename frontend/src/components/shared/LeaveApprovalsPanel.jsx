import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import { IconCheck, IconClose } from "../common/icons";
import { getPendingLeaves, updateLeaveStatus } from "../../api/school";
import { formatDate, formatDateTime } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function LeaveApprovalsPanel() {
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setLeaves(await getPendingLeaves());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(leave, status) {
    setActingId(leave.leaveId);
    try {
      await updateLeaveStatus(leave.leaveId, status);
      setLeaves((prev) => prev.filter((l) => l.leaveId !== leave.leaveId));
      toast.success(`Leave request ${status === "APPROVED" ? "approved" : "rejected"}.`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="card">
      {loading ? (
        <Loader label="Loading requests" />
      ) : error ? (
        <div className="card-body">
          <div className="alert alert-danger">{error}</div>
        </div>
      ) : leaves.length === 0 ? (
        <EmptyState title="Queue is clear" description="There are no leave requests awaiting a decision." />
      ) : (
        <div className="table-wrap" style={{ border: "none" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Applied</th>
                <th className="col-actions">Decision</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.leaveId}>
                  <td className="cell-primary">{l.student?.name || "—"}</td>
                  <td className="mono">
                    {formatDate(l.startDate)} → {formatDate(l.endDate)}
                  </td>
                  <td className="text-soft">{l.reason}</td>
                  <td className="mono text-muted">{formatDateTime(l.appliedAt)}</td>
                  <td className="col-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => decide(l, "APPROVED")}
                      disabled={actingId === l.leaveId}
                      style={{ marginRight: 8 }}
                    >
                      <IconCheck width={14} height={14} />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => decide(l, "REJECTED")}
                      disabled={actingId === l.leaveId}
                    >
                      <IconClose width={14} height={14} />
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
