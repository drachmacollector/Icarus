import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

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
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="nav-link dropdown-toggle">
            Solar Activity ▾
          </span>

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/Flare" className="dropdown-item">Solar Flares</Link>
              <Link to="/CmeTracker" className="dropdown-item">Coronal Mass Ejections</Link>
              <Link to="/HeatMapDashboard" className="dropdown-item">Heat Map</Link>
              <Link to="/AuroraForecast" className="dropdown-item">Auroras</Link>
            </div>
          )}
        </div>
        {/* Dropdown End */}

        <Link to="/analysis" className={`nav-link ${location.pathname === "/analysis" ? "active" : ""}`}>
          analysis
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
