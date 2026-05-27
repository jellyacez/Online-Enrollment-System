import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalStudents: 0, totalSubjects: 0, totalEnrollments: 0 });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>Admin Dashboard</h1>
      
      <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
        <div style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
          <h2>Total Students</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalStudents}</p>
        </div>
        <div style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
          <h2>Total Subjects</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalSubjects}</p>
        </div>
        <div style={{ background: "#f4f4f4", padding: "20px", borderRadius: "8px", flex: 1, textAlign: "center" }}>
          <h2>Total Enrollments</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalEnrollments}</p>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
