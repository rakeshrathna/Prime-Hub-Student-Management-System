import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Avatar from "../../components/common/Avatar";
import { IconTeam } from "../../components/common/icons";
import { getStudentTeam } from "../../api/student";
import { formatDate, resolveAssetUrl } from "../../utils/format";
import { useAuth } from "../../context/AuthContext";

export default function StudentTeam() {
  const { user, apiBaseUrl } = useAuth();
  const [team, setTeam] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getStudentTeam(user.id)
      .then((data) => active && setTeam(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [user.id]);

  return (
    <>
      <PageHeader title="My team" description="The group you've been placed in for team assignments." />

      {loading ? (
        <Loader label="Loading team" />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : !team ? (
        <div className="card">
          <EmptyState
            icon={<IconTeam width={18} height={18} />}
            title="Not on a team yet"
            description="Your teacher hasn't added you to a team. Team assignments will appear here once you're grouped."
          />
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <div className="card-header-text">
              <h3>{team.teamName}</h3>
              <p>Created {formatDate(team.createdAt)} by {team.createdBy?.name || "—"}</p>
            </div>
          </div>
          <div className="card-body">
            <div className="section-title">Members ({team.members?.length || 0})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {team.members?.map((m) => (
                <div key={m.userId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <Avatar name={m.name} src={resolveAssetUrl(m.profileImageUrl, apiBaseUrl)} />
                  <div>
                    <div className="cell-primary">{m.name}{m.userId === user.id ? " (you)" : ""}</div>
                    <div className="cell-secondary">{m.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
