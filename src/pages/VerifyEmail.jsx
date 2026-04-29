import { useContext, useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";
import { ToggleContext } from "../App";

export default function VerifyEmail() {
  const { setDisplayHeader } = useContext(ToggleContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
    document.title = "MzansiRides - Verify Email";

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    fetch("/api/auth/verify-email?token=" + encodeURIComponent(token))
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Failed to verify email. Please try again.");
      });
  }, [token, setDisplayHeader]);

  return (
    <div>
      <SectionHeader title="EMAIL VERIFICATION" />
      <div className="signin-form constant-margin sec-bg" style={{ textAlign: "center" }}>
        {status === "verifying" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-notch fa-spin sec-font-clr2" style={{ fontSize: "2.5rem" }}></i>
            </div>
            <p className="standard-fz sec-font-clr">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-check" style={{ fontSize: "2.5rem", color: "#4ade80" }}></i>
            </div>
            <p className="standard-fz" style={{ color: "#4ade80" }}>{message}</p>
            <Link to="/sign-in" style={{ textDecoration: "none" }}>
              <button className="pri-bg transition standard-weight header-margin">
                Go to Sign In
              </button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "2.5rem", color: "#e94560" }}></i>
            </div>
            <p className="standard-fz" style={{ color: "#e94560" }}>{message}</p>
            <Link to="/sign-in" style={{ textDecoration: "none" }}>
              <button className="pri-bg transition standard-weight header-margin">
                Go to Sign In
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
