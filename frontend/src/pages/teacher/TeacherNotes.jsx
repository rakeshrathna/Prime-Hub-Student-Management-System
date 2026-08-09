import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Field from "../../components/common/Field";
import { IconNote } from "../../components/common/icons";
import { getAllStudents } from "../../api/teacher";
import { addNote, getNotes } from "../../api/school";
import { formatDateTime } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function TeacherNotes() {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const studentId = searchParams.get("studentId") || "";
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState("");

  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;
    getAllStudents()
      .then((data) => active && setStudents(data))
      .finally(() => active && setLoadingStudents(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!studentId) {
      setNotes([]);
      return;
    }
    let active = true;
    setLoadingNotes(true);
    setNotesError("");
    getNotes({ teacherId: user.id, studentId })
      .then((data) => active && setNotes(data))
      .catch((err) => active && setNotesError(err.message))
      .finally(() => active && setLoadingNotes(false));
    return () => {
      active = false;
    };
  }, [studentId, user.id]);

  const selectedStudent = useMemo(() => students.find((s) => String(s.userId) === String(studentId)), [students, studentId]);

  function selectStudent(id) {
    setSearchParams(id ? { studentId: id } : {});
    setContent("");
    setSaveError("");
  }

  async function handleAddNote(e) {
    e.preventDefault();
    setSaveError("");
    if (!content.trim()) {
      setSaveError("Write a note before saving.");
      return;
    }
    setSaving(true);
    try {
      const created = await addNote({ teacherId: user.id, studentId: Number(studentId), content: content.trim() });
      setNotes((prev) => [created, ...prev]);
      setContent("");
      toast.success("Note saved.");
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Student notes" description="Private notes only visible to teachers and the student they're about." />

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>Select a student</h3>
              <p>Choose who this note is about</p>
            </div>
          </div>
          {loadingStudents ? (
            <Loader label="Loading students" />
          ) : (
            <div className="table-wrap" style={{ border: "none", maxHeight: 420, overflowY: "auto" }}>
              <table className="data-table">
                <tbody>
                  {students.map((s) => (
                    <tr
                      key={s.userId}
                      onClick={() => selectStudent(s.userId)}
                      style={{ cursor: "pointer", background: String(studentId) === String(s.userId) ? "var(--blue-soft)" : undefined }}
                    >
                      <td className="cell-primary">{s.name}</td>
                      <td className="text-muted mono" style={{ textAlign: "right" }}>
                        #{s.userId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          {!studentId ? (
            <EmptyState icon={<IconNote width={18} height={18} />} title="No student selected" description="Pick a student from the list to view or add notes." />
          ) : (
            <>
              <div className="card-header">
                <div className="card-header-text">
                  <h3>{selectedStudent?.name || `Student #${studentId}`}</h3>
                  <p>Notes history</p>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddNote} className="form-grid-1" noValidate style={{ marginBottom: 20 }}>
                  {saveError && <div className="alert alert-danger">{saveError}</div>}
                  <Field label="New note" htmlFor="note-content">
                    <textarea
                      id="note-content"
                      className="field-textarea"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Observation, feedback, or reminder about this student..."
                    />
                  </Field>
                  <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
                    {saving ? "Saving..." : "Save note"}
                  </button>
                </form>

                <div className="divider" style={{ marginBottom: 18 }} />

                {loadingNotes ? (
                  <Loader label="Loading notes" />
                ) : notesError ? (
                  <div className="alert alert-danger">{notesError}</div>
                ) : notes.length === 0 ? (
                  <EmptyState title="No notes yet" description="Notes you write here stay private to teaching staff." />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {notes.map((n) => (
                      <div key={n.noteId}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span className="cell-primary" style={{ fontSize: 12.5 }}>{n.teacher?.name || "—"}</span>
                          <span className="mono text-muted" style={{ fontSize: 11.5 }}>{formatDateTime(n.createdAt)}</span>
                        </div>
                        <p className="text-soft" style={{ fontSize: 13, marginTop: 4 }}>{n.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
