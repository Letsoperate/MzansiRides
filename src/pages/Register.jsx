import { useContext, useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";
import { toast } from "react-toastify";

export default function Register() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const navigate = useNavigate();
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Register";
  }, [setDisplayHeader]);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    const fullName = fullNameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const password = passwordRef.current.value;
    const confirm = confirmRef.current.value;

    if (!fullName || !email || !password || !confirm) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful! Please check your email to verify your account.", { theme: "dark" });
      navigate("/sign-in");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <SectionHeader title="REGISTER" />
      <form onSubmit={handleRegister} className="signin-form constant-margin sec-bg">
        <p className="standard-fz header-margin align sec-font sec-font-clr" data-aos="fade">
          Register Your Account
        </p>
        <div className="form-wrapper">
          <input ref={fullNameRef} required type="text" placeholder="Enter full name" />
        </div>
        <div className="form-wrapper">
          <input ref={emailRef} required type="email" placeholder="Enter email" />
        </div>
        <div className="form-wrapper">
          <input ref={phoneRef} type="tel" placeholder="Enter phone number (optional)" />
        </div>
        <div className="form-wrapper password-div">
          <input ref={passwordRef} required type="password" placeholder="Enter password (min 8 chars)" />
        </div>
        <div className="form-wrapper password-div">
          <input ref={confirmRef} required type="password" placeholder="Confirm password" />
        </div>
        {error && <p className="min-font" style={{ color: "#e94560", margin: "0.5em 0" }}>{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="pri-bg transition standard-weight header-margin"
        >
          {isSubmitting ? "Registering..." : "REGISTER"}
        </button>
        <Link style={{ textDecoration: "none" }} to="/sign-in">
          <p className="min-fz sec-font-clr2 sub-header-margin standard-weight align">
            Already have an account?
          </p>
        </Link>
      </form>
    </div>
  );
}
