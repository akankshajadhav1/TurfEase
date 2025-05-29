import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Userlogin.css";

const Login = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { login, error: authError, isAuthenticated, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful! Redirecting...", { autoClose: 1500 });

      setTimeout(() => {
        if (user?.role?.toUpperCase() === "ADMIN") {
          navigate("/adminDashboard", { replace: true });
        } else {
          navigate("/userHome", { replace: true });
        }
      }, 2000);
    }
  }, [isAuthenticated, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {(error || authError) && (
        <div className="error-message">{error || authError}</div>
      )}
      <div className="login-card form-card">
        <div className="login-card-header text-black text-center">
          <h4 className="login-card-title">Login</h4>
        </div>
        <div className="login-card-body">
          <form className="login-form-grid" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Email
              </label>
              <input
                className="login-form-control"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="login-form-control"
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register link */}
          <div className="register-link">
            <p>
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
