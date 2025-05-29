import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../images/e_logo.png";

function AdminNavComponents() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");

    if (token) {
      setIsLoggedIn(true);
      setUsername(name || "");
    } else {
      setIsLoggedIn(false);
      setUsername("");
    }

    // Redirect to login if trying to access dashboard without logging in
    if (!token && location.pathname === "/dashboard") {
      navigate("/login");
    }
  }, [location, navigate, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
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
          <b className="text-white">BookaCourt</b>
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
            {/* <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                <b>About Us</b>
              </NavLink>
            </li> */}
            {/* <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                <b>Contact Us</b>
              </NavLink>
            </li> */}

            {/* Show Home & Logout if Logged In */}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to="/adminDashboard" className="nav-link">
                    <b>AdminDashboard</b>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-white">
                    <b>
                      Welcome, <br></br>
                      <p style={{ color: "#1DBFC5" }}> {username}</p>
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
                  <NavLink to="/login" className="nav-link">
                    <b>Login</b>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
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
}

export default AdminNavComponents;
