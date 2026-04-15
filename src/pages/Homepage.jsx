import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Homepage.css";
import ManageSubjects from "./ManageSubjects";
import ClassSchedule from "../components/ClassSchedule/ClassSchedule";
import "../components/ClassSchedule/ClassSchedule.css";
import "../css/ManageSubjects.css";

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "Enrollment Open",
    msg: "Semester 2 enrollment is now open.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Grade Released",
    msg: "Your IT101 grade has been posted.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    title: "Payment Reminder",
    msg: "Tuition balance due on May 1.",
    time: "3 hrs ago",
    unread: false,
  },
  {
    id: 4,
    title: "System Maintenance",
    msg: "Portal will be down Saturday 2-4AM.",
    time: "1 day ago",
    unread: false,
  },
];

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Foundation Day Celebration",
    date: "April 20, 2026",
    body: "Join us for the annual Acez University Foundation Day! Activities include a parade, booth fair, and concert.",
  },
  {
    id: 2,
    title: "Midterm Exam Schedule",
    date: "April 18, 2026",
    body: "Midterm examinations will be held from April 25 to May 2. Please check your individual schedules.",
  },
  {
    id: 3,
    title: "Scholarship Applications",
    date: "April 10, 2026",
    body: "Applications for the Dean's List Scholarship are now open. Deadline: May 15, 2026.",
  },
];

const SAMPLE_GRADES = [
  {
    code: "IT101",
    desc: "Intro to Computing",
    units: 3,
    grade: "1.25",
    status: "Passed",
  },
  {
    code: "IT102",
    desc: "Programming 1",
    units: 3,
    grade: "1.50",
    status: "Passed",
  },
  {
    code: "MATH01",
    desc: "College Algebra",
    units: 3,
    grade: "2.00",
    status: "Passed",
  },
  {
    code: "ENG101",
    desc: "Purposive Communication",
    units: 3,
    grade: "1.75",
    status: "Passed",
  },
  {
    code: "PE001",
    desc: "Physical Fitness",
    units: 2,
    grade: "1.25",
    status: "Passed",
  },
  {
    code: "IT103",
    desc: "Data Structures",
    units: 3,
    grade: "---",
    status: "In Progress",
  },
];

const SAMPLE_SCHEDULE = [
  {
    code: "IT103",
    desc: "Data Structures",
    day: "Mon/Wed",
    time: "8:00 - 9:30 AM",
    room: "Room 301",
  },
  {
    code: "IT104",
    desc: "Web Development",
    day: "Mon/Wed",
    time: "10:00 - 11:30 AM",
    room: "Lab 2",
  },
  {
    code: "MATH02",
    desc: "Discrete Math",
    day: "Tue/Thu",
    time: "8:00 - 9:30 AM",
    room: "Room 205",
  },
  {
    code: "ENG102",
    desc: "Technical Writing",
    day: "Tue/Thu",
    time: "1:00 - 2:30 PM",
    room: "Room 102",
  },
  {
    code: "PE002",
    desc: "Team Sports",
    day: "Fri",
    time: "7:00 - 9:00 AM",
    room: "Gym",
  },
];

const SAMPLE_BALANCE = {
  tuition: 28500,
  misc: 4200,
  lab: 3500,
  total: 36200,
  paid: 18000,
  remaining: 18200,
  due: "May 1, 2026",
  payments: [
    {
      date: "Jan 15, 2026",
      amount: 10000,
      method: "Cash",
      ref: "PAY-20260115-001",
    },
    {
      date: "Feb 20, 2026",
      amount: 8000,
      method: "GCash",
      ref: "PAY-20260220-002",
    },
  ],
};

const SAMPLE_MEDICAL = {
  bloodType: "O+",
  allergies: "None",
  conditions: "None",
  emergencyContact: "Maria Dela Cruz — 0917-123-4567",
  vaccinations: [
    { name: "COVID-19 (Pfizer)", date: "March 2025", status: "Complete" },
    { name: "Hepatitis B", date: "June 2024", status: "Complete" },
    { name: "Flu Vaccine", date: "October 2025", status: "Complete" },
  ],
  checkups: [
    { date: "Aug 10, 2025", findings: "Fit for enrollment. No issues found." },
    {
      date: "Jan 8, 2026",
      findings: "Mild astigmatism noted. Referred to ophthalmologist.",
    },
  ],
};

const ENROLLED_SUBJECTS = [
  {
    code: "IT103",
    desc: "Data Structures",
    units: 3,
    schedule: "Mon/Wed 8:00-9:30 AM",
    instructor: "Prof. Santos",
  },
  {
    code: "IT104",
    desc: "Web Development",
    units: 3,
    schedule: "Mon/Wed 10:00-11:30 AM",
    instructor: "Prof. Reyes",
  },
  {
    code: "MATH02",
    desc: "Discrete Math",
    units: 3,
    schedule: "Tue/Thu 8:00-9:30 AM",
    instructor: "Prof. Garcia",
  },
  {
    code: "ENG102",
    desc: "Technical Writing",
    units: 3,
    schedule: "Tue/Thu 1:00-2:30 PM",
    instructor: "Prof. Lim",
  },
  {
    code: "PE002",
    desc: "Team Sports",
    units: 2,
    schedule: "Fri 7:00-9:00 AM",
    instructor: "Coach Mendoza",
  },
];

function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayNum = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++)
    cells.push(<span key={`e${i}`} className="cal-empty"></span>);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <span key={d} className={`cal-day${d === dayNum ? " cal-today" : ""}`}>
        {d}
      </span>,
    );
  }

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        {monthName} {year}
      </div>
      <div className="cal-days-label">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="cal-label">
            {d}
          </span>
        ))}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}

export default function Homepage() {
  const [viewMode, setViewMode] = useState("list");
  const [enrollmentView, setEnrollmentView] = useState("list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const studentName = "Kevin Aceroano";
  const studentId = "2024-00123";
  const program = "BS Information Technology";
  const yearLevel = "2nd Year";

  const openModal = (name) => {
    setActiveModal(name);
    setSidebarOpen(false);
  };
  const closeModal = () => setActiveModal(null);

  const dashboardCards = [
    { key: "profile", icon: "👤", label: "My Profile", color: "#FF6B00" },
    {
      key: "notifications",
      icon: "🔔",
      label: "Notifications",
      color: "#FF8C38",
      badge: SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length,
    },
    {
      key: "announcements",
      icon: "📢",
      label: "Announcements",
      color: "#E85D00",
    },
    { key: "grades", icon: "📊", label: "Grades", color: "#CC5500" },
    { key: "medical", icon: "🏥", label: "Medical", color: "#FF7A1A" },
    { key: "calendar", icon: "📅", label: "Calendar", color: "#D46A00" },
    { key: "balance", icon: "💰", label: "Balance", color: "#B84D00" },
    { key: "enrollment", icon: "📝", label: "Enrollment", color: "#FF9933" },
  ];

  const filteredCards = dashboardCards.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">🎓</div>
          <h2>Acez University</h2>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="sidebar-nav">
          {dashboardCards.map((c) => (
            <button
              key={c.key}
              className="sidebar-link"
              onClick={() => openModal(c.key)}
            >
              <span className="sidebar-icon">{c.icon}</span> {c.label}
            </button>
          ))}
          <hr className="sidebar-divider" />
          <button
            className="sidebar-link sidebar-exit"
            onClick={() => openModal("exit")}
          >
            <span className="sidebar-icon">🚪</span> Exit / Logout
          </button>
        </nav>
      </div>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP NAV */}
        <header className="top-nav">
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="nav-brand">
            <span className="brand-icon">🎓</span>
            <h1>Acez University</h1>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
          <div className="nav-right">
            <button
              className="notif-btn"
              onClick={() => openModal("notifications")}
            >
              🔔
              {SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length > 0 && (
                <span className="notif-badge">
                  {SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length}
                </span>
              )}
            </button>
            <div
              className="profile-trigger"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="avatar">KA</div>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="avatar-lg">KA</div>
                    <div>
                      <strong>{studentName}</strong>
                      <small>{studentId}</small>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      openModal("profile");
                      setProfileOpen(false);
                    }}
                  >
                    👤 My Profile
                  </button>
                  <button
                    onClick={() => {
                      openModal("exit");
                      setProfileOpen(false);
                    }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WELCOME SECTION */}
        <section className="welcome-section">
          <div className="welcome-text">
            <h2>
              Welcome back,{" "}
              <span className="highlight">{studentName.split(" ")[0]}</span>! 👋
            </h2>
            <p>
              {program} — {yearLevel} | {studentId}
            </p>
          </div>
          <div className="welcome-date">
            <span className="date-icon">📅</span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </section>

        {/* DASHBOARD GRID */}
        <section className="dashboard-grid">
          {filteredCards.map((card) => (
            <button
              key={card.key}
              className="dash-card"
              onClick={() => openModal(card.key)}
            >
              <div
                className="dash-card-icon"
                style={{ background: card.color }}
              >
                {card.icon}
              </div>
              <span className="dash-card-label">{card.label}</span>
              {card.badge && (
                <span className="dash-card-badge">{card.badge}</span>
              )}
            </button>
          ))}
          <button
            className="dash-card exit-card"
            onClick={() => openModal("exit")}
          >
            <div className="dash-card-icon exit-icon">🚪</div>
            <span className="dash-card-label">Exit</span>
          </button>
        </section>

        {filteredCards.length === 0 && searchQuery && (
          <div className="no-results">
            No results for &quot;{searchQuery}&quot;
          </div>
        )}

        {/* QUICK GLANCE */}
        <section className="quick-glance">
          <div className="glance-card">
            <h3>📅 Today&apos;s Schedule</h3>
            {SAMPLE_SCHEDULE.filter((s) => {
              const dayMap = {
                0: "Sun",
                1: "Mon",
                2: "Tue",
                3: "Wed",
                4: "Thu",
                5: "Fri",
                6: "Sat",
              };
              const todayShort = dayMap[new Date().getDay()];
              return s.day.includes(todayShort);
            }).length > 0 ? (
              SAMPLE_SCHEDULE.filter((s) => {
                const dayMap = {
                  0: "Sun",
                  1: "Mon",
                  2: "Tue",
                  3: "Wed",
                  4: "Thu",
                  5: "Fri",
                  6: "Sat",
                };
                const todayShort = dayMap[new Date().getDay()];
                return s.day.includes(todayShort);
              }).map((s) => (
                <div key={s.code} className="glance-item">
                  <strong>{s.code}</strong> — {s.time} @ {s.room}
                </div>
              ))
            ) : (
              <p className="glance-empty">No classes today 🎉</p>
            )}
          </div>
          <div className="glance-card">
            <h3>💰 Balance Overview</h3>
            <div className="balance-bar-container">
              <div
                className="balance-bar"
                style={{
                  width: `${(SAMPLE_BALANCE.paid / SAMPLE_BALANCE.total) * 100}%`,
                }}
              />
            </div>
            <p>
              ₱{SAMPLE_BALANCE.paid.toLocaleString()} / ₱
              {SAMPLE_BALANCE.total.toLocaleString()} paid
            </p>
            <small>Due: {SAMPLE_BALANCE.due}</small>
          </div>
          <div className="glance-card">
            <CalendarWidget />
          </div>
        </section>
      </div>

      {/* ==================== MODALS ==================== */}
      {activeModal && <div className="modal-overlay" onClick={closeModal} />}

      {/* PROFILE MODAL */}
      {activeModal === "profile" && (
        <div className="modal">
          <div className="modal-header">
            <h2>👤 My Profile</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <div className="profile-card-lg">
              <div className="avatar-xl">KA</div>
              <h3>{studentName}</h3>
              <p className="subtitle">{studentId}</p>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Program</label>
                <span>{program}</span>
              </div>
              <div className="info-item">
                <label>Year Level</label>
                <span>{yearLevel}</span>
              </div>
              <div className="info-item">
                <label>Email</label>
                <span>k.aceroano@acez.edu.ph</span>
              </div>
              <div className="info-item">
                <label>Contact</label>
                <span>0917-123-4567</span>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className="badge-active">Enrolled</span>
              </div>
              <div className="info-item">
                <label>Semester</label>
                <span>2nd Sem, A.Y. 2025-2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === "notifications" && (
        <div className="modal">
          <div className="modal-header">
            <h2>🔔 Notifications</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            {SAMPLE_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${n.unread ? "unread" : ""}`}
              >
                <div className="notif-dot" />
                <div>
                  <strong>{n.title}</strong>
                  <p>{n.msg}</p>
                  <small>{n.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS MODAL */}
      {activeModal === "announcements" && (
        <div className="modal">
          <div className="modal-header">
            <h2>📢 Announcements</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            {SAMPLE_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="announce-item">
                <h4>{a.title}</h4>
                <small>{a.date}</small>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRADES MODAL */}
      {activeModal === "grades" && (
        <div className="modal modal-wide">
          <div className="modal-header">
            <h2>📊 Grades</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Units</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_GRADES.map((g) => (
                  <tr key={g.code}>
                    <td>
                      <strong>{g.code}</strong>
                    </td>
                    <td>{g.desc}</td>
                    <td>{g.units}</td>
                    <td className="grade-val">{g.grade}</td>
                    <td>
                      <span
                        className={`status-badge ${g.status === "Passed" ? "passed" : "progress"}`}
                      >
                        {g.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MEDICAL MODAL */}
      {activeModal === "medical" && (
        <div className="modal">
          <div className="modal-header">
            <h2>🏥 Medical Records</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <div className="info-grid">
              <div className="info-item">
                <label>Blood Type</label>
                <span>{SAMPLE_MEDICAL.bloodType}</span>
              </div>
              <div className="info-item">
                <label>Allergies</label>
                <span>{SAMPLE_MEDICAL.allergies}</span>
              </div>
              <div className="info-item">
                <label>Conditions</label>
                <span>{SAMPLE_MEDICAL.conditions}</span>
              </div>
              <div className="info-item full">
                <label>Emergency Contact</label>
                <span>{SAMPLE_MEDICAL.emergencyContact}</span>
              </div>
            </div>
            <h4 className="section-title">Vaccinations</h4>
            {SAMPLE_MEDICAL.vaccinations.map((v, i) => (
              <div key={i} className="med-item">
                <strong>{v.name}</strong>
                <span>{v.date}</span>
                <span className="status-badge passed">{v.status}</span>
              </div>
            ))}
            <h4 className="section-title">Medical Checkups</h4>
            {SAMPLE_MEDICAL.checkups.map((c, i) => (
              <div key={i} className="announce-item">
                <small>{c.date}</small>
                <p>{c.findings}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALENDAR MODAL */}
      {activeModal === "calendar" && (
        <div className="modal">
          <div className="modal-header">
            <h2>📅 Calendar & Schedule</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <CalendarWidget />

            <div
              className="section-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              <h4 className="section-title">Class Schedule</h4>

              <button
                className="changeButton"
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
              >
                {viewMode === "list"
                  ? "🖼️ View Visual Timetable"
                  : "📝 View List"}
              </button>
            </div>

            {viewMode === "list" ? (
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Subject</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Room</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_SCHEDULE.map((s) => (
                    <tr key={s.code}>
                      <td>
                        <strong>{s.code}</strong>
                      </td>
                      <td>{s.desc}</td>
                      <td>{s.day}</td>
                      <td>{s.time}</td>
                      <td>{s.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="timetable-container">
                <ClassSchedule scheduleData={SAMPLE_SCHEDULE} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* BALANCE MODAL */}
      {activeModal === "balance" && (
        <div className="modal">
          <div className="modal-header">
            <h2>💰 Balance & Payments</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body">
            <div className="balance-summary">
              <div className="bal-item">
                <label>Tuition</label>
                <span>₱{SAMPLE_BALANCE.tuition.toLocaleString()}</span>
              </div>
              <div className="bal-item">
                <label>Misc Fees</label>
                <span>₱{SAMPLE_BALANCE.misc.toLocaleString()}</span>
              </div>
              <div className="bal-item">
                <label>Lab Fees</label>
                <span>₱{SAMPLE_BALANCE.lab.toLocaleString()}</span>
              </div>
              <div className="bal-item total">
                <label>Total</label>
                <span>₱{SAMPLE_BALANCE.total.toLocaleString()}</span>
              </div>
              <div className="bal-item paid">
                <label>Total Paid</label>
                <span>₱{SAMPLE_BALANCE.paid.toLocaleString()}</span>
              </div>
              <div className="bal-item remaining">
                <label>Remaining</label>
                <span>₱{SAMPLE_BALANCE.remaining.toLocaleString()}</span>
              </div>
            </div>
            <div className="balance-bar-container lg">
              <div
                className="balance-bar"
                style={{
                  width: `${(SAMPLE_BALANCE.paid / SAMPLE_BALANCE.total) * 100}%`,
                }}
              />
            </div>
            <small className="due-label">
              Next Payment Due: {SAMPLE_BALANCE.due}
            </small>
            <h4 className="section-title">Payment History</h4>
            {SAMPLE_BALANCE.payments.map((p, i) => (
              <div key={i} className="med-item">
                <strong>₱{p.amount.toLocaleString()}</strong>
                <span>{p.date}</span>
                <span>{p.method}</span>
                <small>{p.ref}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ENROLLMENT MODAL */}
      {activeModal === "enrollment" && (
        <div className="modal modal-wide">
          <div className="modal-header">
            <h2>
              📝 {enrollmentView === "list" ? "Enrollment" : "Manage Subjects"}
            </h2>
            <button onClick={closeModal}>✕</button>
          </div>

          <div className="modal-body">
            {enrollmentView === "list" ? (
              <>
                <div className="enroll-status">
                  <span className="badge-active">
                    ✅ Currently Enrolled — 2nd Sem, A.Y. 2025-2026
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <h4 className="section-title">Enrolled Subjects</h4>
                  {/* BUTTON TO ENTER MANAGE MODE */}
                  <button
                    className="changeButton"
                    onClick={() => setEnrollmentView("manage")}
                  >
                    ⚙️ Manage Subjects
                  </button>
                </div>

                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Units</th>
                      <th>Schedule</th>
                      <th>Instructor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENROLLED_SUBJECTS.map((s) => (
                      <tr key={s.code}>
                        <td>
                          <strong>{s.code}</strong>
                        </td>
                        <td>{s.desc}</td>
                        <td>{s.units}</td>
                        <td>{s.schedule}</td>
                        <td>{s.instructor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <button
                  className="changeButton"
                  onClick={() => setEnrollmentView("list")}
                  style={{ marginBottom: "15px", cursor: "pointer" }}
                >
                  ⬅️ Return to Enrollment List
                </button>

                <ManageSubjects />
              </>
            )}
          </div>
        </div>
      )}

      {/* EXIT MODAL */}
      {activeModal === "exit" && (
        <div className="modal modal-sm">
          <div className="modal-header">
            <h2>🚪 Logout</h2>
            <button onClick={closeModal}>✕</button>
          </div>
          <div className="modal-body center">
            <div className="exit-icon-lg">👋</div>
            <p>Are you sure you want to logout?</p>
            <div className="exit-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate("/login")}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
