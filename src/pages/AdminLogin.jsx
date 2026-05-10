import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { apiRequest, hasAdminSession, setAdminSession } from "../utils/adminApi";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "MzansiRides - Admin Login";

    if (hasAdminSession()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Please enter your admin email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setAdminSession(payload.token, payload.admin);
      navigate("/admin/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-login-shape admin-login-shape-1"></div>
        <div className="admin-login-shape admin-login-shape-2"></div>
      </div>

      <section className="admin-login-wrapper">
        <div className="admin-login-card shadow">
          <div className="admin-login-header">
            <div className="admin-login-brand">
              <span className="admin-login-brand-icon">
                <i className="fa-solid fa-car"></i>
              </span>
              <div>
                <h1 className="admin-login-logo-text">MzansiRides</h1>
                <p className="admin-login-tagline">Drive Mzansi, Your Way</p>
              </div>
            </div>
            <div className="admin-login-badge">
              <i className="fa-solid fa-shield-halved"></i> Admin Portal
            </div>
          </div>

          <div className="admin-login-divider"></div>

          <h2 className="admin-login-title">Welcome Back</h2>
          <p className="admin-login-subtitle">
            Sign in to manage your fleet, bookings, drivers, and operations.
          </p>

          <form onSubmit={handleAdminLogin} className="admin-login-form">
            <div className="admin-login-field">
              <label className="admin-login-label">
                <i className="fa-solid fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your admin email"
                autoComplete="email"
              />
            </div>

            <div className="admin-login-field">
              <label className="admin-login-label">
                <i className="fa-solid fa-lock"></i> Password
              </label>
              <div className="admin-login-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid fa-${showPassword ? "eye-slash" : "eye"}`}></i>
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-login-error">
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-login-submit transition"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/home" className="admin-login-back-link transition">
              <i className="fa-solid fa-arrow-left"></i> Back to website
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
