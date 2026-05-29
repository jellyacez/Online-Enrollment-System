import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Bell,
  Megaphone,
  BarChart2,
  HeartPulse,
  Calendar,
  Wallet,
  FileText,
  Users,
  Library,
  ClipboardList,
  Settings,
  LogOut,
  Search,
  Edit2,
  Save,
  LayoutGrid,
  List
} from "lucide-react";

export const DashboardContext = createContext();
import Logo from "../assets/UniLogo.png";
import Logo2 from "../assets/UniLogo2.png";
import ClassSchedule from "../components/ClassSchedule/ClassSchedule";
import "../components/ClassSchedule/ClassSchedule.css";
import "../css/Homepage.css";
import {
  SAMPLE_NOTIFICATIONS,
  SAMPLE_ANNOUNCEMENTS,
  SAMPLE_GRADES,
  SAMPLE_SCHEDULE,
  SAMPLE_BALANCE,
  SAMPLE_MEDICAL,
} from "../utils/dummyData";

function CalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayNum = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(<span key={`e${i}`} className="cal-empty"></span>);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <span key={d} className={`cal-day${d === dayNum ? " cal-today" : ""}`}>
        {d}
      </span>
    );
  }

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        {monthName} {year}
      </div>
      <div className="cal-days-label">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="cal-label" key={d}>
            {d}
          </span>
        ))}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}

function ProfileModalContent({ closeModal, user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setFormData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProfile({ full_name: user.full_name || "Unknown User", student_type: "regular" });
        setLoading(false);
      });
  }, [user.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setProfile(formData);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="modal-body">Loading...</div>;

  return (
    <>
      <div className="modal-header">
        <h2>👤 My Profile</h2>
        <div>
          {!isEditing ? (
            <button className="btn" style={{ marginRight: '10px' }} onClick={() => setIsEditing(true)}>✏️ Edit</button>
          ) : (
            <button className="btn btn-primary" style={{ marginRight: '10px' }} onClick={handleSave}>{saving ? 'Saving...' : '💾 Save'}</button>
          )}
          <button onClick={closeModal}>✕</button>
        </div>
      </div>
      <div className="modal-body">
        <div className="profile-card-lg">
          <div className="avatar-xl">{profile.full_name.substring(0, 2).toUpperCase()}</div>
          {isEditing ? (
            <input type="text" value={formData.full_name || ""} onChange={e => setFormData({ ...formData, full_name: e.target.value })} style={{ fontSize: '1.5em', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }} />
          ) : (
            <h3>{profile.full_name}</h3>
          )}
          <p className="subtitle">{profile.student_type ? profile.student_type.toUpperCase() : 'STUDENT'}</p>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <label>Program</label>
            {isEditing ? <input value={formData.program || ""} onChange={e => setFormData({ ...formData, program: e.target.value })} /> : <span>{profile.program || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Contact</label>
            {isEditing ? <input value={formData.phone || ""} onChange={e => setFormData({ ...formData, phone: e.target.value })} /> : <span>{profile.phone || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{profile.email}</span>
          </div>
          <div className="info-item">
            <label>Address</label>
            {isEditing ? <input value={formData.address || ""} onChange={e => setFormData({ ...formData, address: e.target.value })} /> : <span>{profile.address || 'Not set'}</span>}
          </div>
          <div className="info-item">
            <label>Date of Birth</label>
            {isEditing ? <input type="date" value={formData.dob ? formData.dob.split('T')[0] : ""} onChange={e => setFormData({ ...formData, dob: e.target.value })} /> : <span>{profile.dob ? profile.dob.split('T')[0] : 'Not set'}</span>}
          </div>
          {profile.student_type === 'transferee' && (
            <>
              <div className="info-item">
                <label>Last School</label>
                {isEditing ? <input value={formData.last_school || ""} onChange={e => setFormData({ ...formData, last_school: e.target.value })} /> : <span>{profile.last_school || 'Not set'}</span>}
              </div>
              <div className="info-item">
                <label>Current Level</label>
                {isEditing ? <input value={formData.current_level || ""} onChange={e => setFormData({ ...formData, current_level: e.target.value })} /> : <span>{profile.current_level || 'Not set'}</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CalendarModalContent({ closeModal, user, viewMode, setViewMode }) {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enrollments")
      .then(res => res.json())
      .then(data => {
        const myEnrolled = data.filter(e => e.student_email === user.email && e.status === "enrolled");
        const formattedSchedule = myEnrolled.map(e => {
          let day = "TBA";
          let time = "TBA";
          if (e.schedule && e.schedule !== "TBA") {
            const parts = e.schedule.split(" ");
            day = parts[0];
            time = parts.slice(1).join(" ");
          }
          return {
            code: e.subject_code,
            desc: e.subject_description,
            day: day,
            time: time,
            room: e.section_name || "TBA"
          };
        });
        setScheduleData(formattedSchedule);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user.email]);

  if (loading) return <div className="modal-body">Loading...</div>;

  return (
    <>
      <div className="modal-header"><h2>📅 Calendar & Schedule</h2><button onClick={closeModal}>✕</button></div>
      <div className="modal-body">
        <CalendarWidget />
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
          <h4 className="section-title">Class Schedule</h4>
          <button className="changeButton" onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}>
            {viewMode === "list" ? "🖼️ View Visual Timetable" : "📝 View List"}
          </button>
        </div>
        {scheduleData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--gray-500)" }}>
            No enrolled classes yet.
          </div>
        ) : viewMode === "list" ? (
          <table className="grades-table">
            <thead><tr><th>Code</th><th>Subject</th><th>Day</th><th>Time</th><th>Section</th></tr></thead>
            <tbody>
              {scheduleData.map((s, idx) => (
                <tr key={idx}><td><strong>{s.code}</strong></td><td>{s.desc}</td><td>{s.day}</td><td>{s.time}</td><td>{s.room}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (<div className="timetable-container"><ClassSchedule scheduleData={scheduleData} /></div>)}
      </div>
    </>
  );
}

function EnrollmentModalContent({ closeModal, user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enrollments")
      .then(res => res.json())
      .then(data => {
        // Filter by user
        const myEnrolled = data.filter(e => 
          e.student_email === user.email
        );
        setEnrollments(myEnrolled);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user.full_name]);

  if (loading) return <div className="modal-body">Loading...</div>;

  return (
    <>
      <div className="modal-header"><h2>📝 Enrollment Summary</h2><button onClick={closeModal}>✕</button></div>
      <div className="modal-body">
        <div className="enroll-status" style={{ marginBottom: "15px" }}>
          {enrollments.length > 0 ? (
            <span className="badge-active">✅ Currently Enrolled — 2nd Sem, A.Y. 2025-2026</span>
          ) : (
            <span className="badge-warning" style={{ padding: '5px 10px', borderRadius: '15px', background: '#fff3cd', color: '#856404' }}>⚠️ Not Officially Enrolled</span>
          )}
        </div>
        {enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>You have no enrolled subjects or pending requests yet.</div>
        ) : (
          <table className="grades-table">
            <thead><tr><th>Code</th><th>Subject</th><th>Section</th><th>Schedule</th><th>Status</th></tr></thead>
            <tbody>
              {enrollments.map((s, i) => (
                <tr key={i}>
                  <td><strong>{s.subject_code}</strong></td>
                  <td>{s.subject_description}</td>
                  <td>{s.section_name || 'TBA'}</td>
                  <td>{s.schedule || 'TBA'}</td>
                  <td>
                    <span className={`status-badge ${s.status === 'enrolled' ? 'passed' : 'progress'}`} style={{textTransform: 'capitalize'}}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || { full_name: "Kevin Aceroano", id: "2024-00123", role: "student" };
  const studentName = user.full_name;
  const studentId = user.id;
  const program = "BS Information Technology";
  const yearLevel = "2nd Year";

  const openModal = (name) => {
    setActiveModal(name);
    setSidebarOpen(false);
  };
  const closeModal = () => setActiveModal(null);

  const studentCards = [
    { key: "home", icon: <Home size={20} />, label: "Home", color: "#FF6B00", isRoute: true, route: "/home" },
    { key: "profile", icon: <User size={20} />, label: "My Profile", color: "#FF6B00", isRoute: true, route: "/profile" },
    { key: "notifications", icon: <Bell size={20} />, label: "Notifications", color: "#FF8C38", badge: SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length },
    { key: "announcements", icon: <Megaphone size={20} />, label: "Announcements", color: "#E85D00" },
    { key: "grades", icon: <BarChart2 size={20} />, label: "Grades", color: "#CC5500" },
    { key: "medical", icon: <HeartPulse size={20} />, label: "Medical", color: "#FF7A1A" },
    { key: "calendar", icon: <Calendar size={20} />, label: "Calendar", color: "#D46A00" },
    { key: "balance", icon: <Wallet size={20} />, label: "Balance", color: "#B84D00" },
    { key: "enrollment", icon: <FileText size={20} />, label: "Enrollment", color: "#FF9933", isRoute: true, route: "/student-management" },
  ];

  const adminCards = [
    { key: "dashboard", icon: <Home size={20} />, label: "Dashboard", color: "#FF6B00", isRoute: true, route: "/admin/dashboard" },
    { key: "enrollments", icon: <FileText size={20} />, label: "Enrollment Requests", color: "#FF7A1A", isRoute: true, route: "/admin/enrollments" },
    { key: "users", icon: <Users size={20} />, label: "User Management", color: "#FF8C38", isRoute: true, route: "/admin/users" },
    { key: "subjects", icon: <Library size={20} />, label: "Manage Subjects", color: "#D46A00", isRoute: true, route: "/admin/subjects" },
    { key: "audit", icon: <ClipboardList size={20} />, label: "Audit Logs", color: "#E85D00", isRoute: true, route: "/admin/audit-logs" },
    { key: "settings", icon: <Settings size={20} />, label: "Settings", color: "#CC5500", isRoute: true, route: "/admin/settings" },
  ];

  const sidebarCards = user.role === 'admin' ? adminCards : studentCards;

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={Logo2} className="Uni-Logo" alt="University Logo" />
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav className="sidebar-nav">
          {sidebarCards.map((c) => (
            <button
              key={c.key}
              className="sidebar-link"
              onClick={() => {
                if (c.isRoute) {
                  navigate(c.route);
                } else {
                  openModal(c.key);
                }
              }}
            >
              <span className="sidebar-icon">{c.icon}</span> {c.label}
            </button>
          ))}
          <hr className="sidebar-divider" />
          <button className="sidebar-link sidebar-exit" onClick={() => openModal("exit")}>
            <span className="sidebar-icon"><LogOut size={20} /></span> Exit / Logout
          </button>
        </nav>
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* TOP NAV */}
        <header className="top-nav" style={{ flexShrink: 0 }}>
          <button className="hamburger" onClick={() => setSidebarOpen(true)}>
            <span></span><span></span><span></span>
          </button>
          <div className="nav-brand">
            <span className="brand-icon">
              <img src={Logo} className="Uni-Logo" alt="University Logo" />
            </span>
            <h1 style={{ cursor: "pointer" }} onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/home')}>Acez University</h1>
          </div>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>}
          </div>
          <div className="nav-right">
            {user.role !== 'admin' && (
              <button className="notif-btn" onClick={() => openModal("notifications")}>
                🔔
                {SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length > 0 && (
                  <span className="notif-badge">{SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length}</span>
                )}
              </button>
            )}
            <div className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
              <div className="avatar">{studentName.substring(0, 2).toUpperCase()}</div>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="avatar-lg">{studentName.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <strong>{studentName}</strong>
                      <small>{studentId}</small>
                    </div>
                  </div>
                  {user.role !== 'admin' && (
                    <button onClick={() => { navigate("/profile"); setProfileOpen(false); }}>👤 My Profile</button>
                  )}
                  <button onClick={() => { openModal("exit"); setProfileOpen(false); }}>🚪 Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DashboardContext.Provider value={{ openModal, searchQuery }}>
            {children}
          </DashboardContext.Provider>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      {activeModal && <div className="modal-overlay" onClick={closeModal} />}

      {/* PROFILE MODAL */}
      {activeModal === "profile" && (
        <div className="modal">
          <ProfileModalContent closeModal={closeModal} user={user} />
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === "notifications" && (
        <div className="modal">
          <div className="modal-header"><h2>🔔 Notifications</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body">
            {SAMPLE_NOTIFICATIONS.map((n) => (
              <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`}>
                <div className="notif-dot" />
                <div><strong>{n.title}</strong><p>{n.msg}</p><small>{n.time}</small></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANNOUNCEMENTS MODAL */}
      {activeModal === "announcements" && (
        <div className="modal">
          <div className="modal-header"><h2>📢 Announcements</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body">
            {SAMPLE_ANNOUNCEMENTS.map((a) => (
              <div key={a.id} className="announce-item"><h4>{a.title}</h4><small>{a.date}</small><p>{a.body}</p></div>
            ))}
          </div>
        </div>
      )}

      {/* GRADES MODAL */}
      {activeModal === "grades" && (
        <div className="modal modal-wide">
          <div className="modal-header"><h2>📊 Grades</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body">
            <table className="grades-table">
              <thead><tr><th>Code</th><th>Description</th><th>Units</th><th>Grade</th><th>Status</th></tr></thead>
              <tbody>
                {SAMPLE_GRADES.map((g) => (
                  <tr key={g.code}>
                    <td><strong>{g.code}</strong></td><td>{g.desc}</td><td>{g.units}</td>
                    <td className="grade-val">{g.grade}</td>
                    <td><span className={`status-badge ${g.status === "Passed" ? "passed" : "progress"}`}>{g.status}</span></td>
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
          <div className="modal-header"><h2>🏥 Medical Records</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body">
            <div className="info-grid">
              <div className="info-item"><label>Blood Type</label><span>{SAMPLE_MEDICAL.bloodType}</span></div>
              <div className="info-item"><label>Allergies</label><span>{SAMPLE_MEDICAL.allergies}</span></div>
              <div className="info-item"><label>Conditions</label><span>{SAMPLE_MEDICAL.conditions}</span></div>
              <div className="info-item full"><label>Emergency Contact</label><span>{SAMPLE_MEDICAL.emergencyContact}</span></div>
            </div>
            <h4 className="section-title">Vaccinations</h4>
            {SAMPLE_MEDICAL.vaccinations.map((v, i) => (
              <div key={i} className="med-item"><strong>{v.name}</strong><span>{v.date}</span><span className="status-badge passed">{v.status}</span></div>
            ))}
          </div>
        </div>
      )}

      {/* CALENDAR MODAL */}
      {activeModal === "calendar" && (
        <div className="modal">
          <CalendarModalContent closeModal={closeModal} user={user} viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      )}

      {/* BALANCE MODAL */}
      {activeModal === "balance" && (
        <div className="modal">
          <div className="modal-header"><h2>💰 Balance & Payments</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body">
            <div className="balance-summary">
              <div className="bal-item"><label>Total</label><span>₱{SAMPLE_BALANCE.total.toLocaleString()}</span></div>
              <div className="bal-item paid"><label>Total Paid</label><span>₱{SAMPLE_BALANCE.paid.toLocaleString()}</span></div>
              <div className="bal-item remaining"><label>Remaining</label><span>₱{SAMPLE_BALANCE.remaining.toLocaleString()}</span></div>
            </div>
            <div className="balance-bar-container lg">
              <div className="balance-bar" style={{ width: `${(SAMPLE_BALANCE.paid / SAMPLE_BALANCE.total) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* ENROLLMENT MODAL */}
      {activeModal === "enrollment" && (
        <div className="modal modal-wide">
          <EnrollmentModalContent closeModal={closeModal} user={user} />
        </div>
      )}

      {/* EXIT MODAL */}
      {activeModal === "exit" && (
        <div className="modal modal-sm">
          <div className="modal-header"><h2>🚪 Logout</h2><button onClick={closeModal}>✕</button></div>
          <div className="modal-body center">
            <div className="exit-icon-lg">👋</div>
            <p>Are you sure you want to logout?</p>
            <div className="exit-actions">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { localStorage.clear(); navigate("/login"); }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
