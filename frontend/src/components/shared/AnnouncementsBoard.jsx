import { useEffect, useState } from "react";
import Loader from "../common/Loader";
import EmptyState from "../common/EmptyState";
import Modal from "../common/Modal";
import Field from "../common/Field";
import { IconPlus, IconAnnouncement } from "../common/icons";
import { getAnnouncements, postAnnouncement } from "../../api/school";
import { formatDateTime } from "../../utils/format";
import { useToast } from "../../context/ToastContext";

export default function AnnouncementsBoard({ canPost = false, posterId = null }) {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formError, setFormError] = useState("");
  const [posting, setPosting] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setAnnouncements(await getAnnouncements());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePost(e) {
    e.preventDefault();
    setFormError("");
    if (!title.trim() || !content.trim()) {
      setFormError("Title and message are both required.");
      return;
    }
    setPosting(true);
    try {
      const created = await postAnnouncement({ postedById: posterId, title: title.trim(), content: content.trim() });
      setAnnouncements((prev) => [created, ...prev]);
      toast.success("Announcement posted.");
      setModalOpen(false);
      setTitle("");
      setContent("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      {canPost && (
        <div className="page-actions" style={{ justifyContent: "flex-end", display: "flex", marginBottom: 18 }}>
          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <IconPlus width={15} height={15} />
            Post announcement
          </button>
        </div>
      )}

      {loading ? (
        <Loader label="Loading announcements" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : announcements.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconAnnouncement width={18} height={18} />}
            title="No announcements yet"
            description="Check back later for school-wide updates."
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {announcements.map((a) => (
            <div className="card" key={a.announcementId}>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 15 }}>{a.title}</h3>
                  <span className="mono text-muted" style={{ fontSize: 11.5, whiteSpace: "nowrap" }}>
                    {formatDateTime(a.postedAt)}
                  </span>
                </div>
                <p className="text-soft" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
                  {a.content}
                </p>
                <div className="divider" style={{ margin: "12px 0" }} />
                <span className="cell-secondary">Posted by {a.postedBy?.name || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {canPost && (
        <Modal
          open={modalOpen}
          onClose={() => !posting && setModalOpen(false)}
          title="Post announcement"
          footer={
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={posting}>
                Cancel
              </button>
              <button type="submit" form="announcement-form" className="btn btn-primary" disabled={posting}>
                {posting ? "Posting..." : "Post announcement"}
              </button>
            </>
          }
        >
          <form id="announcement-form" className="form-grid-1" onSubmit={handlePost} noValidate>
            {formError && <div className="alert alert-danger">{formError}</div>}
            <Field label="Title" htmlFor="a-title">
              <input
                id="a-title"
                className="field-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mid-term exam schedule released"
              />
            </Field>
            <Field label="Message" htmlFor="a-content">
              <textarea
                id="a-content"
                className="field-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the full announcement..."
              />
            </Field>
          </form>
        </Modal>
      )}
    </>
  );
}
