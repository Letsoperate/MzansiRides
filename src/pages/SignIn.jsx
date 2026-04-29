import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import "../styles/signin.css";
import { setUserSession, hasUserSession } from "../utils/authApi";
import { toast } from "react-toastify";

export default function SignIn() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [isOnView, setIsOnView] = useState(false);
  const [error, setError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Sign In";
    if (hasUserSession()) navigate("/home", { replace: true });
  }, [navigate, setDisplayHeader]);

  function togglePasswordView() {
    setIsOnView((prev) => !prev);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    if (!email || !password) { setError("Please enter email and password."); return; }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message && data.message.toLowerCase().includes("verify")) {
          setNeedsVerification(true);
          setError(data.message);
          return;
        }
        throw new Error(data.message || "Login failed");
      }
      setUserSession(data.token, data.user);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendVerification() {
    const email = emailRef.current.value.trim();
    if (!email) { toast.error("Please enter your email first.", { theme: "dark" }); return; }
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.success(data.message || "Verification email sent.", { theme: "dark" });
    } catch {
      toast.error("Failed to resend verification.", { theme: "dark" });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div>
      <SectionHeader title="SIGN IN" />
      <form onSubmit={handleSignIn} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          Sign In To Your Account
        </p>
        <div className="form-wrapper">
          <input ref={emailRef} required type="email" placeholder="Enter email" />
        </div>
        <div className="form-wrapper password-div">
          <input ref={passwordRef} required type={isOnView ? "text" : "password"} placeholder="Enter password" />
          <i onClick={togglePasswordView} className={`fa-solid fa-${isOnView ? "eye-slash" : "eye"} sec-font-clr2 standard-fz`}></i>
        </div>

        {error && (
          <div className="min-font" style={{ color: needsVerification ? "#f59e0b" : "#e94560", margin: "0.5em 0", lineHeight: "1.5" }}>
            {error}
          </div>
        )}

        {needsVerification && (
          <button type="button" onClick={handleResendVerification} disabled={isResending}
            className="pri-bg transition standard-weight" style={{ width: "100%", marginBottom: "0.5rem", background: "linear-gradient(135deg, hsl(35,85%,50%), hsl(35,70%,40%))" }}>
            {isResending ? "Sending..." : "Resend Verification Email"}
          </button>
        )}

        <button type="submit" disabled={isSubmitting} className="pri-bg transition standard-weight header-margin">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <Link style={{ textDecoration: "none" }} to="/forgot-password">
          <p className="min-fz sec-font-clr2 sub-header-margin standard-weight align">Forgot password?</p>
        </Link>
        <Link style={{ textDecoration: "none" }} to="/register">
          <p className="min-fz sec-font-clr2 sub-header-margin standard-weight align">Don&apos;t have an account?</p>
        </Link>
      </form>
    </div>
  );
}
