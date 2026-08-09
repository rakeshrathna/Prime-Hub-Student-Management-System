import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAV_BY_ROLE } from "../../utils/navConfig";
import { resolveAssetUrl } from "../../utils/format";
import { IconLogout } from "../common/icons";
import Avatar from "../common/Avatar";

export default function Sidebar() {
  const { user, logout, apiBaseUrl } = useAuth();
  const sections = NAV_BY_ROLE[user?.role] || [];
  const avatarSrc = resolveAssetUrl(user?.profileImageUrl, apiBaseUrl);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <span />
        </div>
        <div className="sidebar-brand-text">
          Prime Hub
          <small>Student Management</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.section}>
            <div className="sidebar-section-label">{section.section}</div>
            <ul>
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
                  >
                    <span className="sidebar-link-icon">
                      <item.icon width={16} height={16} />
                    </span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <Avatar name={user?.name} src={avatarSrc} />
          <div style={{ minWidth: 0 }}>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={logout}>
          <IconLogout width={14} height={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
