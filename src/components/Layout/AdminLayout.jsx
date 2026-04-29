import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAdminSession } from "../../utils/adminApi";
import "../../styles/admin-layout.css";

const navItems = [
  { path: "/admin/dashboard", icon: "fa-gauge-high", label: "Dashboard" },
  { path: "/admin/dashboard", icon: "fa-car", label: "Fleet" },
  { path: "/admin/dashboard", icon: "fa-calendar-check", label: "Bookings" },
  { path: "/admin/dashboard", icon: "fa-id-card", label: "Drivers" },
  { path: "/admin/dashboard", icon: "fa-ticket", label: "Support" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className={`fa-solid ${sidebarOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <h1 className="admin-sidebar-logo">MzansiRides</h1>
          <p className="admin-sidebar-tagline">Admin Control Panel</p>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/home" className="admin-nav-item" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Website</span>
          </Link>
          <button onClick={handleLogout} className="admin-nav-item admin-logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="admin-main">
        <div className="admin-main-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
