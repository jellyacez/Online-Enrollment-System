import { useContext, useEffect, useState } from "react";
import {
  Calendar,
  LogOut,
  Wallet,
  Bell,
  Megaphone,
  BarChart2,
  HeartPulse,
  FileText,
} from "lucide-react";
import DashboardLayout, {
  DashboardContext,
} from "../components/DashboardLayout";
import { SAMPLE_BALANCE, SAMPLE_NOTIFICATIONS } from "../utils/dummyData";

/** Mini calendar component for dashboard glance view */
function CalendarWidgetMini() {
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
  return (
    <DashboardLayout>
      <HomepageContent />
    </DashboardLayout>
  );
}

function HomepageContent() {
  const { openModal, searchQuery } = useContext(DashboardContext);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  useEffect(() => {
    if (!user.id) {
      window.location.href = "/login";
    }
  }, [user.id]);

  const studentName = user.full_name || "Unknown";
  const studentId = user.id || "N/A";
  
  const [profile, setProfile] = useState({
    program: "Loading...",
    current_level: "Loading..."
  });
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    // Fetch User Profile
    if (user.id) {
      fetch(`/api/users/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.program) {
            setProfile({
              program: data.program,
              current_level: data.current_level || "1st Year"
            });
          } else {
            setProfile({
              program: "BS Information Technology",
              current_level: "1st Year"
            });
          }
        })
        .catch((err) => console.error("Failed to fetch profile", err));
    }

    // Fetch Enrollments
    fetch("/api/enrollments")
      .then((res) => res.json())
      .then((data) => {
        /** Filter enrollment records by authenticated user session */
        const myEnrolled = data.filter(
          (e) => e.student_email === user.email && e.status === "enrolled",
        );
        setEnrollments(myEnrolled);
      })
      .catch((err) => console.error("Failed to fetch enrollments", err));
  }, [user.email, user.id]);

  if (!user.id) return null;

  const program = profile.program;
  const yearLevel = profile.current_level;

  const dashboardCards = [
    {
      key: "notifications",
      icon: <Bell size={24} color="white" />,
      label: "Notifications",
      color: "#FF8C38",
      badge: SAMPLE_NOTIFICATIONS.filter((n) => n.unread).length,
    },
    {
      key: "announcements",
      icon: <Megaphone size={24} color="white" />,
      label: "Announcements",
      color: "#E85D00",
    },
    {
      key: "grades",
      icon: <BarChart2 size={24} color="white" />,
      label: "Grades",
      color: "#CC5500",
    },
    {
      key: "medical",
      icon: <HeartPulse size={24} color="white" />,
      label: "Medical",
      color: "#FF7A1A",
    },
    {
      key: "calendar",
      icon: <Calendar size={24} color="white" />,
      label: "Calendar",
      color: "#D46A00",
    },
    {
      key: "balance",
      icon: <Wallet size={24} color="white" />,
      label: "Balance",
      color: "#B84D00",
    },
    {
      key: "enrollment",
      icon: <FileText size={24} color="white" />,
      label: "Enrollment Summary",
      color: "#FF9933",
    },
  ];

  const filteredCards = dashboardCards.filter((c) =>
    c.label.toLowerCase().includes((searchQuery || "").toLowerCase()),
  );

  return (
    <>
      <section className="welcome-section" style={{ margin: "20px" }}>
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
          <span className="date-icon">
            <Calendar
              size={18}
              style={{ display: "inline", verticalAlign: "text-bottom" }}
            />
          </span>
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

      <section className="dashboard-widgets">
        {/* Student Profile Overview Component */}
        <div
          className="dash-widget"
          style={{ display: "flex", alignItems: "center", gap: "20px" }}
        >
          <div
            className="avatar-xl"
            style={{
              width: "80px",
              height: "80px",
              fontSize: "1.8rem",
              margin: 0,
            }}
          >
            {studentName.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                marginBottom: "8px",
                color: "var(--gray-800)",
                fontSize: "1.4rem",
              }}
            >
              {studentName}
            </h3>
            <p style={{ margin: 0, color: "var(--gray-600)" }}>
              {program} • {studentId}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/profile")}
            style={{ background: "var(--orange-500)", color: "white" }}
          >
            View Profile
          </button>
        </div>

        {/* Today's Schedule Overview Component */}
        <div className="dash-widget" style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "1.15rem",
                color: "var(--orange-700)",
                marginBottom: "16px",
                fontWeight: "700",
              }}
            >
              <Calendar
                size={20}
                style={{
                  display: "inline",
                  verticalAlign: "text-bottom",
                  marginRight: "8px",
                }}
              />{" "}
              Today's Schedule
            </h3>
            {enrollments.length > 0 ? (
              enrollments.map((s) => {
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
                const isToday = s.schedule && s.schedule.includes(todayShort);
                if (!isToday) return null;
                return (
                  <div key={s.id} className="glance-item">
                    <strong>{s.subject_code}</strong> — {s.schedule} @{" "}
                    {s.section_name}
                  </div>
                );
              })
            ) : (
              <p
                className="glance-empty"
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                  color: "var(--gray-400)",
                }}
              >
                No classes today 🎉
              </p>
            )}
            {enrollments.length > 0 &&
              !enrollments.some((s) => {
                const dayMap = {
                  0: "Sun",
                  1: "Mon",
                  2: "Tue",
                  3: "Wed",
                  4: "Thu",
                  5: "Fri",
                  6: "Sat",
                };
                return (
                  s.schedule && s.schedule.includes(dayMap[new Date().getDay()])
                );
              }) && (
                <p
                  className="glance-empty"
                  style={{
                    textAlign: "center",
                    marginTop: "30px",
                    color: "var(--gray-400)",
                  }}
                >
                  No classes today 🎉
                </p>
              )}
          </div>
          <div
            style={{
              width: "220px",
              flexShrink: 0,
              borderLeft: "1px solid var(--gray-200)",
              paddingLeft: "20px",
            }}
          >
            <CalendarWidgetMini />
          </div>
        </div>
      </section>

      <section className="dashboard-grid" style={{ margin: "20px" }}>
        {/* Interactive Dashboard Navigation Modules */}
        {filteredCards.map((card) => (
          <button
            key={card.key}
            className="dash-card"
            onClick={() =>
              card.key === "profile"
                ? (window.location.href = "/profile")
                : openModal(card.key)
            }
          >
            <div className="dash-card-icon" style={{ background: card.color }}>
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
          <div className="dash-card-icon exit-icon">
            <LogOut size={24} color="white" />
          </div>
          <span className="dash-card-label">Exit</span>
        </button>
      </section>

      {filteredCards.length === 0 && searchQuery && (
        <div className="no-results" style={{ margin: "20px" }}>
          No results for &quot;{searchQuery}&quot;
        </div>
      )}

      <section className="quick-glance" style={{ margin: "20px" }}>
        <div className="glance-card">
          <h3>
            <Wallet
              size={20}
              style={{
                display: "inline",
                verticalAlign: "text-bottom",
                marginRight: "8px",
              }}
            />{" "}
            Balance Overview
          </h3>
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
      </section>
    </>
  );
}
