import { useContext, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";

export default function ForgotPassword() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const emailRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Forgot Password";
  }, [setDisplayHeader]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = emailRef.current.value.trim();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Request failed");
      setSuccess("If that email is registered, a password reset link has been sent.");
      emailRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SectionHeader title="FORGOT PASSWORD" />
      <form onSubmit={handleSubmit} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          Reset Your Password
        </p>
        <p className="min-font sec-font-clr sub-header-margin align" style={{ lineHeight: "1.5" }}>
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
        <div className="form-wrapper">
          <input ref={emailRef} required type="email" placeholder="Enter your email" />
        </div>
        {error && <p className="min-font" style={{ color: "#e94560", margin: "0.5em 0" }}>{error}</p>}
        {success && <p className="min-font" style={{ color: "#4ade80", margin: "0.5em 0" }}>{success}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="pri-bg transition standard-weight header-margin"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
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
