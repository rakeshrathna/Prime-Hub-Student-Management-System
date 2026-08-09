import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_HOME } from "../utils/navConfig";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@school.com", password: "password123" },
  { role: "Teacher", email: "jeeva@gmail.com", password: "password123" },
  { role: "Student", email: "raju@gmail.com", password: "password123" },
];

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAuthenticated && user) {
    const dest = location.state?.from?.pathname || ROLE_HOME[user.role] || "/";
    return <Navigate to={dest} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setBusy(true);
    try {
      const loggedInUser = await login(email.trim(), password);
      navigate(ROLE_HOME[loggedInUser.role] || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials and try again.");
    } finally {
      setBusy(false);
    }
  }

  function fillDemo(account) {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  }

  return (
    <div className="auth-screen">
      <div className="auth-showcase">
        <div className="auth-showcase-top">
          <div className="auth-brand">
            <div className="auth-brand-mark">
              <span />
            </div>
            <div className="auth-brand-text">
              Prime Hub
              <small>Student Management System</small>
            </div>
          </div>

          <h1 className="auth-headline">
            One console for admins, teachers <span className="accent">and students.</span>
          </h1>
          <p className="auth-sub">
            Manage enrolment, coursework, teams, leave requests and school announcements from a
            single, role-aware operations console.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature">
              <span className="auth-feature-index">01</span>
              Role-based access for Admin, Teacher and Student accounts.
            </div>
            <div className="auth-feature">
              <span className="auth-feature-index">02</span>
              Task assignment, submission and grading in one workflow.
            </div>
            <div className="auth-feature">
              <span className="auth-feature-index">03</span>
              Leave approvals, announcements and private student notes.
            </div>
          </div>
        </div>

        <div className="auth-showcase-bottom">
          <div className="auth-roles-strip">
            <span className="auth-role-chip">Admin</span>
            <span className="auth-role-chip">Teacher</span>
            <span className="auth-role-chip">Student</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>Sign in</h1>
            <p>Enter your credentials to reach your console.</p>
          </div>

          {error && <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label className="field-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@school.com"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-demo-box">
            <div className="auth-demo-box-title">Seeded demo accounts</div>
            {DEMO_ACCOUNTS.map((acc) => (
              <div className="auth-demo-row" key={acc.email}>
                <span>
                  <strong>{acc.role}</strong> — {acc.email}
                </span>
                <button type="button" onClick={() => fillDemo(acc)}>
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
