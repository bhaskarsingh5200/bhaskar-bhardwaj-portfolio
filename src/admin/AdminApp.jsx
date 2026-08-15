import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import { ToastProvider } from "./ui.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminLayout from "./AdminLayout.jsx";
import AdminLogin from "./AdminLogin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectsAdmin from "./pages/ProjectsAdmin.jsx";
import ServicesAdmin from "./pages/ServicesAdmin.jsx";
import SkillsAdmin from "./pages/SkillsAdmin.jsx";
import AboutAdmin from "./pages/AboutAdmin.jsx";
import MessagesAdmin from "./pages/MessagesAdmin.jsx";
import SettingsAdmin from "./pages/SettingsAdmin.jsx";
import SeoAdmin from "./pages/SeoAdmin.jsx";
import ThemeAdmin from "./pages/ThemeAdmin.jsx";

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="skills" element={<SkillsAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="messages" element={<MessagesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
            <Route path="seo" element={<SeoAdmin />} />
            <Route path="theme" element={<ThemeAdmin />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
