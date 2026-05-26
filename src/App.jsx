import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/login";
import SignupExtended from "./pages/SignupExtended";
import About from "./pages/about";
import Payment from "./pages/Payment";
import ManageSubjects from "./pages/ManageSubjects";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEnrollments from "./pages/AdminEnrollments";
import AuditLogs from "./pages/AuditLogs";
import AdminSettings from "./pages/AdminSettings";
import UserManagement from "./pages/UserManagement";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace state={{ message: "You have been logged out. Please log in again." }} />;
  }

  try {
    const user = JSON.parse(userStr);
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/home" replace />;
    }
  } catch (err) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function Routing() {
  const location = useLocation();

  return (
    <div style={{ backgroundColor: "#FDFDFD", minHeight: "100vh" }}>
      <Routes location={location} key={location.pathname}>
        <Route path="/home" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup-extended" element={<SignupExtended />} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/student-management" element={<ProtectedRoute><ManageSubjects /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/enrollments" element={<ProtectedRoute requiredRole="admin"><AdminEnrollments /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/audit-logs" element={<ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
        
        <Route path="/" element={<About />} />
      </Routes>
    </div>
  );
}
