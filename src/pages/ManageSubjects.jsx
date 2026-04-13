import { use, useState } from "react";
import "../css/index.css";
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
      code: "ITELEC4",
      name: "Integrative Programming 2",
      unit: 3,
      section: "Info 3-C",
      schedule: "TTh 7:00-10:00 AM",
    },
  ]);

  const availableSubjects = [
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
  ];

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
                      <button className="changeButton">Change Section</button>
                      <button className="dropButton">Drop</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
