// Small, consistent 16x16 stroke icon set. Kept in one file so every icon
// shares the same stroke width and visual weight.
const common = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconDashboard = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

export const IconUsers = (p) => (
  <svg {...common} {...p}>
    <circle cx="9" cy="7" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="8" r="2.6" />
    <path d="M15.5 14.3c2.6.4 4.5 2.7 4.5 5.7" />
  </svg>
);

export const IconTasks = (p) => (
  <svg {...common} {...p}>
    <path d="M9 6h11" />
    <path d="M9 12h11" />
    <path d="M9 18h11" />
    <path d="M4 6l1.3 1.3L7.5 5" />
    <path d="M4 12l1.3 1.3L7.5 11" />
    <path d="M4 18l1.3 1.3L7.5 17" />
  </svg>
);

export const IconTeam = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="8" />
    <rect x="3" y="13" width="8" height="8" />
    <rect x="13" y="13" width="8" height="8" />
  </svg>
);

export const IconGrade = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9L12 3z" />
  </svg>
);

export const IconLeave = (p) => (
  <svg {...common} {...p}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
  </svg>
);

export const IconAnnouncement = (p) => (
  <svg {...common} {...p}>
    <path d="M4 10v4h3l5 4V6L7 10H4z" />
    <path d="M16 9c1 1 1 5 0 6" />
    <path d="M19 7c2 2.5 2 7.5 0 10" />
  </svg>
);

export const IconNote = (p) => (
  <svg {...common} {...p}>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4" />
    <path d="M9 12h7" />
    <path d="M9 16h7" />
  </svg>
);

export const IconProfile = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);

export const IconLogout = (p) => (
  <svg {...common} {...p}>
    <path d="M10 4H5v16h5" />
    <path d="M15 8l4 4-4 4" />
    <path d="M19 12H9" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...common} {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = (p) => (
  <svg {...common} {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V4h6v3" />
    <path d="M6 7l1 13h10l1-13" />
  </svg>
);

export const IconEdit = (p) => (
  <svg {...common} {...p}>
    <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...common} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconSchool = (p) => (
  <svg {...common} {...p}>
    <path d="M12 3l10 5-10 5L2 8l10-5z" />
    <path d="M6 11v6c0 1.7 2.7 3 6 3s6-1.3 6-3v-6" />
  </svg>
);

export const IconCheck = (p) => (
  <svg {...common} {...p}>
    <path d="M4 12l5 5L20 6" />
  </svg>
);

export const IconClose = (p) => (
  <svg {...common} {...p}>
    <path d="M5 5l14 14" />
    <path d="M19 5L5 19" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg {...common} {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);
