import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  Activity,
  Library,
  UserCheck,
  ScrollText,
  Plus,
  FileText,
  PieChart as PieChartIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import "../css/admindashboard.css";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  // Helper to generate the last 7 days chronologically
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
            name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // e.g. "May 28"
            fullDate: d.toDateString(), // for easy matching
            enrollments: 0
        });
    }
    return days;
  };

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    activeUsers: 0,
    auditLogs: 0,
    recentEnrollees: [],
    // Default empty chart structure using chronological 7 days
    enrollmentTrends: getLast7Days(),
    programDistribution: []
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch standard dashboard stats
        const statsRes = await fetch("/api/admin/stats");
        const statsData = statsRes.ok ? await statsRes.json() : {};

        // 2. Fetch REAL enrollments to get Recent students, Pending count, AND Chart Data
        let realRecent = [];
        let realPending = 0;
        let calculatedTrends = getLast7Days();

        try {
          const enrollRes = await fetch("/api/enrollments");
          if (enrollRes.ok) {
            const enrollData = await enrollRes.json();

            // Count pending status
            realPending = enrollData.filter(
              (e) => e.status === "pending",
            ).length;

            // Get the 5 most recent real enrollees
            realRecent = [...enrollData]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map((e) => ({
                id: e.id,
                name: e.student_name,
                course: e.subject_code || "N/A",
                date: new Date(e.created_at).toLocaleDateString(),
              }));

            // Dynamically calculate Chart Data chronologically for the last 7 days
            enrollData.forEach((enrollment) => {
              if (enrollment.created_at) {
                const enrollDate = new Date(enrollment.created_at).toDateString();
                const trendDay = calculatedTrends.find(t => t.fullDate === enrollDate);
                if (trendDay) {
                  trendDay.enrollments += 1;
                }
              }
            });
          }
        } catch (e) {
          console.error("Could not fetch real enrollments", e);
        }

        // 3. Fetch Real Audit Logs (count AND recent)
        let realAuditLogs = 0;
        let recentActivity = [];
        try {
          const auditRes = await fetch("/api/audit");
          if (auditRes.ok) {
            const auditData = await auditRes.json();
            realAuditLogs = auditData.length || 0;
            
            // Get the 5 most recent audit logs
            recentActivity = [...auditData]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map(log => ({
                  id: log.id,
                  action: log.action,
                  user: log.user_name || "System",
                  date: new Date(log.created_at).toLocaleDateString(),
              }));
          }
        } catch (e) {}

        // 4. NEW: Fetch Real Active Users count
        let realActiveUsers = 0;
        try {
          const usersRes = await fetch("/api/active-users/count");
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            realActiveUsers = usersData.total || 0;
          }
        } catch (e) {}

        // 5. Update the state securely with all our real data
        setStats((prev) => ({
          ...prev,
          totalStudents: statsData.totalStudents ?? prev.totalStudents,
          totalSubjects: statsData.totalSubjects ?? prev.totalSubjects,
          totalCourses: statsData.totalCourses ?? prev.totalCourses,
          totalEnrollments: statsData.totalEnrollments ?? prev.totalEnrollments,
          programDistribution: statsData.programDistribution ? statsData.programDistribution.map(d => ({ name: d.name, value: parseInt(d.value, 10) })) : prev.programDistribution,

          activeUsers: realActiveUsers, // <--- Now uses the real database count!
          pendingEnrollments: realPending,
          recentEnrollees: realRecent,
          auditLogs: realAuditLogs,
          recentActivity: recentActivity,
          enrollmentTrends: calculatedTrends,
        }));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="admin-header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <h1 className="dashboard-header">Admin Dashboard</h1>
            <p className="header-subtitle">
              Overview of your university stats and data.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button 
              onClick={() => navigate("/admin/users")}
              style={{ padding: "8px 16px", background: "white", color: "var(--orange-500)", border: "1px solid var(--orange-500)", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "var(--orange-500)"; e.currentTarget.style.color = "white"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--orange-500)"; }}
            >
              <Plus size={16} /> Add New Student
            </button>
            <button 
              onClick={() => navigate("/admin/subjects")}
              style={{ padding: "8px 16px", background: "white", color: "var(--orange-500)", border: "1px solid var(--orange-500)", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "var(--orange-500)"; e.currentTarget.style.color = "white"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--orange-500)"; }}
            >
              <Plus size={16} /> Add New Subject
            </button>
            <button 
              onClick={() => navigate("/admin/enrollments")}
              style={{ padding: "8px 16px", background: "white", color: "var(--orange-500)", border: "1px solid var(--orange-500)", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseOver={(e) => { e.currentTarget.style.background = "var(--orange-500)"; e.currentTarget.style.color = "white"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--orange-500)"; }}
            >
              <FileText size={16} /> Review Pending Enrollments
            </button>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon-box" style={{ background: "#e0f2fe" }}>
              <Users color="#0284c7" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Students</h3>
              <p>{stats.totalStudents || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#fef3c7" }}>
              <BookOpen color="#d97706" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Subjects</h3>
              <p>{stats.totalSubjects || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#ede9fe" }}>
              <Library color="#7c3aed" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Courses</h3>
              <p>{stats.totalCourses || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#dcfce7" }}>
              <GraduationCap color="#16a34a" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Enrollments</h3>
              <p>{stats.totalEnrollments || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#ffedd5" }}>
              <Clock color="#ea580c" size={24} />
            </div>
            <div className="stat-info">
              <h3>Pending Requests</h3>
              <p>{stats.pendingEnrollments || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#ccfbf1" }}>
              <UserCheck color="#0d9488" size={24} />
            </div>
            <div className="stat-info">
              <h3>Active Users</h3>
              <p>{stats.activeUsers || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box" style={{ background: "#f3f4f6" }}>
              <ScrollText color="#4b5563" size={24} />
            </div>
            <div className="stat-info">
              <h3>Audit Logs</h3>
              <p>{stats.auditLogs}</p>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID (Chart & Table) --- */}
        <div className="dashboard-content">
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Time Series Chart */}
            <div className="chart-section">
            <h2 className="section-title">
              <Activity
                size={18}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "text-bottom",
                }}
              />
              Enrollment Overview
            </h2>
            <div style={{ width: "100%", height: "350px", overflowX: "auto" }}>
                <LineChart
                  width={600}
                  height={300}
                  data={stats.enrollmentTrends}
                  margin={{ top: 15, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "white",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
            </div>
          </div>

          {/* Demographics Pie Chart */}
          <div className="chart-section">
            <h2 className="section-title">
              <PieChartIcon
                size={18}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "text-bottom",
                }}
              />
              Student Demographics (By Program)
            </h2>
            <div style={{ width: "100%", height: "400px", overflowX: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {stats.programDistribution && stats.programDistribution.length > 0 ? (
                <div style={{ position: "relative", width: "100%", maxWidth: "700px", height: "350px" }}>
                  <Doughnut
                    data={{
                      labels: stats.programDistribution.map(d => d.name),
                      datasets: [{
                        data: stats.programDistribution.map(d => d.value),
                        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6', '#475569'],
                        borderWidth: 2,
                        hoverOffset: 4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'right',
                          labels: { font: { size: 13, family: "Segoe UI" }, padding: 20 }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "#888" }}>
                  No demographic data available.
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Right Column Stack (Recent Enrollees + Recent Activity) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Recent Enrollees Table */}
            <div className="table-section">
              <h2 className="section-title">Recent Enrollees</h2>
              <div style={{ overflowX: "auto" }}>
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Course/Subject</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentEnrollees &&
                    stats.recentEnrollees.length > 0 ? (
                      stats.recentEnrollees.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <strong>{student.name}</strong>
                          </td>
                          <td>{student.course}</td>
                          <td>{student.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#888",
                          }}
                        >
                          No recent enrollees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Log */}
            <div className="table-section">
              <h2 className="section-title">Recent Activity</h2>
              <div style={{ overflowX: "auto" }}>
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentActivity &&
                    stats.recentActivity.length > 0 ? (
                      stats.recentActivity.map((log) => {
                        let color = "#333";
                        if (log.action.includes("CREATE") || log.action.includes("REGISTER") || log.action.includes("ENROLL")) color = "#28a745";
                        if (log.action.includes("DELETE") || log.action.includes("DROP") || log.action.includes("ARCHIVE") || log.action.includes("REJECT")) color = "#dc3545";
                        if (log.action.includes("UPDATE") || log.action.includes("LOGIN") || log.action.includes("APPROVE")) color = "#007bff";
                        
                        return (
                          <tr key={log.id}>
                            <td>
                              <strong>{log.user}</strong>
                            </td>
                            <td style={{ color, fontWeight: "bold" }}>{log.action}</td>
                            <td>{log.date}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#888",
                          }}
                        >
                          No recent activity found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
