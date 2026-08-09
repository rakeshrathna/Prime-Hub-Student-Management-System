import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { IconNote } from "../../components/common/icons";
import { getNotes } from "../../api/school";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

export default function StudentNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getNotes({ studentId: user.id })
      .then((data) => active && setNotes(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user.id]);

  return (
    <>
      <PageHeader title="Notes from teachers" description="Feedback and observations your teachers have shared." />

      <div className="card">
        {loading ? (
          <Loader label="Loading notes" />
        ) : error ? (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
          </div>
        ) : notes.length === 0 ? (
          <EmptyState icon={<IconNote width={18} height={18} />} title="No notes yet" description="Notes your teachers write about your progress will appear here." />
        ) : (
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {notes.map((n) => (
              <div key={n.noteId}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="cell-primary">{n.teacher?.name || "Teacher"}</span>
                  <span className="mono text-muted" style={{ fontSize: 11.5 }}>{formatDateTime(n.createdAt)}</span>
                </div>
                <p className="text-soft" style={{ fontSize: 13.5, marginTop: 4 }}>{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
