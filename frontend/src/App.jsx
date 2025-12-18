import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";

import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import "./main.css";

// ------------------- PROTECTED ROUTE -------------------
function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  // ⭐ Fix blinking (wait until token is loaded)
  if (loading) return null;

  return token ? children : <Navigate to="/login" replace />;
}

// ------------------- MAIN ROUTING -------------------
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className={isLoginPage ? "login-body" : ""}>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES WITH LAYOUT */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* DEFAULT → If no route, send to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </div>
  );
}

// ------------------- APP ROOT -------------------
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
