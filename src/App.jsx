import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Nav";
import Homepage from "./pages/Homepage";
import Payment from "./pages/Payment";
import ManageSubjects from "./pages/ManageSubjects";
import Login from "./pages/login";
import About from "./pages/about";
import AdminDashboard from "./pages/AdminDashboard";
import AuditLogs from "./pages/AuditLogs";
import AdminSettings from "./pages/AdminSettings";
import UserManagement from "./pages/UserManagement";

export default function Routing() {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase().includes("login");
  return (
    <>
      {!isLoginPage}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/student-management" element={<ManageSubjects />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/" element={<About />} />
      </Routes>
    </>
  );
}
