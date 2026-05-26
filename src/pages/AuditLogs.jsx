import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/audit");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };
    fetchLogs();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>System Audit Logs</h1>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Timestamp</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>User</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Action</th>
              <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{new Date(log.created_at).toLocaleString()}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{log.user_name || "System/Unknown"} ({log.email || "N/A"})</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}><strong>{log.action}</strong></td>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
