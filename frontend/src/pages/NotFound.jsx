import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
      <div className="eyebrow">404</div>
      <h1 style={{ fontSize: 24 }}>Page not found</h1>
      <p className="text-muted" style={{ fontSize: 13 }}>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Back to console
      </Link>
    </div>
  );
}
