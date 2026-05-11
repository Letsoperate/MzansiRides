import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import "../styles/signin.css";
import { apiRequest, hasAdminSession, setAdminSession } from "../utils/adminApi";
import { useContext } from "react";

export default function AdminLogin() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [isOnView, setIsOnView] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Admin Login";
    if (hasAdminSession()) navigate("/admin/dashboard", { replace: true });
  }, [navigate, setDisplayHeader]);

  function togglePasswordView() {
    setIsOnView((prev) => !prev);
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value;
    if (!email || !password) { setError("Please enter admin email and password."); return; }

    try {
      setIsSubmitting(true);
      const payload = await apiRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminSession(payload.token, payload.admin);
      if (payload.mustChangePassword) {
        navigate("/admin/change-password");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SectionHeader title="ADMIN LOGIN" />
      <form onSubmit={handleAdminLogin} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          Admin Portal Sign In
        </p>
        <div className="form-wrapper">
          <input ref={emailRef} required type="email" placeholder="Enter admin email" />
        </div>
        <div className="form-wrapper password-div">
          <input ref={passwordRef} required type={isOnView ? "text" : "password"} placeholder="Enter password" />
          <i onClick={togglePasswordView} className={`fa-solid fa-${isOnView ? "eye-slash" : "eye"} sec-font-clr2 standard-fz`}></i>
        </div>

        {error && (
          <div className="min-font" style={{ color: "#e94560", margin: "0.5em 0", lineHeight: "1.5" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="pri-bg transition standard-weight header-margin">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <Link style={{ textDecoration: "none" }} to="/home">
          <p className="min-fz sec-font-clr2 sub-header-margin standard-weight align">
            <i className="fa-solid fa-arrow-left"></i> Back to website
          </p>
        </Link>
      </form>
    </div>
  );
}
