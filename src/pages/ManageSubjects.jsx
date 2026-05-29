import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import "../css/index.css";
import "../css/ManageSubjects.css";

export default function ManageSubjects() {
  const [ActiveView, setActiveView] = useState("enrolled");
  const [loading, setLoading] = useState(true);

  const [mySubjects, setMySubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [selectedSection, setSelectedSection] = useState({});

  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  useEffect(() => {
    if (!user.id) {
      window.location.href = "/login";
    }
  }, [user.id]);

  useEffect(() => {
    fetchData(true);
    const interval = setInterval(() => {
      fetchData(false);
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, user.email]);

  const fetchData = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      /** Fetch User Profile to get their program */
      const userRes = await fetch(`/api/users/${user.id}`);
      let userProfile = {};
      if (userRes.ok) {
        userProfile = await userRes.json();
      }
      const myProgram = userProfile.program || "";

      /** Fetch all available sections and subject details */
      const sectionsRes = await fetch("/api/sections");
      const sectionsData = await sectionsRes.json();

      /** Fetch student enrollment records */
      const enrollmentsRes = await fetch("/api/enrollments");
      const enrollmentsData = await enrollmentsRes.json();

      /** Filter enrollments for current user */
      const myEnrollments = enrollmentsData.filter(e => e.student_email === user.email);

      /** Map enrolled data to frontend structure */
      const enrolledFormat = myEnrollments.map(e => ({
        id: e.id,
        subject_id: e.subject_id,
        code: e.subject_code,
        name: e.subject_description,
        unit: 3, 
        section: e.section_name || "TBA",
        schedule: e.schedule || "TBA",
        status: e.status
      }));

      setMySubjects(enrolledFormat);

      /** Calculate subjects available for enrollment */
      const enrolledSubjectCodes = enrolledFormat.map(s => s.code);
      
      /** Aggregate sections under their respective subjects */
      const subjectsMap = {};
      sectionsData.forEach(s => {
        // Filter based on subject type and program alignment
        const isGeneral = s.subject_type === 'general' || !s.subject_type;
        const isAlignedMajor = s.subject_type === 'major' && s.aligned_program === myProgram;

        if ((isGeneral || isAlignedMajor) && !enrolledSubjectCodes.includes(s.subject_code)) {
          if (!subjectsMap[s.subject_id]) {
            subjectsMap[s.subject_id] = {
              id: s.subject_id,
              code: s.subject_code,
              name: s.description,
              unit: s.units,
              type: s.subject_type || 'general',
              sections: []
            };
          }
          if (s.section_id) {
            subjectsMap[s.subject_id].sections.push(s);
          }
        }
      });

      const availableFormat = Object.values(subjectsMap);

      setAvailableSubjects(availableFormat);
      
      /** Set default section selections carefully to avoid overwriting user selection */
      setSelectedSection(prev => {
        const nextSelected = { ...prev };
        availableFormat.forEach(sub => {
          if (sub.sections.length > 0 && !nextSelected[sub.id]) {
            nextSelected[sub.id] = sub.sections[0].section_id.toString();
          }
        });
        return nextSelected;
      });

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleAddSubject = async (subject) => {
    const sectionId = selectedSection[subject.id];
    if (!sectionId) return alert("Please select a section.");

    const section = subject.sections.find(s => s.section_id.toString() === sectionId);
    if (section && section.enrolled_slots >= section.max_slots) {
      return alert("This section is already full.");
    }

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: user.id, subject_id: subject.id, section_id: sectionId })
      });

      if (response.ok) {
        fetchData(); // Refresh data from backend
        setActiveView("enrolled");
      } else {
        alert("Failed to enroll subject.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const executeDrop = async () => {
    if (!subjectToDrop) return;
    
    try {
      const response = await fetch(`/api/enrollments/${subjectToDrop.id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchData(); // Refresh data
        setIsDropModalOpen(false);
        setSubjectToDrop(null);
      } else {
        alert("Failed to drop subject.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* Modal UI State Management */
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const [subjectToDrop, setSubjectToDrop] = useState(null);

  const openDropConfirm = (subject) => {
    setSubjectToDrop(subject);
    setIsDropModalOpen(true);
  };

  if (!user.id) return null;

  return (
    <DashboardLayout>
      <div className="manage-subjects-container" style={{ margin: "20px" }}>
        <div className="header">
          <div>
            <h3 className="section-title">Manage Subjects</h3>
            <p className="section-subtitle">
              Add, drop, or request changes for your classes.
            </p>
          </div>
          <div className="units-counter">
            Total Units:{" "}
            <strong>
              {mySubjects.reduce((total, subject) => total + subject.unit, 0)} / 21
            </strong>
          </div>
        </div>

        <div className="content-tabs">
          <button
            className={`tab-button ${ActiveView === "enrolled" ? "active" : ""}`}
            onClick={() => setActiveView("enrolled")}
          >
            My Subjects (Drop/Update)
          </button>
          <button
            className={`tab-button ${ActiveView === "add" ? "active" : ""}`}
            onClick={() => setActiveView("add")}
          >
            Add New Subject
          </button>
        </div>

        {loading ? (
          <div className="table-container" style={{ padding: "20px", textAlign: "center" }}>
            Loading subjects...
          </div>
        ) : (
          <>
            {ActiveView === "enrolled" && (
              <div className="table-container">
                {mySubjects.length === 0 ? (
                  <div className="emptyState">You have no subjects enrolled yet.</div>
                ) : (
                  <table className="subjects-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Units</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mySubjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className="textPrimary">{subject.code}</td>
                          <td>{subject.name}</td>
                          <td style={{ textTransform: "capitalize" }}>{subject.status}</td>
                          <td>{subject.unit}</td>
                          <td className="actionButtons">
                            <button
                              className="dropButton"
                              onClick={() => openDropConfirm(subject)}
                            >
                              Drop
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {ActiveView === "add" && (
              <div className="table-container">
                {availableSubjects.length === 0 ? (
                  <div className="emptyState">
                    No subjects available at the moment.
                  </div>
                ) : (
                  <table className="subjects-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Section</th>
                        <th>Units</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableSubjects.map((subject) => (
                        <tr key={subject.id}>
                          <td className="textPrimary">{subject.code}</td>
                          <td>
                            {subject.name}
                            {subject.type === 'major' && (
                              <span style={{ marginLeft: '8px', padding: '2px 6px', fontSize: '0.7em', backgroundColor: 'var(--orange-100)', color: 'var(--orange-800)', borderRadius: '10px' }}>MAJOR</span>
                            )}
                          </td>
                          <td>
                            {subject.sections.length > 0 ? (
                              <select
                                className="sectionDropdown"
                                value={selectedSection[subject.id] || ""}
                                onChange={(e) =>
                                  setSelectedSection({
                                    ...selectedSection,
                                    [subject.id]: e.target.value,
                                  })
                                }
                              >
                                {subject.sections.map(sec => (
                                  <option key={sec.section_id} value={sec.section_id} disabled={sec.enrolled_slots >= sec.max_slots}>
                                    {sec.section_name} ({sec.enrolled_slots}/{sec.max_slots} slots)
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span style={{color: '#999', fontStyle: 'italic', fontSize: '0.9em'}}>No sections available</span>
                            )}
                          </td>
                          <td>{subject.unit}</td>
                          <td className="actionButtons">
                            <button
                              className="addButton"
                              onClick={() => handleAddSubject(subject)}
                              disabled={subject.sections.length === 0}
                              style={{ opacity: subject.sections.length === 0 ? 0.5 : 1, cursor: subject.sections.length === 0 ? 'not-allowed' : 'pointer' }}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {/* Subject Drop Confirmation Modal */}
        {isDropModalOpen && subjectToDrop && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3 className="modalTitle" style={{ color: "#dc3545" }}>
                Confirm Drop
              </h3>
              <p className="modalSubtitle" style={{ marginBottom: "8px" }}>
                Are you sure you want to drop{" "}
                <strong>
                  {subjectToDrop.code} - {subjectToDrop.name}
                </strong>
                ?
              </p>
              <p
                className="modalSubtitle"
                style={{ fontSize: "13px", opacity: 0.7 }}
              >
                This will remove the subject from your schedule and free up a
                slot. You will have to add the subject again if you have changed
                your mind.
              </p>
              <div className="modalActions">
                <button
                  className="changeButton"
                  onClick={() => {
                    setIsDropModalOpen(false);
                    setSubjectToDrop(null);
                  }}
                >
                  Cancel
                </button>
                <button className="dropButton" onClick={executeDrop}>
                  Yes, Drop Subject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
