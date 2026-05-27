import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("active");
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  //nilagay koto tehee -D
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: "", full_name: "", email: "", role: "student", password: "" });

  useEffect(() => {
    fetchUsers();
    fetchArchivedUsers();
  }, []);

  const fetchUsers = async (search = "",page = 1) => {
    setLoading(true);
    try {
      // const res = await fetch("/api/admin/users");
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=${LIMIT}`) //incase
      const data = await res.json();
      setUsers(data);
      setTotalPages(Math.ceil(data.total / LIMIT));//case
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };


const handleSearchChange = (e)=>{
  const value = e.target.value;
  setSearchTerm(value);
  fetchUsers(value);
}

  const fetchArchivedUsers = async () => {
    try {
      const res = await fetch("/api/admin/archived_users");
      const data = await res.json();
      setArchivedUsers(data);
    } catch (err) {
      console.error("Error fetching archived users:", err);
    }
  };

  const handleDelete = async (id, role) => {
    if (role === 'admin') {
      alert("Cannot delete admin users directly.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete and archive this user?")) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsers();
          fetchArchivedUsers();
        } else {
          alert("Failed to delete user.");
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({ id: "", full_name: "", email: "", role: "student", password: "" });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setFormData({ id: user.id, full_name: user.full_name, email: user.email, role: user.role, password: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode ? `/api/admin/users/${formData.id}` : `/api/admin/users`;
    const method = editMode ? "PUT" : "POST";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchUsers();
      } else {
        alert("Failed to save user.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>User Management</h1>
            <p>Manage active students and view archived accounts.</p>
          </div>
    //seawrch
          <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={handleSearchChange} style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #ccc" }}
  />
          <button 
            onClick={openCreateModal}
            style={{ padding: "10px 20px", background: "var(--orange-500)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
          >
            + Create New User
          </button>
        </div>
        
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
          <button 
            onClick={() => setActiveTab("active")}
            style={{ background: "none", border: "none", fontSize: "1.1rem", fontWeight: activeTab === "active" ? "bold" : "normal", color: activeTab === "active" ? "var(--orange-700)" : "#666", cursor: "pointer" }}
          >
            Active Users
          </button>
          <button 
            onClick={() => setActiveTab("archived")}
            style={{ background: "none", border: "none", fontSize: "1.1rem", fontWeight: activeTab === "archived" ? "bold" : "normal", color: activeTab === "archived" ? "var(--orange-700)" : "#666", cursor: "pointer" }}
          >
            Archived Users
          </button>
        </div>

        {loading ? (
          <p style={{ marginTop: "20px" }}>Loading users...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
              <tr style={{ background: "#eee", textAlign: "left" }}>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>ID</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Full Name</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Email</th>
                <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Role</th>
                {activeTab === "archived" && <th style={{ padding: "10px", borderBottom: "2px solid #ccc" }}>Archived At</th>}
                {activeTab === "active" && <th style={{ padding: "10px", borderBottom: "2px solid #ccc", textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {activeTab === "active" ? users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.id}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}><strong>{u.full_name}</strong></td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <span style={{ padding: "4px 8px", background: u.role === 'admin' ? '#007bff' : '#28a745', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button 
                      onClick={() => openEditModal(u)}
                      style={{ padding: "6px 12px", background: '#f8f9fa', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(u.id, u.role)}
                      style={{ padding: "6px 12px", background: u.role === 'admin' ? '#ccc' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: u.role === 'admin' ? 'not-allowed' : 'pointer' }}
                      disabled={u.role === 'admin'}
                    >
                      Archive & Delete
                    </button>
                  </td>
                </tr>
              )) : archivedUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.original_user_id}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}><strong>{u.full_name}</strong></td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{u.email}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    <span style={{ padding: "4px 8px", background: '#6c757d', color: 'white', borderRadius: '4px', fontSize: '0.8rem' }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                    {new Date(u.archived_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
  <button 
    disabled={currentPage === 1}
    onClick={() => {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchUsers(searchTerm, newPage);
    }}
  >
    Previous
  </button>
  
  <span>Page {currentPage} of {totalPages}</span>
  
  <button 
    disabled={currentPage === totalPages}
    onClick={() => {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchUsers(searchTerm, newPage);
    }}
  >
    Next
  </button>
</div>
          </table>
        )}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editMode ? "Edit User" : "Create New User"}</h2>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Full Name</label>
                    <input 
                      type="text" required value={formData.full_name} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email</label>
                    <input 
                      type="email" required value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Role</label>
                    <select 
                      value={formData.role} 
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {!editMode && (
                    <div>
                      <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Password</label>
                      <input 
                        type="password" required value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                      />
                    </div>
                  )}
                  <button type="submit" style={{ padding: "12px", background: "var(--orange-500)", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", marginTop: "10px" }}>
                    {editMode ? "Save Changes" : "Create User"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
