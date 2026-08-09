import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Avatar from "../../components/common/Avatar";
import { getAllStudents } from "../../api/teacher";
import { useAuth } from "../../context/AuthContext";
import { resolveAssetUrl } from "../../utils/format";

export default function TeacherStudents() {
  const navigate = useNavigate();
  const { apiBaseUrl } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    getAllStudents()
      .then((data) => active && setStudents(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
  }, [students, search]);

  return (
    <>
      <PageHeader title="Students" description="Everyone enrolled as a student across the school." />

      <div className="card">
        <div className="table-toolbar">
          <div className="table-search">
            <input placeholder="Search students" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-muted mono" style={{ fontSize: 12 }}>{filtered.length} student{filtered.length === 1 ? "" : "s"}</span>
        </div>

        {loading ? (
          <Loader label="Loading students" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No students found" />
        ) : (
          <div className="table-wrap" style={{ border: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>ID</th>
                  <th className="col-actions">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.userId}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar name={s.name} src={resolveAssetUrl(s.profileImageUrl, apiBaseUrl)} />
                        <span className="cell-primary">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-soft">{s.email}</td>
                    <td className="text-soft">{s.phoneNumber || "—"}</td>
                    <td className="mono text-muted">#{s.userId}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(`/teacher/notes?studentId=${s.userId}`)}
                      >
                        View notes
                      </button>
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
