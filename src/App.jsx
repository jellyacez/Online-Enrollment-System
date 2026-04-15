import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Nav";
import Homepage from "./pages/Homepage";
import Payment from "./pages/Payment";
import ManageSubjects from "./pages/ManageSubjects";
import Login from "./pages/login";

export default function Routing() {
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase().includes("login");
  const isHomepage = location.pathname === "/";

  return (
    <>
      {/* Homepage has its own nav — skip the old Navbar */}
      {!isLoginPage && !isHomepage && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/student-management" element={<ManageSubjects />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}