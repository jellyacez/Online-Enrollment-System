import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../css/index.css";
import MenuIcon from "../assets/menu-svgrepo-com.svg";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // THIS WAS THE MISSING PIECE! 
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [sliderStyle, setSliderStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogoutClick = (e) => {
    e.preventDefault(); 
    setShowLogoutModal(true); 
  };
  
  const confirmLogout = () => {
    setShowLogoutModal(false); 
    navigate("/login"); 
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  
  useEffect(() => {
    setIsOpen(false);

    setTimeout(() => {
      const activeElement = document.querySelector(".active-tab");
      const linksContainer = document.getElementById("links");

      if (activeElement && linksContainer) {
        const containerRect = linksContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        setSliderStyle({
          top: activeRect.top - containerRect.top,
          height: activeRect.height,
          opacity: 1,
        });
      }
    }, 10);
  }, [location]);
  
  // this bad boy would make sure menu is not in the game when login comes walking on the red carpet
  if (location.pathname.toLowerCase().includes('login')) {
    return null; 
  }
  
  return (
    <>
      <button
        className={`MenuButton ${isOpen ? "hide-button" : "show-button"}`}
        onClick={toggleSidebar}
      >
        <img src={MenuIcon} alt="Menu" />
      </button>
      <aside className={`sidebar-left ${isOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          <div id="logo">
            <h2>Header</h2>
            <button className="close-button" onClick={toggleSidebar}>
              x
            </button>
          </div>

          <div id="links" style={{ position: "relative" }}>
            <div
              className="sliding-bar"
              style={{
                top: `${sliderStyle.top}px`,
                height: `${sliderStyle.height}px`,
                opacity: sliderStyle.opacity,
              }}
            ></div>
            <div className="link-container">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active-tab" : "")}
              >
                Home
              </NavLink>
            </div>
            <div className="link-container">
              <NavLink
                to="/student-management"
                className={({ isActive }) => (isActive ? "active-tab" : "")}
              >
                Manage Subjects
              </NavLink>
            </div>
            <div className="link-container">
              <NavLink
                to="/payment"
                className={({ isActive }) => (isActive ? "active-tab" : "")}
              >
                Payment
              </NavLink>
            </div>
            <div className="link-container">
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? "active-tab" : "")}
              >
                About
              </NavLink>
            </div>
            <div className="link-container">
              {/* 4. Changed from NavLink to a clickable anchor tag that opens our modal */}
              <a 
                href="#" 
                onClick={handleLogoutClick}
                style={{ cursor: "pointer", display: "block", textDecoration: "none" }}
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/*Modal for Logout*/}
      {showLogoutModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: "24px", color: "#333" }}>Are you sure you want to logout?</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
              <button onClick={cancelLogout} style={cancelButtonStyle}>
                Cancel
              </button>
              <button onClick={confirmLogout} style={confirmButtonStyle}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Inline styles for the modal to keep it perfectly centered and looking clean.
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, 
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "32px",
  borderRadius: "8px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
  minWidth: "300px",
};

const cancelButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f4f4f9",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const confirmButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#fa6d06", 
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Navigation;