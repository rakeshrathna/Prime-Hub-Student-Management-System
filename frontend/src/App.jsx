import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ROLE_HOME } from "./utils/navConfig";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminLeaves from "./pages/admin/AdminLeaves";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherTeams from "./pages/teacher/TeacherTeams";
import TeacherTasks from "./pages/teacher/TeacherTasks";
import TeacherGrading from "./pages/teacher/TeacherGrading";
import TeacherLeaves from "./pages/teacher/TeacherLeaves";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";
import TeacherNotes from "./pages/teacher/TeacherNotes";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentTasks from "./pages/student/StudentTasks";
import StudentTeam from "./pages/student/StudentTeam";
import StudentLeave from "./pages/student/StudentLeave";
import StudentAnnouncements from "./pages/student/StudentAnnouncements";
import StudentNotes from "./pages/student/StudentNotes";
import StudentProfile from "./pages/student/StudentProfile";

function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allow={["ADMIN"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/leaves" element={<AdminLeaves />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={["TEACHER"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/teams" element={<TeacherTeams />} />
          <Route path="/teacher/tasks" element={<TeacherTasks />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />
          <Route path="/teacher/leaves" element={<TeacherLeaves />} />
          <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
          <Route path="/teacher/notes" element={<TeacherNotes />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allow={["STUDENT"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/tasks" element={<StudentTasks />} />
          <Route path="/student/team" element={<StudentTeam />} />
          <Route path="/student/leave" element={<StudentLeave />} />
          <Route path="/student/announcements" element={<StudentAnnouncements />} />
          <Route path="/student/notes" element={<StudentNotes />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
