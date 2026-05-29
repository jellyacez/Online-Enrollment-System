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
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import "../css/admindashboard.css";

ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
);

export default function AdminDashboard() {
  const navigate = useNavigate();

  /** Generates array of the last 7 days for trend charts. */
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        fullDate: d.toDateString(),
        enrollments: 0,
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
    recentActivities: [],
    programDistribution: [],
    enrollmentTrends: getLast7Days(),
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch aggregate statistics
        const statsRes = await fetch("/api/admin/stats");
        const statsData = statsRes.ok ? await statsRes.json() : {};

        // Fetch recent enrollments for pending requests and charts
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

            // Retrieve top 5 recent enrollees
            realRecent = [...enrollData]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 5)
              .map((e) => ({
                id: e.id,
                name: e.student_name,
                course: e.subject_code || "N/A",
                date: new Date(e.created_at).toLocaleDateString(),
              }));

            // Map enrollments to chronological trend data
            enrollData.forEach((enrollment) => {
              if (enrollment.created_at) {
                const enrollDate = new Date(
                  enrollment.created_at,
                ).toDateString();
                const trendDay = calculatedTrends.find(
                  (t) => t.fullDate === enrollDate,
                );
                if (trendDay) {
                  trendDay.enrollments += 1;
                }
              }
            });
          }
        } catch (e) {
          console.error("Could not fetch real enrollments", e);
        }

        // Fetch system audit logs
        let realAuditLogs = 0;
        try {
          const auditRes = await fetch("/api/audit-logs/count");
          if (auditRes.ok) {
            const auditData = await auditRes.json();
            realAuditLogs = auditData.total || 0;
          }
        } catch {}

        // Fetch active users metric
        let realActiveUsers = 0;
        try {
          const usersRes = await fetch("/api/active-users/count");
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            realActiveUsers = usersData.total || 0;
          }
        } catch {}

        // Fetch latest system activities
        let realActivities = [];
        try {
          const actRes = await fetch("/api/audit");
          if (actRes.ok) {
            const actData = await actRes.json();
            realActivities = actData.slice(0, 5);
          }
        } catch {}

        // Update component state with fetched data
        setStats((prev) => ({
          ...prev,
          totalStudents: statsData.totalStudents ?? prev.totalStudents,
          totalSubjects: statsData.totalSubjects ?? prev.totalSubjects,
          totalCourses: statsData.totalCourses ?? prev.totalCourses,
          totalEnrollments: statsData.totalEnrollments ?? prev.totalEnrollments,
          programDistribution: statsData.programDistribution
            ? statsData.programDistribution.map((d) => ({
                name: d.name,
                value: parseInt(d.value, 10),
              }))
            : prev.programDistribution,

          activeUsers: realActiveUsers,
          pendingEnrollments: realPending,
          recentEnrollees: realRecent,
          recentActivities: realActivities,
          auditLogs: realAuditLogs,
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
        <div
          className="admin-header-section"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="dashboard-header">Admin Dashboard</h1>
            <p className="header-subtitle">
              Overview of your university stats and data.
            </p>
          </div>

          {/* Quick Actions */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/admin/users")}
              className="quick-action-btn primary"
            >
              <Plus size={16} /> Add New Student
            </button>
            <button
              onClick={() => navigate("/admin/subjects")}
              className="quick-action-btn secondary"
            >
              <FileText size={16} /> Add New Subject
            </button>
            <button
              onClick={() => navigate("/admin/enrollments")}
              className="quick-action-btn info"
            >
              <FileText size={16} /> Review Pending Enrollments
            </button>
          </div>
        </div>

        {/* Statistics Overview */}
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

        {/* Main Dashboard Content */}
        <div className="dashboard-content">
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
            {/* Enrollment Trends Chart */}
            <div
              style={{ width: "100%", height: "350px", position: "relative" }}
            >
              <Line
                data={{
                  labels: stats.enrollmentTrends.map((d) => d.name),
                  datasets: [
                    {
                      label: "Enrollments",
                      data: stats.enrollmentTrends.map((d) => d.enrollments),
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.5)",
                      tension: 0.3,
                      pointRadius: 4,
                      pointBackgroundColor: "#3b82f6",
                      borderWidth: 3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                      grid: {
                        color: "#f1f5f9",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      padding: 10,
                      borderRadius: 8,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Demographics Doughnut Chart (Chart.js) */}
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
            <div
              style={{
                width: "100%",
                height: "400px",
                overflowX: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {stats.programDistribution &&
              stats.programDistribution.length > 0 ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "700px",
                    height: "350px",
                  }}
                >
                  <Doughnut
                    data={{
                      labels: stats.programDistribution.map((d) => d.name),
                      datasets: [
                        {
                          data: stats.programDistribution.map((d) => d.value),
                          backgroundColor: [
                            "#3b82f6",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                            "#f97316",
                            "#14b8a6",
                            "#475569",
                          ],
                          borderWidth: 2,
                          hoverOffset: 4,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            font: { size: 13, family: "Segoe UI" },
                            padding: 20,
                          },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    color: "#888",
                  }}
                >
                  No demographic data available.
                </div>
              )}
            </div>
          </div>

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

          {/* Recent Activities Table */}
          <div className="table-section">
            <h2 className="section-title">
              <ScrollText
                size={18}
                style={{
                  display: "inline",
                  marginRight: "8px",
                  verticalAlign: "text-bottom",
                }}
              />
              Recent Activities
            </h2>
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
                  {stats?.recentActivities &&
                  stats.recentActivities.length > 0 ? (
                    stats.recentActivities.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <strong>
                            {log.user_name || log.email || "System"}
                          </strong>
                        </td>
                        <td>
                          {log.action} - {log.details}
                        </td>
                        <td>{new Date(log.created_at).toLocaleString()}</td>
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
                        No recent activities found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
