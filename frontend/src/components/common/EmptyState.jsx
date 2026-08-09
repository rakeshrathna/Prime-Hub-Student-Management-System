export default function EmptyState({ title, description, icon = "—", action = null }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon mono">{icon}</div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
