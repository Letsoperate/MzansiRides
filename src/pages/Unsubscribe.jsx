import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SectionHeader from "../components/UI/SectionHeader";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "MzansiRides - Unsubscribe";

    if (!token) {
      setStatus("error");
      setMessage("No unsubscribe token provided.");
      return;
    }

    fetch("/api/public/unsubscribe?token=" + encodeURIComponent(token))
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        setStatus(ok ? "success" : "error");
        setMessage(data.message);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Failed to unsubscribe. Please try again.");
      });
  }, [token]);

  return (
    <div>
      <SectionHeader title="UNSUBSCRIBE" />
      <div className="signin-form constant-margin sec-bg" style={{ textAlign: "center" }}>
        {status === "loading" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-notch fa-spin sec-font-clr2" style={{ fontSize: "2.5rem" }}></i>
            </div>
            <p className="standard-fz sec-font-clr">Processing...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-check" style={{ fontSize: "2.5rem", color: "#4ade80" }}></i>
            </div>
            <p className="standard-fz" style={{ color: "#4ade80" }}>{message}</p>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <button className="pri-bg transition standard-weight header-margin">Back to Home</button>
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="header-margin">
              <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "2.5rem", color: "#e94560" }}></i>
            </div>
            <p className="standard-fz" style={{ color: "#e94560" }}>{message}</p>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <button className="pri-bg transition standard-weight header-margin">Back to Home</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
