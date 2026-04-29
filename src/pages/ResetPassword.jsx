import { useContext, useEffect, useState } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Reset Password";
  }, [setDisplayHeader]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      toast.success("Password reset successfully! You can now log in.", { theme: "dark" });
      navigate("/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SectionHeader title="RESET PASSWORD" />
      <form onSubmit={handleSubmit} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          Set New Password
        </p>
        <p className="min-font sec-font-clr sub-header-margin align" style={{ lineHeight: "1.5" }}>
          Enter your new password below.
        </p>
        <div className="form-wrapper password-div">
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-wrapper password-div">
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="min-font" style={{ color: "#e94560", margin: "0.5em 0" }}>{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="pri-bg transition standard-weight header-margin"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
        <Link style={{ textDecoration: "none" }} to="/sign-in">
          <p className="min-fz sec-font-clr2 sub-header-margin standard-weight align">
            Back to Sign In
          </p>
        </Link>
      </form>
    </div>
  );
}
