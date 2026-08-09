import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Field from "../../components/common/Field";
import StatusBadge from "../../components/common/StatusBadge";
import { IconLeave } from "../../components/common/icons";
import { applyForLeave, getStudentLeaveHistory } from "../../api/school";
import { formatDate, formatDateTime, todayISO } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const emptyForm = { reason: "", startDate: "", endDate: "" };

export default function StudentLeave() {
  const { user } = useAuth();
  const toast = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setHistory(await getStudentLeaveHistory(user.id));
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

  async function handleApply(e) {
    e.preventDefault();
    setFormError("");
    if (!form.reason.trim() || !form.startDate || !form.endDate) {
      setFormError("Fill in the reason, start date and end date.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError("End date can't be before the start date.");
      return;
    }
    setSaving(true);
    try {
      const created = await applyForLeave({
        studentId: user.id,
        reason: form.reason.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
      });
      setHistory((prev) => [created, ...prev]);
      toast.success("Leave request submitted.");
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Leave requests" description="Apply for leave and track the status of past requests." />

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>History</h3>
              <p>All requests you've submitted</p>
            </div>
          </div>
          {loading ? (
            <Loader label="Loading history" />
          ) : error ? (
            <div className="card-body">
              <div className="alert alert-danger">{error}</div>
            </div>
          ) : history.length === 0 ? (
            <EmptyState icon={<IconLeave width={18} height={18} />} title="No requests yet" description="Your leave requests will show up here." />
          ) : (
            <div className="table-wrap" style={{ border: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((l) => (
                    <tr key={l.leaveId}>
                      <td className="mono">
                        {formatDate(l.startDate)} → {formatDate(l.endDate)}
                      </td>
                      <td className="text-soft">{l.reason}</td>
                      <td><StatusBadge status={l.status} /></td>
                      <td className="mono text-muted">{formatDateTime(l.appliedAt)}</td>
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
              <h3>Apply for leave</h3>
              <p>Submit a new request for approval</p>
            </div>
          </div>
          <div className="card-body">
            <form className="form-grid-1" onSubmit={handleApply} noValidate>
              {formError && <div className="alert alert-danger">{formError}</div>}
              <Field label="Reason" htmlFor="leave-reason">
                <textarea
                  id="leave-reason"
                  className="field-textarea"
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  placeholder="Medical appointment, family event, etc."
                  style={{ minHeight: 90 }}
                />
              </Field>
              <div className="form-grid">
                <Field label="Start date" htmlFor="leave-start">
                  <input
                    id="leave-start"
                    type="date"
                    className="field-input"
                    min={todayISO()}
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  />
                </Field>
                <Field label="End date" htmlFor="leave-end">
                  <input
                    id="leave-end"
                    type="date"
                    className="field-input"
                    min={form.startDate || todayISO()}
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  />
                </Field>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
                {saving ? "Submitting..." : "Submit request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
