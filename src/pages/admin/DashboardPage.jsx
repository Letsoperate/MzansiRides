import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminUser } from "../../utils/adminApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const admin = getAdminUser();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subCount, setSubCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [cars, setCars] = useState([]);

  const load = useCallback(async () => {
    document.title = "MzansiRides - Dashboard";
    if (!hasAdminSession()) { navigate("/admin/login", { replace: true }); return; }
    try {
      const [statsRes, bookingsRes, driversRes, ticketsRes, carsRes, subRes] = await Promise.all([
        apiRequest("/api/admin/stats"), apiRequest("/api/admin/bookings"),
        apiRequest("/api/admin/drivers"), apiRequest("/api/admin/tickets"),
        apiRequest("/api/admin/cars"), apiRequest("/api/admin/subscribers/count").catch(() => ({ count: 0 })),
      ]);
      setStats(statsRes.stats || []);
      setSubCount(subRes.count || 0);
      setRecentBookings((bookingsRes || []).slice(0, 5));
      setBookings(bookingsRes || []);
      setPendingDrivers((driversRes || []).filter(d => d.status === "pending"));
      setOpenTickets((ticketsRes || []).filter(t => t.status === "open"));
      setCars(carsRes || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) { clearAdminSession(); navigate("/admin/login"); }
    } finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  if (isLoading) return (
    <div className="constant-padding constant-margin align">
      <p className="sec-font-clr standard-fz">Loading dashboard...</p>
    </div>
  );

  const available = cars.filter(c => c.status === "available").length;
  const booked = cars.filter(c => c.status === "booked").length;
  const maintenance = cars.filter(c => c.status === "maintenance").length;
  const totalDailyRevenue = cars.reduce((sum, c) => sum + parseInt(c.dailyRate || 0), 0);
  const avgDailyRate = cars.length > 0 ? Math.round(totalDailyRevenue / cars.length) : 0;
  const activeBookings = parseInt(stats.find(s => s.label === "Active Bookings")?.value || 0);
  const pendingD = parseInt(stats.find(s => s.label === "Pending Drivers")?.value || 0);
  const openT = parseInt(stats.find(s => s.label === "Support Tickets")?.value || 0);

  return (
    <div className="constant-padding constant-margin" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className="flex-main header-margin" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="min-font sec-font-clr" style={{ textTransform: "uppercase", letterSpacing: "1px" }}>
            Admin Dashboard
          </p>
          <h1 className="standard-fz2 pri-font-clr" style={{ margin: 0 }}>
            Welcome, {admin?.fullName || "Admin"}
          </h1>
        </div>
        <Link
          to="/home"
          className="btn-padding pri-bg standard-weight transition"
          style={{ textDecoration: "none", borderRadius: "6px", fontSize: "0.85rem" }}
        >
          <i className="fa-solid fa-arrow-left"></i> View Site
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="cars-container header-margin" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        {[
          { label: "Available Cars", value: available, icon: "fa-car", color: "#4ade80" },
          { label: "Active Bookings", value: activeBookings, icon: "fa-calendar-check", color: "#f59e0b" },
          { label: "Pending Drivers", value: pendingD, icon: "fa-id-card", color: "#38bdf8" },
          { label: "Open Tickets", value: openT, icon: "fa-headset", color: "#a78bfa" },
          { label: "Subscribers", value: subCount, icon: "fa-envelope", color: "#e94560" },
          { label: "Total Fleet", value: cars.length, icon: "fa-warehouse", color: "#ccc" },
        ].map((s, i) => (
          <div
            key={i}
            className="shadow transition"
            style={{
              background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
              border: "1px solid rgba(233,69,96,0.15)",
              borderRadius: "12px",
              padding: "1.2rem",
              textAlign: "center",
            }}
          >
            <i className={`fa-solid ${s.icon} title-fz`} style={{ color: s.color }}></i>
            <p className="standard-fz2 standard-weight" style={{ margin: "0.4rem 0 0.2rem", fontSize: "2rem", color: "#fff" }}>
              {s.value}
            </p>
            <p className="min-font sec-font-clr">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="shadow constant-padding header-margin" style={{
        background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
        border: "1px solid rgba(233,69,96,0.15)",
        borderRadius: "12px",
      }}>
        <h3 className="standard-fz sec-font-clr2">Revenue Overview</h3>
        <div className="cars-container" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: "0.5rem" }}>
          {[
            { label: "Total Fleet Daily", value: `R${totalDailyRevenue.toLocaleString()}` },
            { label: "Avg Rate / Vehicle", value: `R${avgDailyRate.toLocaleString()}` },
            { label: "Completed Bookings", value: bookings.filter(b => b.status === "completed").length },
            { label: "Monthly Potential", value: `R${(totalDailyRevenue * 30).toLocaleString()}` },
          ].map((r, i) => (
            <div key={i} style={{ padding: "0.5rem 0" }}>
              <p className="min-font sec-font-clr">{r.label}</p>
              <p className="standard-fz pri-font-clr standard-weight">{r.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="cars-container header-margin">
        {/* Recent Bookings */}
        <div className="shadow constant-padding" style={{
          background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
          border: "1px solid rgba(233,69,96,0.15)",
          borderRadius: "12px",
        }}>
          <h3 className="standard-fz sec-font-clr2">Recent Bookings</h3>
          <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recentBookings.length === 0 && <p className="min-font sec-font-clr">No bookings yet</p>}
            {recentBookings.map(b => (
              <div key={b.id} className="flex-main" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.4rem" }}>
                <div>
                  <p className="standard-fz sec-font standard-weight">{b.customerName}</p>
                  <p className="min-font sec-font-clr">{b.carName || "N/A"} &middot; {b.city}</p>
                </div>
                <span className="badge" style={{
                  padding: "0.15em 0.6em", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 600,
                  background: b.status === "active" ? "rgba(74,222,128,0.2)" : b.status === "pending_approval" ? "rgba(245,158,11,0.2)" : "rgba(148,163,184,0.15)",
                  color: b.status === "active" ? "#4ade80" : b.status === "pending_approval" ? "#f59e0b" : "#94a3b8",
                }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/bookings" className="sec-font-clr2 min-font standard-weight" style={{ display: "block", marginTop: "0.8rem", textDecoration: "none" }}>
            View all bookings <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* Pending Drivers */}
        <div className="shadow constant-padding" style={{
          background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
          border: "1px solid rgba(233,69,96,0.15)",
          borderRadius: "12px",
        }}>
          <h3 className="standard-fz sec-font-clr2">Pending Drivers</h3>
          <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {pendingDrivers.length === 0 && <p className="min-font sec-font-clr">No pending applications</p>}
            {pendingDrivers.map(d => (
              <div key={d.id} className="flex-main" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.4rem" }}>
                <div>
                  <p className="standard-fz sec-font standard-weight">{d.applicantName}</p>
                  <p className="min-font sec-font-clr">{d.city || "N/A"} &middot; {d.email}</p>
                </div>
                <span className="badge" style={{ padding: "0.15em 0.6em", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}>
                  pending
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/drivers" className="sec-font-clr2 min-font standard-weight" style={{ display: "block", marginTop: "0.8rem", textDecoration: "none" }}>
            View all drivers <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* Open Tickets */}
        <div className="shadow constant-padding" style={{
          background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
          border: "1px solid rgba(233,69,96,0.15)",
          borderRadius: "12px",
        }}>
          <h3 className="standard-fz sec-font-clr2">Open Tickets</h3>
          <div style={{ marginTop: "0.8rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {openTickets.length === 0 && <p className="min-font sec-font-clr">No open tickets</p>}
            {openTickets.map(t => (
              <div key={t.id} className="flex-main" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.4rem" }}>
                <div>
                  <p className="standard-fz sec-font standard-weight">{t.customerName}</p>
                  <p className="min-font sec-font-clr">{t.subject || "No subject"}</p>
                </div>
                <span className="badge" style={{ padding: "0.15em 0.6em", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(56,189,248,0.2)", color: "#38bdf8" }}>
                  open
                </span>
              </div>
            ))}
          </div>
          <Link to="/admin/support" className="sec-font-clr2 min-font standard-weight" style={{ display: "block", marginTop: "0.8rem", textDecoration: "none" }}>
            View all tickets <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>

      {/* Fleet Status */}
      <div className="shadow constant-padding header-margin" style={{
        background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
        border: "1px solid rgba(233,69,96,0.15)",
        borderRadius: "12px",
      }}>
        <h3 className="standard-fz sec-font-clr2">Fleet Status</h3>
        <div className="flex-main" style={{ gap: "2rem", marginTop: "0.5rem" }}>
          {[
            { label: "Available", value: available, color: "#4ade80" },
            { label: "Booked", value: booked, color: "#38bdf8" },
            { label: "Maintenance", value: maintenance, color: "#f59e0b" },
          ].map((f, i) => (
            <div key={i}>
              <p className="min-font sec-font-clr">{f.label}</p>
              <p className="standard-fz2 pri-font-clr standard-weight">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
