import {
  IconDashboard,
  IconUsers,
  IconTasks,
  IconTeam,
  IconGrade,
  IconLeave,
  IconAnnouncement,
  IconNote,
  IconProfile,
} from "../components/common/icons";

export const NAV_BY_ROLE = {
  ADMIN: [
    {
      section: "Overview",
      items: [{ label: "Dashboard", to: "/admin", icon: IconDashboard, end: true }],
    },
    {
      section: "Administration",
      items: [
        { label: "Users", to: "/admin/users", icon: IconUsers },
        { label: "Tasks", to: "/admin/tasks", icon: IconTasks },
        { label: "Leave approvals", to: "/admin/leaves", icon: IconLeave },
        { label: "Announcements", to: "/admin/announcements", icon: IconAnnouncement },
      ],
    },
  ],
  TEACHER: [
    {
      section: "Overview",
      items: [{ label: "Dashboard", to: "/teacher", icon: IconDashboard, end: true }],
    },
    {
      section: "Classroom",
      items: [
        { label: "Students", to: "/teacher/students", icon: IconUsers },
        { label: "Teams", to: "/teacher/teams", icon: IconTeam },
        { label: "Tasks", to: "/teacher/tasks", icon: IconTasks },
        { label: "Grading", to: "/teacher/grading", icon: IconGrade },
      ],
    },
    {
      section: "Operations",
      items: [
        { label: "Leave approvals", to: "/teacher/leaves", icon: IconLeave },
        { label: "Announcements", to: "/teacher/announcements", icon: IconAnnouncement },
        { label: "Student notes", to: "/teacher/notes", icon: IconNote },
      ],
    },
  ],
  STUDENT: [
    {
      section: "Overview",
      items: [{ label: "Dashboard", to: "/student", icon: IconDashboard, end: true }],
    },
    {
      section: "Academics",
      items: [
        { label: "My tasks", to: "/student/tasks", icon: IconTasks },
        { label: "My team", to: "/student/team", icon: IconTeam },
        { label: "Leave requests", to: "/student/leave", icon: IconLeave },
        { label: "Notes from teachers", to: "/student/notes", icon: IconNote },
      ],
    },
    {
      section: "School",
      items: [
        { label: "Announcements", to: "/student/announcements", icon: IconAnnouncement },
        { label: "Profile", to: "/student/profile", icon: IconProfile },
      ],
    },
  ],
};

export const ROLE_HOME = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};
