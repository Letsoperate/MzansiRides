import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
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
  const [faqs, setFaqs] = useState([]);
  const [reportStart, setReportStart] = useState("");
  const [reportEnd, setReportEnd] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const load = useCallback(async () => {
    document.title = "MzansiRides - Dashboard";
    if (!hasAdminSession()) { navigate("/admin/login", { replace: true }); return; }
    try {
      const [statsRes, bookingsRes, driversRes, ticketsRes, carsRes, subRes, faqsRes] = await Promise.all([
        apiRequest("/api/admin/stats"), apiRequest("/api/admin/bookings"),
        apiRequest("/api/admin/drivers"), apiRequest("/api/admin/tickets"),
        apiRequest("/api/admin/cars"), apiRequest("/api/admin/subscribers/count").catch(() => ({ count: 0 })),
        apiRequest("/api/admin/faqs"),
      ]);
      setStats(statsRes.stats || []);
      setSubCount(subRes.count || 0);
      setRecentBookings((bookingsRes || []).slice(0, 5));
      setBookings(bookingsRes || []);
      setPendingDrivers((driversRes || []).filter(d => d.status === "pending"));
      setOpenTickets((ticketsRes || []).filter(t => t.status === "open"));
      setCars(carsRes || []);
      setFaqs(faqsRes || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) { clearAdminSession(); navigate("/admin/login"); }
    } finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function downloadReport(format) {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("mzansi_admin_token");
      const params = new URLSearchParams({ format });
      if (reportStart) params.set("start", reportStart);
      if (reportEnd) params.set("end", reportEnd);
      const res = await fetch(`/api/admin/reports/revenue?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-report.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  }

  if (isLoading) return <div className="admin-loading">Loading...</div>;

  const now = new Date().toLocaleString("en-ZA", { hour12: false });
  const available = cars.filter(c => c.status === "available").length;
  const booked = cars.filter(c => c.status === "booked").length;
  const maintenance = cars.filter(c => c.status === "maintenance").length;

  const completedBookings = bookings.filter(b => b.status === "completed" || b.paymentStatus === "PAID");
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.paymentAmount || 0), 0);
  const pendingRevenue = bookings.filter(b => b.status === "approved" && b.paymentStatus !== "PAID").reduce((sum, b) => sum + (b.paymentAmount || 0), 0);
  const avgBookingValue = completedBookings.length > 0 ? Math.round(totalRevenue / completedBookings.length) : 0;

  const activeBookings = parseInt(stats.find(s => s.label === "Active Bookings")?.value || 0);
  const pendingD = parseInt(stats.find(s => s.label === "Pending Drivers")?.value || 0);
  const openT = parseInt(stats.find(s => s.label === "Support Tickets")?.value || 0);
  const pendingF = parseInt(stats.find(s => s.label === "Pending FAQs")?.value || 0);

  const maxVal = Math.max(available, activeBookings, pendingD, openT, 1);

  return (
    <div>
      <div className="classic-header">
        <div>
          <p className="classic-breadcrumb">System Dashboard</p>
          <h2 className="classic-title">MzansiRides Console</h2>
        </div>
        <div className="classic-header-info">
          <span className="sys-info"><i className="fa-solid fa-server"></i> Online</span>
          <span className="sys-info"><i className="fa-solid fa-database"></i> H2</span>
          <span className="sys-time">{now}</span>
        </div>
      </div>

      <div className="panel-grid">
        {/* Revenue Section */}
        <div className="classic-panel panel-span">
          <div className="classic-panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <span>Revenue & Financial Overview</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <input type="date" value={reportStart} onChange={(e) => setReportStart(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #444", background: "#1a1a2e", color: "#e0e0e0", fontSize: "12px" }} />
              <span style={{ color: "#888", fontSize: "12px" }}>to</span>
              <input type="date" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #444", background: "#1a1a2e", color: "#e0e0e0", fontSize: "12px" }} />
              <button onClick={() => downloadReport("csv")} disabled={isDownloading} className="admin-btn sm" style={{ fontSize: "11px" }}>
                <i className="fa-solid fa-file-csv"></i> CSV
              </button>
              <button onClick={() => downloadReport("pdf")} disabled={isDownloading} className="admin-btn sm" style={{ fontSize: "11px" }}>
                <i className="fa-solid fa-file-pdf"></i> PDF
              </button>
            </div>
          </div>
          <div className="classic-panel-body">
            <div className="revenue-grid">
              <div className="revenue-card">
                <div className="revenue-icon" style={{ color: "#4ade80" }}><i className="fa-solid fa-coins"></i></div>
                <div>
                  <span className="revenue-value">R{totalRevenue.toLocaleString()}</span>
                  <span className="revenue-label">Total Revenue (Paid)</span>
                </div>
              </div>
              <div className="revenue-card">
                <div className="revenue-icon" style={{ color: "#f59e0b" }}><i className="fa-solid fa-chart-line"></i></div>
                <div>
                  <span className="revenue-value">R{pendingRevenue.toLocaleString()}</span>
                  <span className="revenue-label">Pending Revenue (Unpaid)</span>
                </div>
              </div>
              <div className="revenue-card">
                <div className="revenue-icon" style={{ color: "#38bdf8" }}><i className="fa-solid fa-calculator"></i></div>
                <div>
                  <span className="revenue-value">R{avgBookingValue.toLocaleString()}</span>
                  <span className="revenue-label">Avg Booking Value</span>
                </div>
              </div>
              <div className="revenue-card">
                <div className="revenue-icon" style={{ color: "#a78bfa" }}><i className="fa-solid fa-sack-dollar"></i></div>
                <div>
                  <span className="revenue-value">{completedBookings.length}</span>
                  <span className="revenue-label">Completed Bookings</span>
                </div>
              </div>
            </div>
            <div className="revenue-summary">
              <table className="sys-table">
                <tbody>
                  <tr><td>Active Bookings</td><td className="mono">{activeBookings}</td></tr>
                  <tr><td>Pending Approval</td><td className="mono">{bookings.filter(b => b.status === "pending_approval").length}</td></tr>
                  <tr><td>Total Fleet Units</td><td className="mono">{cars.length}</td></tr>
                  <tr><td>Total Subscribers</td><td className="mono">{subCount}</td></tr>
                  <tr><td>Avg Daily Rate (Fleet)</td><td className="mono">R{Math.round(cars.reduce((s, c) => s + parseInt(c.dailyRate || 0), 0) / (cars.length || 1)).toLocaleString()}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Stats Table */}
        <div className="classic-panel panel-span">
          <div className="classic-panel-header">System Statistics</div>
          <div className="classic-panel-body">
            <table className="stats-table">
              <thead><tr><th>Metric</th><th>Count</th><th>Status</th><th>Graph</th></tr></thead>
              <tbody>
                <tr>
                  <td><i className="fa-solid fa-car" style={{ color: "#4ade80" }}></i> Available Cars</td>
                  <td className="mono">{String(available).padStart(3, "0")}</td>
                  <td><span className="indicator green">● Active</span></td>
                  <td><div className="bar"><div className="bar-fill green" style={{ width: `${(available / maxVal) * 100}%` }}></div></div></td>
                </tr>
                <tr>
                  <td><i className="fa-solid fa-calendar-check" style={{ color: "#f59e0b" }}></i> Active Bookings</td>
                  <td className="mono">{String(activeBookings).padStart(3, "0")}</td>
                  <td><span className="indicator amber">● Active</span></td>
                  <td><div className="bar"><div className="bar-fill amber" style={{ width: `${(activeBookings / maxVal) * 100}%` }}></div></div></td>
                </tr>
                <tr>
                  <td><i className="fa-solid fa-id-card" style={{ color: "#38bdf8" }}></i> Pending Drivers</td>
                  <td className="mono">{String(pendingD).padStart(3, "0")}</td>
                  <td><span className="indicator blue">● Pending</span></td>
                  <td><div className="bar"><div className="bar-fill blue" style={{ width: `${(pendingD / maxVal) * 100}%` }}></div></div></td>
                </tr>
                <tr>
                  <td><i className="fa-solid fa-headset" style={{ color: "#a78bfa" }}></i> Open Tickets</td>
                  <td className="mono">{String(openT).padStart(3, "0")}</td>
                  <td><span className="indicator purple">● Open</span></td>
                  <td><div className="bar"><div className="bar-fill purple" style={{ width: `${(openT / maxVal) * 100}%` }}></div></div></td>
                </tr>
                <tr>
                  <td><i className="fa-solid fa-circle-question" style={{ color: "#f97316" }}></i> Pending FAQs</td>
                  <td className="mono">{String(pendingF).padStart(3, "0")}</td>
                  <td><span className="indicator orange">● Pending</span></td>
                  <td><div className="bar"><div className="bar-fill orange" style={{ width: `${(pendingF / maxVal) * 100}%`, background: "#f97316" }}></div></div></td>
                </tr>
                <tr className="sub-row">
                  <td><i className="fa-solid fa-envelope" style={{ color: "#e94560" }}></i> Subscribers</td>
                  <td className="mono">{String(subCount).padStart(3, "0")}</td>
                  <td><span className="indicator red">● Active</span></td>
                  <td><div className="bar"><div className="bar-fill red" style={{ width: `${Math.min(subCount * 10, 100)}%` }}></div></div></td>
                </tr>
                <tr className="sub-row">
                  <td><i className="fa-solid fa-warehouse" style={{ color: "#ccc" }}></i> Total Fleet</td>
                  <td className="mono">{String(cars.length).padStart(3, "0")}</td>
                  <td><span className="indicator">● Total</span></td>
                  <td><div className="bar"><div className="bar-fill" style={{ width: "100%", background: "#555" }}></div></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet Breakdown */}
        <div className="classic-panel">
          <div className="classic-panel-header">Fleet Status</div>
          <div className="classic-panel-body">
            <table className="sys-table">
              <tbody>
                <tr><td><span className="dot" style={{ background: "#4ade80" }}></span> Available</td><td className="sys-val">{available}</td></tr>
                <tr><td><span className="dot" style={{ background: "#38bdf8" }}></span> Booked</td><td className="sys-val">{booked}</td></tr>
                <tr><td><span className="dot" style={{ background: "#f59e0b" }}></span> Maintenance</td><td className="sys-val">{maintenance}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="classic-panel">
          <div className="classic-panel-header">Recent Bookings</div>
          <div className="classic-panel-body sys-list">
            {recentBookings.length === 0 && <p className="sys-empty">No bookings</p>}
            {recentBookings.map(b => (
              <div key={b.id} className="sys-row">
                <div><strong>{b.customerName}</strong><span>{b.carName || "N/A"} &middot; {b.city}</span></div>
                <span className={`badge ${b.status}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Drivers */}
        <div className="classic-panel">
          <div className="classic-panel-header">Pending Drivers</div>
          <div className="classic-panel-body sys-list">
            {pendingDrivers.length === 0 && <p className="sys-empty">No pending</p>}
            {pendingDrivers.map(d => (
              <div key={d.id} className="sys-row">
                <div><strong>{d.applicantName}</strong><span>{d.city || "N/A"} &middot; {d.email || ""}</span></div>
                <span className="badge pending">pending</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Tickets */}
        <div className="classic-panel">
          <div className="classic-panel-header">Open Tickets</div>
          <div className="classic-panel-body sys-list">
            {openTickets.length === 0 && <p className="sys-empty">No open tickets</p>}
            {openTickets.map(t => (
              <div key={t.id} className="sys-row">
                <div><strong>{t.customerName}</strong><span>{t.subject || "No subject"}</span></div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={async () => { await apiRequest(`/api/admin/tickets/${t.id}/status`, { method: "PUT", body: JSON.stringify({ status: "resolved" }) }); load(); }} className="admin-btn sm success">Resolve</button>
                  <button onClick={async () => { if (window.confirm("Delete?")) { await apiRequest(`/api/admin/tickets/${t.id}`, { method: "DELETE" }); load(); } }} className="admin-btn sm danger">Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending FAQs */}
        <div className="classic-panel">
          <div className="classic-panel-header">Pending FAQs ({faqs.filter(f => f.status === "pending").length})</div>
          <div className="classic-panel-body sys-list">
            {faqs.filter(f => f.status === "pending").length === 0 && <p className="sys-empty">No pending FAQs</p>}
            {faqs.filter(f => f.status === "pending").slice(0, 5).map(f => (
              <div key={f.id} className="sys-row">
                <div><strong>{f.email}</strong><span>{f.question?.substring(0, 60)}{f.question?.length > 60 ? "..." : ""}</span></div>
                <span className="badge pending">pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
