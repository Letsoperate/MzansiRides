import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminSession } from "../../utils/adminApi";

const navItems = [
  { path: "/admin/dashboard", icon: "fa-gauge-high", label: "Dashboard" },
  { path: "/admin/fleet", icon: "fa-car", label: "Fleet" },
  { path: "/admin/bookings", icon: "fa-calendar-check", label: "Bookings" },
  { path: "/admin/drivers", icon: "fa-id-card", label: "Drivers" },
  { path: "/admin/support", icon: "fa-headset", label: "Support" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNav, setMobileNav] = useState(false);
  const isLoginPage = location.pathname === "/admin/login";

  function handleLogout() {
    clearAdminSession();
    navigate("/admin/login");
  }

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #1a1a2e 40%, #16213e 70%, #0f3460)" }}>
      <header
        className="shadow transition"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "rgba(15,15,35,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(233,69,96,0.15)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          minHeight: "56px",
          flexWrap: "wrap",
        }}
      >
        <div className="flex" style={{ gap: "0.6rem", alignItems: "center" }}>
          <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
            <h1 className="standard-fz standard-weight" style={{ color: "#fff", margin: 0 }}>
              <span className="sec-font-clr2">Mzansi</span>Rides
            </h1>
          </Link>
          <span className="min-font" style={{ color: "#e94560", background: "rgba(233,69,96,0.15)", padding: "0.2em 0.6em", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Admin
          </span>
        </div>

        <button
          onClick={() => setMobileNav(!mobileNav)}
          className="transition admin-mobile-toggle"
          style={{
            display: "none",
            background: "none",
            border: "1px solid rgba(233,69,96,0.3)",
            color: "#fff",
            fontSize: "1.2rem",
            padding: "0.3em 0.6em",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          <i className={`fa-solid ${mobileNav ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        <nav
          className="flex"
          style={{
            gap: "0.25rem",
            flexWrap: "wrap",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNav(false)}
              className="transition"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.5em 1em",
                color: location.pathname === item.path ? "#e94560" : "#8892b0",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                borderRadius: "6px",
                background: location.pathname === item.path ? "rgba(233,69,96,0.12)" : "transparent",
              }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ fontSize: "0.8rem", width: "16px", textAlign: "center" }}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            to="/home"
            className="transition"
            style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              padding: "0.5em 1em", color: "#8892b0", textDecoration: "none",
              fontSize: "0.85rem", fontWeight: 500, borderRadius: "6px",
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ fontSize: "0.8rem" }}></i>
            <span>Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="transition"
            style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              padding: "0.5em 1em", color: "#e94560", background: "none", border: "none",
              fontSize: "0.85rem", fontWeight: 500, borderRadius: "6px", cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ fontSize: "0.8rem" }}></i>
            <span>Logout</span>
          </button>
        </nav>
      </header>

      <main style={{ paddingBottom: "3rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
