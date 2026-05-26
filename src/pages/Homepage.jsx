import { useContext } from "react";
import DashboardLayout, { DashboardContext } from "../components/DashboardLayout";
import { SAMPLE_NOTIFICATIONS, SAMPLE_SCHEDULE, SAMPLE_BALANCE } from "../utils/dummyData";

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
          <span key={d} className="cal-label" key={d}>
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

  const dashboardCards = [
    { key: "profile", icon: "👤", label: "My Profile", color: "#FF6B00" },
    { key: "notifications", icon: "🔔", label: "Notifications", color: "#FF8C38", badge: SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length },
    { key: "announcements", icon: "📢", label: "Announcements", color: "#E85D00" },
    { key: "grades", icon: "📊", label: "Grades", color: "#CC5500" },
    { key: "medical", icon: "🏥", label: "Medical", color: "#FF7A1A" },
    { key: "calendar", icon: "📅", label: "Calendar", color: "#D46A00" },
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

      <section className="dashboard-grid" style={{ margin: "20px" }}>
        {filteredCards.map((card) => (
          <button key={card.key} className="dash-card" onClick={() => openModal(card.key)}>
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
          <h3>📅 Today&apos;s Schedule</h3>
          {SAMPLE_SCHEDULE.filter((s) => {
            const dayMap = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
            return s.day.includes(dayMap[new Date().getDay()]);
          }).length > 0 ? (
            SAMPLE_SCHEDULE.filter((s) => {
              const dayMap = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
              return s.day.includes(dayMap[new Date().getDay()]);
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
            <div className="balance-bar" style={{ width: `${(SAMPLE_BALANCE.paid / SAMPLE_BALANCE.total) * 100}%` }} />
          </div>
          <p>₱{SAMPLE_BALANCE.paid.toLocaleString()} / ₱{SAMPLE_BALANCE.total.toLocaleString()} paid</p>
          <small>Due: {SAMPLE_BALANCE.due}</small>
        </div>
        <div className="glance-card">
          <CalendarWidgetMini />
        </div>
      </section>
    </>
  );
}
