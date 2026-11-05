import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa"; 
import "./Navbar.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const doctorName = localStorage.getItem("doctorName");

  // Pehla Effect: Theme handle karne ke liye (Independently)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Doosra Effect: Initial data load karne ke liye
  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setToken(localStorage.getItem("token"));
  }, []); 

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-1">
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to={token ? "/dashboard" : "/login"}
        >
          <img 
            src={logo} 
            alt="CAD AI Logo" 
            className="navbar-logo-img me-2" 
          />
          <span className="fs-5 brand-text">
            CAD <span className="text-info">DETECTION</span>
          </span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {token && (
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/history">Scan History</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/predict">Predict</Link>
              </li>
              {role === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin">Admin Panel</Link>
                </li>
              )}
            </ul>
          )}

          <div className="ms-auto d-flex align-items-center">
            {!token ? (
              <>
                <Link className="btn btn-outline-light btn-sm me-2" to="/login">Login</Link>
                <Link className="btn btn-light btn-sm fw-bold rounded-pill px-3" to="/register">Register</Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center rounded-pill px-3"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle className="me-2 text-primary" size={18} />
                  <span className="fw-bold">{doctorName || "Doctor"}</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-1 rounded-3">
                  {/* --- Dark Mode Toggle --- */}
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center" 
                      onClick={() => setDarkMode(!darkMode)}
                    >
                      {darkMode ? <FaSun className="me-2 text-warning" /> : <FaMoon className="me-2 text-primary" />}
                      {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger d-flex align-items-center" onClick={logout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}