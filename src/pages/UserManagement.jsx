import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      alert("Cannot delete admin users directly.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsers();
        } else {
          alert("Failed to delete user.");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <h1>User Management</h1>
        <p>Manage all registered students in the system.</p>
        
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>ID</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Full Name</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Email</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Role</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.id}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}><strong>{u.full_name}</strong></td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      background: u.role === 'admin' ? '#007bff' : '#28a745', 
                      color: 'white', 
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "right" }}>
                    <button 
                      onClick={() => handleDelete(u.id, u.role)}
                      style={{ 
                        padding: "6px 12px", 
                        background: u.role === 'admin' ? '#ccc' : '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: u.role === 'admin' ? 'not-allowed' : 'pointer'
                      }}
                      disabled={u.role === 'admin'}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
