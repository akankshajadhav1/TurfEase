import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/e_logo.png";
import "../style/Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        {/* Logo & Brand */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="TurfEase Logo"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
          />
          <b className="text-white">TurfEase</b>
        </NavLink>

        {/* Navbar Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Common Links */}

            {/* Conditional Links based on Authentication and Role */}
            {isAuthenticated ? (
              <>
                {user.role === "USER" && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/about"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-link" : ""}`
                        }
                      >
                        <b>About Us</b>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-link" : ""}`
                        }
                      >
                        <b>Contact Us</b>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/userHome"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-link" : ""}`
                        }
                      >
                        <b>Home</b>
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        to="/bookings"
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "active-link" : ""}`
                        }
                      >
                        <b>My Bookings</b>
                      </NavLink>
                    </li>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <li className="nav-item">
                    <NavLink
                      to="/adminDashboard"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      <b>Admin Dashboard</b>
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link text-white">
                    <b>
                      Welcome, <br />
                      <p style={{ color: "#1DBFC5" }}>{user.name}</p>
                    </b>
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>
                    <b>Logout</b>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    <b>Login</b>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    <b>Register</b>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
