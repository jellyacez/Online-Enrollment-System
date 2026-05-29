import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Plus, Search, Edit2, Archive, X } from "lucide-react";
import "../css/UserManagement.css";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("active");
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 10;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    email: "",
    role: "student",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchArchivedUsers();
  }, []);

  const fetchUsers = async (search = "", page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}&limit=${LIMIT}`,
      );
      const data = await res.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / LIMIT));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    fetchUsers(value, 1);
  };

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
    if (role === "admin") {
      alert("Cannot delete admin users directly.");
      return;
    }
    if (
      window.confirm("Are you sure you want to delete and archive this user?")
    ) {
      try {
        const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchUsers(searchTerm, currentPage);
          fetchArchivedUsers();
        }
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleQuickRoleChange = async (user, newRole) => {
    if (
      !window.confirm(
        `Change ${user.full_name}'s role to ${newRole.toUpperCase()}?`,
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: user.full_name,
          email: user.email,
          role: newRole,
        }),
      });
      if (res.ok) fetchUsers(searchTerm, currentPage);
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({
      id: "",
      full_name: "",
      email: "",
      role: "student",
      password: "",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditMode(true);
    setFormData({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `/api/admin/users/${formData.id}`
      : `/api/admin/users`;
    const method = editMode ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchUsers(searchTerm, currentPage);
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // --- Table Column Definitions ---
  const activeColumns = useMemo(
    () => [
      { header: "ID", accessorKey: "id" },
      {
        header: "Full Name",
        accessorKey: "full_name",
        cell: (info) => <span className="user-name">{info.getValue()}</span>,
      },
      { header: "Email", accessorKey: "email" },
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) => {
          const u = info.row.original;
          return (
            <select
              className={`role-select ${u.role}`}
              value={u.role}
              onChange={(e) => handleQuickRoleChange(u, e.target.value)}
            >
              <option value="student">STUDENT</option>
              <option value="admin">ADMIN</option>
            </select>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: (info) => {
          const u = info.row.original;
          return (
            <div className="action-btns">
              <button
                className="icon-btn edit"
                onClick={() => openEditModal(u)}
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="icon-btn delete"
                onClick={() => handleDelete(u.id, u.role)}
                disabled={u.role === "admin"}
                title="Archive"
              >
                <Archive size={16} />
              </button>
            </div>
          );
        },
      },
    ],

    [searchTerm, currentPage],
  );

  const archivedColumns = useMemo(
    () => [
      { header: "ID", accessorKey: "original_user_id" },
      { header: "Full Name", accessorKey: "full_name" },
      { header: "Email", accessorKey: "email" },
      {
        header: "Role",
        accessorKey: "role",
        cell: (info) => <span className="role-badge">{info.getValue()}</span>,
      },
      {
        header: "Archived At",
        accessorKey: "archived_at",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: activeTab === "active" ? users : archivedUsers,
    columns: activeTab === "active" ? activeColumns : archivedColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <DashboardLayout>
      <div className="user-management-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-title">
            <h1>User Management</h1>
            <p>Manage active students and view archived accounts.</p>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={18} /> Create New User
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Users
          </button>
          <button
            className={`tab-btn ${activeTab === "archived" ? "active" : ""}`}
            onClick={() => setActiveTab("archived")}
          >
            Archived Users
          </button>
        </div>

        {/* Table Section */}
        <div className="table-card">
          {loading ? (
            <div className="loading-state">Loading users...</div>
          ) : (
            <>
              <table className="user-table">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="user-row">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {!loading && table.getRowModel().rows.length === 0 && (
                    <tr>
                      <td colSpan="100%" className="empty-state">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {activeTab === "active" && totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => {
                      const p = currentPage - 1;
                      setCurrentPage(p);
                      fetchUsers(searchTerm, p);
                    }}
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const p = currentPage + 1;
                      setCurrentPage(p);
                      fetchUsers(searchTerm, p);
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editMode ? "Edit User" : "Create New User"}</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {!editMode && (
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}
                <button type="submit" className="submit-btn">
                  {editMode ? "Save Changes" : "Create User"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
