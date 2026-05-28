import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import "../css/UserManagement.css";
export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    subject_code: "",
    description: "",
    units: 3,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete subject ${code}?`)) {
      try {
        const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
        if (res.ok) fetchSubjects();
      } catch (err) {
        console.error("Error deleting subject:", err);
      }
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({ id: "", subject_code: "", description: "", units: 3 });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditMode(true);
    setFormData({
      id: subject.id,
      subject_code: subject.subject_code,
      description: subject.description,
      units: subject.units,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editMode ? `/api/subjects/${formData.id}` : `/api/subjects`;
    const method = editMode ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchSubjects();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Error saving subject:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="user-management-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="page-title">
            <h1>Manage Subjects</h1>
            <p>Add, edit, or remove subjects available for enrollment.</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={openCreateModal}>
              <Plus size={18} /> Create New Subject
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-card">
          {loading ? (
            <div className="loading-state">Loading subjects...</div>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Subject Code</th>
                  <th>Description</th>
                  <th>Units</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="user-row">
                      <td
                        style={{
                          fontWeight: "bold",
                          color: "var(--orange-500)",
                        }}
                      >
                        {subject.subject_code}
                      </td>
                      <td>{subject.description}</td>
                      <td>{subject.units}</td>
                      <td>
                        <div
                          className="action-btns"
                          style={{ justifyContent: "flex-end" }}
                        >
                          <button
                            className="icon-btn edit"
                            onClick={() => openEditModal(subject)}
                            title="Edit Subject"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() =>
                              handleDelete(subject.id, subject.subject_code)
                            }
                            title="Delete Subject"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editMode ? "Edit Subject" : "Create New Subject"}</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IT ELEC 4"
                    value={formData.subject_code}
                    onChange={(e) =>
                      setFormData({ ...formData, subject_code: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Integrative Programming 2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Units</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="6"
                    value={formData.units}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        units: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <button type="submit" className="submit-btn">
                  {editMode ? "Save Changes" : "Create Subject"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
