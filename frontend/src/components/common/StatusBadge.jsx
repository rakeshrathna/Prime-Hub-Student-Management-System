const MAP = {
  PENDING: "warning",
  COMPLETED: "success",
  APPROVED: "success",
  REJECTED: "danger",
  HIGH: "danger",
  MEDIUM: "warning",
  NORMAL: "neutral",
  INDIVIDUAL: "info",
  TEAM: "info",
  GRADED: "success",
};

export default function StatusBadge({ status, label }) {
  if (!status) return null;
  const variant = MAP[status] || "neutral";
  return <span className={`badge badge-${variant}`}>{label || status.toLowerCase()}</span>;
}
