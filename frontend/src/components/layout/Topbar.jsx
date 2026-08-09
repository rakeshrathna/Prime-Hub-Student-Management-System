import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const DATE_FMT = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
const TIME_FMT = { hour: "2-digit", minute: "2-digit" };

export default function Topbar() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      <div>
        <div className="topbar-breadcrumb">{user?.role} Console</div>
        <div className="topbar-title">
          {now.toLocaleDateString(undefined, DATE_FMT)}
        </div>
      </div>
      <div className="topbar-right">
        <span className={`role-tag role-tag-${(user?.role || "").toLowerCase()}`}>{user?.role}</span>
        <span className="topbar-clock mono">{now.toLocaleTimeString(undefined, TIME_FMT)}</span>
      </div>
    </header>
  );
}
