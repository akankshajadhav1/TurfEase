import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "../style/UserRegister.css";
const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState("USER");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      await register(name, email, password, phone, role);

      toast.success("Registration successful! Redirecting...");

      setTimeout(() => {
        if (role === "ADMIN") {
          navigate("/adminDashboard"); // Change this route if your admin dashboard URL is different
        } else {
          navigate("/userHome"); // Change this route if your user home URL is different
        }
      }, 2000); // giving some time to show toast
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {(error || authError) && (
        <div className="error-message">{error || authError}</div>
      )}
      <div className="card form-card" style={{ maxWidth: "500px" }}>
        <div className="text-center fs-5 fw-bold">
          <h5 style={{ color: "#03a9f4" }}>Register</h5>
        </div>
        <div className="card-body">
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                className="form-control"
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                className="form-control"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Contact No</label>
              <input
                className="form-control"
                id="phone"
                type="tel"
                placeholder="Enter your contact number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Register as:</label>
              <select
                className="form-control"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              style={{
                backgroundColor: "#28a745",
                color: "white",
                fontSize: "18px",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background 0.3s ease-in-out",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
              className="btn submit-btn"
              type="submit"
            >
              Register
            </button>
          </form>

          <div className="register-link">
            <p style={{ color: "#28a745" }}>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
