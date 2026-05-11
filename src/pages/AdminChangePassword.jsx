import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import "../styles/signin.css";
import { apiRequest, getAdminUser, clearAdminSession } from "../utils/adminApi";

export default function AdminChangePassword() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const navigate = useNavigate();
  const admin = getAdminUser();
  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Change Password";
  }, [setDisplayHeader]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const currentPassword = currentRef.current.value;
    const newPassword = newRef.current.value;
    const confirmPassword = confirmRef.current.value;

    if (!currentPassword || !newPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest("/api/admin/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSuccess("Password changed successfully! Redirecting to dashboard...");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SectionHeader title="CHANGE PASSWORD" />
      <form onSubmit={handleSubmit} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          {admin?.mustChangePassword !== false
            ? "You must change your temporary password before continuing"
            : "Change Your Password"}
        </p>

        {admin?.mustChangePassword !== false && (
          <p className="min-font align" style={{ color: "#f59e0b", marginBottom: "0.8rem" }}>
            <i className="fa-solid fa-triangle-exclamation"></i> First-time login — password change required
          </p>
        )}

        <div className="form-wrapper">
          <input ref={currentRef} required type="password" placeholder="Current / Temporary password" />
        </div>
        <div className="form-wrapper">
          <input ref={newRef} required type="password" placeholder="New password (min 6 chars)" />
        </div>
        <div className="form-wrapper">
          <input ref={confirmRef} required type="password" placeholder="Confirm new password" />
        </div>

        {error && (
          <div className="min-font" style={{ color: "#e94560", margin: "0.5em 0", lineHeight: "1.5" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="min-font" style={{ color: "#4ade80", margin: "0.5em 0", lineHeight: "1.5" }}>
            <i className="fa-solid fa-circle-check"></i> {success}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="pri-bg transition standard-weight header-margin">
          {isSubmitting ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
