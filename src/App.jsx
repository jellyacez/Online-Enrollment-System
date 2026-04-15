import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Payment from "./pages/Payment";
import ManageSubjects from "./pages/ManageSubjects";
export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/student-management" element={<ManageSubjects />} />
    </Routes>
  );
}
