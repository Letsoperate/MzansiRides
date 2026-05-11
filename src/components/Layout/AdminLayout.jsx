import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminSession, getAdminUser } from "../../utils/adminApi";
import "../../styles/admin-layout.css";

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
  const admin = getAdminUser();
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
    <div className="admin-layout">
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <h1>MzansiRides</h1>
          <span>Admin Panel</span>
        </div>

        <button className="admin-nav-toggle" onClick={() => setMobileNav(!mobileNav)}>
          <i className={`fa-solid ${mobileNav ? "fa-xmark" : "fa-bars"}`}></i>
        </button>

        <nav className={`admin-topnav ${mobileNav ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileNav(false)}
              className={`admin-topnav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
          {admin?.role === "SUPER_ADMIN" && (
            <Link
              to="/admin/users"
              onClick={() => setMobileNav(false)}
              className={`admin-topnav-link ${location.pathname === "/admin/users" ? "active" : ""}`}
            >
              <i className="fa-solid fa-users-gear"></i>
              <span>Admins</span>
            </Link>
          )}
          <span className="admin-topnav-spacer"></span>
          <Link to="/home" className="admin-topnav-link">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-topnav-link admin-logout-link">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </nav>
      </header>

      {mobileNav && <div className="admin-nav-overlay" onClick={() => setMobileNav(false)}></div>}

      <main className="admin-main">
        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
