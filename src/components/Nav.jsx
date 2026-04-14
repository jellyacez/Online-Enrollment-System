import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; //this is react "Link", must be used instead of 'link'
import "../css/index.css";
import MenuIcon from "../assets/menu-svgrepo-com.svg";
function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const [sliderStyle, setSliderStyle] = useState({
    top: 0,
    height: 0,
    opacity: 0,
  });

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
          </div>
        </div>
      </aside>
    </>
  );
}
export default Navigation;
