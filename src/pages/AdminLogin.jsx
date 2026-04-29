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
      setError("Please enter admin email and password.");
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
      <section className="admin-shell">
        <div className="admin-card shadow" style={{ maxWidth: "520px", margin: "0 auto" }}>
          <div className="admin-login-logo">
            <h1>MzansiRides</h1>
            <p>Admin Portal</p>
          </div>
          <h2 className="admin-title sec-font3">Sign In</h2>
          <p className="admin-subtitle min-font">
            Manage vehicles, bookings, drivers, and platform operations.
          </p>

          <form onSubmit={handleAdminLogin}>
            <div className="form-wrapper admin-form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin email"
              />
            </div>
            <div className="form-wrapper admin-form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>

            {error && <p className="admin-error min-font">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="admin-primary-btn standard-weight transition"
            >
              {isSubmitting ? "Signing in..." : "Access Dashboard"}
            </button>
          </form>

          <div className="admin-note-wrapper">
            <Link to="/home" className="admin-back-link min-font standard-weight">
              <i className="fa-solid fa-arrow-left"></i> Back to website
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
