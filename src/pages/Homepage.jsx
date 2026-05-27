import { useContext, useEffect, useState } from "react";
import DashboardLayout, { DashboardContext } from "../components/DashboardLayout";
import { SAMPLE_BALANCE, SAMPLE_NOTIFICATIONS } from "../utils/dummyData";

// Simplified version of the calendar for the quick glance
function CalendarWidgetMini() {
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
          <span key={d} className="cal-label" >
            {d}
          </span>
        ))}
      </div>
      <div className="cal-grid">{cells}</div>
    </div>
  );
}

export default function Homepage() {
  return (
    <DashboardLayout>
      <HomepageContent />
    </DashboardLayout>
  );
}

function HomepageContent() {
  const { openModal, searchQuery } = useContext(DashboardContext);
  
  const user = JSON.parse(localStorage.getItem("user")) || { full_name: "Kevin Aceroano", id: "2024-00123" };
  const studentName = user.full_name;
  const studentId = user.id;
  const program = "BS Information Technology";
  const yearLevel = "2nd Year";

  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch("/api/enrollments")
      .then(res => res.json())
      .then(data => {
        const myEnrolled = data.filter(e => 
          (e.student_name === user.full_name || true) && e.status === 'enrolled'
        );
        setEnrollments(myEnrolled);
      })
      .catch(err => console.error("Failed to fetch enrollments", err));
  }, [user.full_name]);

  const dashboardCards = [
    { key: "notifications", icon: "🔔", label: "Notifications", color: "#FF8C38", badge: SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length },
    { key: "announcements", icon: "📢", label: "Announcements", color: "#E85D00" },
    { key: "grades", icon: "📊", label: "Grades", color: "#CC5500" },
    { key: "medical", icon: "🏥", label: "Medical", color: "#FF7A1A" },
    { key: "balance", icon: "💰", label: "Balance", color: "#B84D00" },
    { key: "enrollment", icon: "📝", label: "Enrollment Summary", color: "#FF9933" },
  ];

  const filteredCards = dashboardCards.filter((c) =>
    c.label.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <>
      <section className="welcome-section" style={{ margin: "20px" }}>
        <div className="welcome-text">
          <h2>Welcome back, <span className="highlight">{studentName.split(" ")[0]}</span>! 👋</h2>
          <p>{program} — {yearLevel} | {studentId}</p>
        </div>
        <div className="welcome-date">
          <span className="date-icon">📅</span>
          <span>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </section>

      <section className="dashboard-widgets">
        {/* --- PROFILE WIDGET --- */}
        <div className="dash-widget" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="avatar-xl" style={{ width: "80px", height: "80px", fontSize: "1.8rem", margin: 0 }}>
            {studentName.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: "8px", color: "var(--gray-800)", fontSize: "1.4rem" }}>{studentName}</h3>
            <p style={{ margin: 0, color: "var(--gray-600)" }}>{program} • {studentId}</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.location.href = "/profile"} style={{ background: "var(--orange-500)", color: "white" }}>
            View Profile
          </button>
        </div>

        {/* --- CALENDAR/SCHEDULE WIDGET --- */}
        <div className="dash-widget" style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1.15rem", color: "var(--orange-700)", marginBottom: "16px", fontWeight: "700" }}>📅 Today's Schedule</h3>
            {enrollments.length > 0 ? (
              enrollments.map((s) => {
                const dayMap = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
                const todayShort = dayMap[new Date().getDay()];
                const isToday = s.schedule && s.schedule.includes(todayShort);
                if (!isToday) return null;
                return (
                  <div key={s.id} className="glance-item">
                    <strong>{s.subject_code}</strong> — {s.schedule} @ {s.section_name}
                  </div>
                );
              })
            ) : (
              <p className="glance-empty" style={{ textAlign: "center", marginTop: "30px", color: "var(--gray-400)" }}>No classes today 🎉</p>
            )}
            {enrollments.length > 0 && !enrollments.some(s => {
               const dayMap = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
               return s.schedule && s.schedule.includes(dayMap[new Date().getDay()]);
            }) && <p className="glance-empty" style={{ textAlign: "center", marginTop: "30px", color: "var(--gray-400)" }}>No classes today 🎉</p>}
          </div>
          <div style={{ width: "220px", flexShrink: 0, borderLeft: "1px solid var(--gray-200)", paddingLeft: "20px" }}>
            <CalendarWidgetMini />
          </div>
        </div>
      </section>

      <section className="dashboard-grid" style={{ margin: "20px" }}>
        {/* --- ICON CARDS --- */}
        {filteredCards.map((card) => (
          <button key={card.key} className="dash-card" onClick={() => card.key === "profile" ? window.location.href = "/profile" : openModal(card.key)}>
            <div className="dash-card-icon" style={{ background: card.color }}>{card.icon}</div>
            <span className="dash-card-label">{card.label}</span>
            {card.badge && <span className="dash-card-badge">{card.badge}</span>}
          </button>
        ))}
        <button className="dash-card exit-card" onClick={() => openModal("exit")}>
          <div className="dash-card-icon exit-icon">🚪</div>
          <span className="dash-card-label">Exit</span>
        </button>
      </section>

      {filteredCards.length === 0 && searchQuery && (
        <div className="no-results" style={{ margin: "20px" }}>No results for &quot;{searchQuery}&quot;</div>
      )}

      <section className="quick-glance" style={{ margin: "20px" }}>
        <div className="glance-card">
          <h3>💰 Balance Overview</h3>
          <div className="balance-bar-container">
            <div className="balance-bar" style={{ width: `${(SAMPLE_BALANCE.paid / SAMPLE_BALANCE.total) * 100}%` }} />
          </div>
          <p>₱{SAMPLE_BALANCE.paid.toLocaleString()} / ₱{SAMPLE_BALANCE.total.toLocaleString()} paid</p>
          <small>Due: {SAMPLE_BALANCE.due}</small>
        </div>
      </section>
    </>
  );
}
