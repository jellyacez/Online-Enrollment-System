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
    subject_type: "general",
    aligned_program: "",
  });

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionFormData, setSectionFormData] = useState({
    subject_id: "",
    name: "",
    schedule: "",
    max_slots: 40,
    instructor: "",
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
    setFormData({ id: "", subject_code: "", description: "", units: 3, subject_type: "general", aligned_program: "" });
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditMode(true);
    setFormData({
      id: subject.id,
      subject_code: subject.subject_code,
      description: subject.description,
      units: subject.units,
      subject_type: subject.subject_type || "general",
      aligned_program: subject.aligned_program || "",
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

  const openSectionModal = (subject) => {
    setSectionFormData({
      subject_id: subject.id,
      name: "",
      schedule: "",
      max_slots: 40,
      instructor: "",
    });
    setShowSectionModal(true);
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionFormData),
      });
      if (res.ok) {
        setShowSectionModal(false);
        alert("Section created successfully!");
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.message}`);
      }
    } catch (err) {
      console.error("Error creating section:", err);
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
                  <th>Type</th>
                  <th>Aligned Program</th>
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
                      <td>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "12px", 
                          fontSize: "0.85em",
                          backgroundColor: subject.subject_type === 'major' ? 'var(--orange-100)' : '#e2e3e5',
                          color: subject.subject_type === 'major' ? 'var(--orange-800)' : '#383d41'
                        }}>
                          {subject.subject_type === 'major' ? 'Major' : 'General'}
                        </span>
                      </td>
                      <td>{subject.aligned_program || "-"}</td>
                      <td>{subject.units}</td>
                      <td>
                        <div
                          className="action-btns"
                          style={{ justifyContent: "flex-end" }}
                        >
                          <button
                            className="icon-btn edit"
                            onClick={() => openSectionModal(subject)}
                            title="Add Section"
                            style={{ background: 'var(--green-100)', color: 'var(--green-700)' }}
                          >
                            <Plus size={16} />
                          </button>
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
                <div className="form-group">
                  <label>Subject Type</label>
                  <select
                    value={formData.subject_type}
                    onChange={(e) =>
                      setFormData({ ...formData, subject_type: e.target.value })
                    }
                    style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
                  >
                    <option value="general">General (All Programs)</option>
                    <option value="major">Major (Specific Program)</option>
                  </select>
                </div>
                {formData.subject_type === "major" && (
                  <div className="form-group">
                    <label>Aligned Program</label>
                    <select
                      required
                      value={formData.aligned_program}
                      onChange={(e) =>
                        setFormData({ ...formData, aligned_program: e.target.value })
                      }
                      style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", width: "100%" }}
                    >
                      <option value="">Select a course</option>
                      <option value="BS Information Technology">BS Information Technology</option>
                      <option value="BS Computer Science">BS Computer Science</option>
                      <option value="BS Information Systems">BS Information Systems</option>
                      <option value="BS Business Administration">BS Business Administration</option>
                      <option value="BS Accountancy">BS Accountancy</option>
                      <option value="BS Nursing">BS Nursing</option>
                      <option value="BS Civil Engineering">BS Civil Engineering</option>
                      <option value="BS Mechanical Engineering">BS Mechanical Engineering</option>
                    </select>
                  </div>
                )}
                <button type="submit" className="submit-btn">
                  {editMode ? "Save Changes" : "Create Subject"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Section Modal */}
        {showSectionModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Add Section</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowSectionModal(false)}
                >
                  <X />
                </button>
              </div>
              <form onSubmit={handleSectionSubmit} className="modal-form">
                <div className="form-group">
                  <label>Section Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Info 3-C"
                    value={sectionFormData.name}
                    onChange={(e) =>
                      setSectionFormData({ ...sectionFormData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mon/Wed 8:00 AM - 9:30 AM"
                    value={sectionFormData.schedule}
                    onChange={(e) =>
                      setSectionFormData({ ...sectionFormData, schedule: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Smith"
                    value={sectionFormData.instructor}
                    onChange={(e) =>
                      setSectionFormData({ ...sectionFormData, instructor: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Max Slots</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={sectionFormData.max_slots}
                    onChange={(e) =>
                      setSectionFormData({
                        ...sectionFormData,
                        max_slots: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <button type="submit" className="submit-btn" style={{ background: 'var(--green-500)' }}>
                  Create Section
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
