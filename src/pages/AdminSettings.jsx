import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function AdminSettings() {
  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>Admin Settings</h1>
        <p>System configuration options will go here (e.g., Toggle enrollment period, Manage User Roles).</p>
        
        <div style={{ marginTop: "30px", padding: "20px", background: "#fff", border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Enrollment Status</h3>
          <label>
            <input type="checkbox" defaultChecked /> Enable Student Enrollment
          </label>
          <br /><br />
          <button style={{ padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>Save Settings</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
