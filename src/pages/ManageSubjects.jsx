import { useState } from "react";
import "../css/index.css";
import "../css/ManageSubjects.css";
export default function ManageSubjects() {
  const [ActiveView, setActiveView] = useState("enrolled");

  const [mySubjects, setMySubjects] = useState([
    {
      id: 1,
      code: "SOCSCI 313",
      name: "Science, Technology, and Society",
      unit: 3,
      section: "Info 3-C",
      schedule: "MWF 10:00-11:30 AM",
    },
    {
      id: 2,
      code: "IT ELEC 4",
      name: "Integrative Programming 2",
      unit: 3,
      section: "Info 3-C",
      schedule: "TTh 7:00-10:00 AM",
    },
  ]);

  const [availableSubjects, setAvailableSubjects] = useState([
    {
      id: 3,
      code: "IAS 323",
      name: "Information Assurance and Security 2",
      unit: 3,
      section: "Info 3-C",
      schedule: "MWF 1:00-2:30 PM",
    },
    {
      id: 4,
      code: "CIS 323",
      name: "Social and Professional Issues in Computing",
      unit: 3,
      section: "Info 3-C",
      schedule: "TTh 2:30-4:00 PM",
    },
  ]);

  // for handling adding and dropping subjects

  const [selectedSection, setSelectedSection] = useState({});

  const handleAddSubject = (AddSubject) => {
    const chosenSection = selectedSection[AddSubject.id] || AddSubject.section;
    let updatedSchedule = AddSubject.schedule;

    if (AlternativeSections[AddSubject.code]) {
      const sectionDetails = AlternativeSections[AddSubject.code].find(
        (s) => s.section === chosenSection,
      );
      if (sectionDetails) {
        updatedSchedule = sectionDetails.schedule;
      }
    }

    const finalSubject = {
      ...AddSubject,
      section: chosenSection,
      schedule: updatedSchedule,
    };
    setMySubjects([...mySubjects, finalSubject]);
    setAvailableSubjects(
      availableSubjects.filter((subj) => subj.id !== AddSubject.id),
    );
    setActiveView("enrolled");
  };

  const handleDropSubject = (DropSubject) => {
    setMySubjects(mySubjects.filter((subj) => subj.id !== DropSubject.id));
    setAvailableSubjects([...availableSubjects, DropSubject]);

    const updatedSelection = { ...selectedSection };
    delete updatedSelection[DropSubject.id];
    setSelectedSection(updatedSelection);
  };

  // for change section
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [subjectoEdit, setSubjectToEdit] = useState(null);
  const [newSection, setNewSection] = useState("");
  const AlternativeSections = {
    "SOCSCI 313": [
      {
        section: "Info 3-A",
        schedule: "TTh 1:00-2:30 PM",
        slots: "12/40 slots",
      },
      {
        section: "Info 3-B",
        schedule: "WTh 9:00-10:30 AM",
        slots: "22/40 slots",
      },
      {
        section: "Info 3-C",
        schedule: "MWF 10:00-11:30 AM",
        slots: "Enrolled",
      },
    ],
    "IT ELEC 4": [
      {
        section: "Info 3-A",
        schedule: "MF 7:00-10:00 AM",
        slots: "29/40 slots",
      },
      {
        section: "Info 3-B",
        schedule: "MF 1:00-4:00 PM",
        slots: "Full",
      },
      {
        section: "Info 3-C",
        schedule: "TTh 7:00-10:00 AM",
        slots: "Enrolled",
      },
    ],
    "IAS 323": [
      {
        section: "Info 3-A",
        schedule: "MF 7:00-8:30 AM",
        slots: "19/40 slots",
      },
      {
        section: "Info 3-B",
        schedule: "TTh 10:00-11:30 AM",
        slots: "21/40 slots",
      },
      {
        section: "Info 3-C",
        schedule: "MWF 1:00-2:30 PM",
        slots: "Enrolled",
      },
    ],
    "CIS 323": [
      {
        section: "Info 3-A",
        schedule: "MF 7:00-8:30 AM",
        slots: "Full",
      },
      {
        section: "Info 3-B",
        schedule: "MTh 10:00-11:30 AM",
        slots: "28/40 slots",
      },
      {
        section: "Info 3-C",
        schedule: "TTh 2:30-4:00 PM",
        slots: "Enrolled",
      },
    ],
  };

  const openChangeSectionModal = (subject) => {
    setSubjectToEdit(subject);
    setNewSection(subject.section);
    setIsChangeModalOpen(true);
  };

  const saveSectionChange = () => {
    const newDetails = AlternativeSections[subjectoEdit.code].find(
      (s) => s.section === newSection,
    );
    setMySubjects(
      mySubjects.map((subject) =>
        subject.id === subjectoEdit.id
          ? {
              ...subject,
              section: newDetails.section,
              schedule: newDetails.schedule,
            }
          : subject,
      ),
    );
    setIsChangeModalOpen(false);
    setSubjectToEdit(null);
  };
  return (
    <div id="aaa" className="manage-subjects-container">
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
            {mySubjects.reduce((total, subject) => total + subject.unit, 0)} /
            21
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
                  <th>Section</th>
                  <th>Schedule</th>
                  <th>Units</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mySubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="textPrimary">{subject.code}</td>
                    <td>{subject.name}</td>
                    <td>{subject.section}</td>
                    <td className="scheduleText">{subject.schedule}</td>
                    <td>{subject.unit}</td>
                    <td className="actionButtons">
                      <button
                        className="changeButton"
                        onClick={() => openChangeSectionModal(subject)}
                      >
                        Change Section
                      </button>
                      <button
                        className="dropButton"
                        onClick={() => handleDropSubject(subject)}
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
                  <th>Schedule</th>
                  <th>Units</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableSubjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="textPrimary">{subject.code}</td>
                    <td>{subject.name}</td>
                    <td>
                      <select
                        className="sectionDropdown"
                        value={selectedSection[subject.id] || subject.section}
                        onChange={(e) =>
                          setSelectedSection({
                            ...selectedSection,
                            [subject.id]: e.target.value,
                          })
                        }
                      >
                        <option value={subject.section}>
                          {subject.section} (30/40 slots)
                        </option>
                        <option value="Info 3-B">Info 3-B (22/40 slots)</option>
                        <option value="Info 3-A">Info 3-A (20/40 slots)</option>
                      </select>
                    </td>
                    <td className="scheduleText">{subject.schedule}</td>
                    <td>{subject.unit}</td>
                    <td className="actionButtons">
                      <button
                        className="addButton"
                        onClick={() => handleAddSubject(subject)}
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
      {isChangeModalOpen && subjectoEdit && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3 className="modalTitle">Change Section</h3>
            <p className="modalSubtitle">
              Select a new section for{" "}
              <strong>
                {subjectoEdit.code} - {subjectoEdit.name}
              </strong>
            </p>
            <div className="modalSectionList">
              <label>Available Sections:</label>
              <select
                className="sectionDropdown"
                style={{ width: "100%", marginTop: "8px" }}
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
              >
                {AlternativeSections[subjectoEdit.code]?.map((option) => (
                  <option
                    key={option.section}
                    value={option.section}
                    disabled={option.slots === "Full"}
                  >
                    Section {option.section} - {option.schedule} ({option.slots}
                    )
                  </option>
                ))}
              </select>
            </div>
            <div className="modalActions">
              <button
                className="changeButton"
                onClick={() => setIsChangeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="addButton"
                onClick={saveSectionChange}
                disabled={newSection === subjectoEdit.section}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
