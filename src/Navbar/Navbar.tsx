import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    hideTimerRef.current = setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
          Home
        </Link>

        <Link to="/News" className={`nav-link ${location.pathname === "/News" ? "active" : ""}`}>
          News
        </Link>

        {/* Dropdown Start */}
        <div
          className="dropdown"
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          <span
            className={`nav-link dropdown-toggle ${showDropdown ? "dropdown-open" : ""}`}
          >
            Solar Activity ▾
          </span>

          {showDropdown && (
            <div
              className="dropdown-menu"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              <Link to="/Flare" className="dropdown-item" onClick={() => setShowDropdown(false)}>Solar Flares</Link>
              <Link to="/CmeTracker" className="dropdown-item" onClick={() => setShowDropdown(false)}>Coronal Mass Ejections</Link>
              <Link to="/HeatMapDashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>Heat Map</Link>
              <Link to="/AuroraForecast" className="dropdown-item" onClick={() => setShowDropdown(false)}>Auroras</Link>
              <Link to="/Kp" className="dropdown-item" onClick={() => setShowDropdown(false)}>Kp Index</Link>
              
            </div>
          )}
        </div>
        {/* Dropdown End */}

        <Link to="/Analysis" className={`nav-link ${location.pathname === "/Analysis" ? "active" : ""}`}>
          Analysis
        </Link>

        <Link to="/Timeline" className={`nav-link ${location.pathname === "/Timeline" ? "active" : ""}`}>
          Timeline
        </Link>

        <Link to="/AboutPage" className={`nav-link ${location.pathname === "/AboutPage" ? "active" : ""}`}>
          About
        </Link>
      </div>
    </nav>
  );
}
