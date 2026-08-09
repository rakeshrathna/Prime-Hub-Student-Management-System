import { useRef, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Field from "../../components/common/Field";
import Avatar from "../../components/common/Avatar";
import { updateProfile } from "../../api/student";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { resolveAssetUrl } from "../../utils/format";

export default function StudentProfile() {
  const { user, updateCachedUser, apiBaseUrl } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const currentAvatar = preview || resolveAssetUrl(user?.profileImageUrl, apiBaseUrl);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!phoneNumber.trim() && !password && !file) {
      setError("Change at least one field before saving.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        phoneNumber: phoneNumber.trim() || undefined,
        password: password || undefined,
        file: file || undefined,
      });
      updateCachedUser({
        phoneNumber: updated.phoneNumber,
        profileImageUrl: updated.profileImageUrl,
      });
      toast.success("Profile updated.");
      setPassword("");
      setConfirmPassword("");
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Profile" description="Update your contact number, password and profile photo." />

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>Account details</h3>
              <p>Your name, email and role are managed by your school administrator</p>
            </div>
          </div>
          <div className="card-body">
            <form className="form-grid-1" onSubmit={handleSave} noValidate>
              {error && <div className="alert alert-danger">{error}</div>}

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar name={user?.name} src={currentAvatar} size="lg" />
                <div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
                    Change photo
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
                  {file && <div className="cell-secondary" style={{ marginTop: 6 }}>{file.name}</div>}
                </div>
              </div>

              <div className="form-grid">
                <Field label="Full name">
                  <input className="field-input" value={user?.name || ""} disabled />
                </Field>
                <Field label="Email address">
                  <input className="field-input" value={user?.email || ""} disabled />
                </Field>
              </div>

              <Field label="Phone number" htmlFor="p-phone">
                <input
                  id="p-phone"
                  className="field-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </Field>

              <div className="divider" />

              <div className="section-title" style={{ marginBottom: 0 }}>Change password</div>
              <div className="form-grid">
                <Field label="New password" htmlFor="p-pass" optional hint="Leave blank to keep your current password.">
                  <input
                    id="p-pass"
                    type="password"
                    className="field-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </Field>
                <Field label="Confirm new password" htmlFor="p-pass-confirm" optional>
                  <input
                    id="p-pass-confirm"
                    type="password"
                    className="field-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </Field>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>Account summary</h3>
            </div>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted" style={{ fontSize: 12.5 }}>Role</span>
              <span className={`role-tag role-tag-${(user?.role || "").toLowerCase()}`}>{user?.role}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted" style={{ fontSize: 12.5 }}>Account ID</span>
              <span className="mono">#{user?.id}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
