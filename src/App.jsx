import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Payment from "./pages/Payment";
import StudentManagement from "./pages/StudentManagement";
export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/student-management" element={<StudentManagement />} />
    </Routes>
  );
}
