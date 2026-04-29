import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminToken } from "../utils/adminApi";

const quickActions = [
  "Add new vehicle to fleet",
  "Approve pending booking requests",
  "Review driver applications",
  "Update pricing and promotions",
  "Publish new blog campaign",
  "Monitor high-demand locations",
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [bookingOverview, setBookingOverview] = useState({ johannesburg: 0, capeTown: 0, durban: 0 });
  const [noteText, setNoteText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("cars");
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const imageFileRef = useRef(null);
  const [carForm, setCarForm] = useState({ name: "", category: "", dailyRate: "", status: "available", image: "", description: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);

  const loadDashboard = useCallback(async () => {
    window.scrollTo(0, 0);
    document.title = "MzansiRides - Admin Dashboard";
    if (!hasAdminSession()) { navigate("/admin/login", { replace: true }); return; }
    try {
      const [statsRes, noteRes, carsRes, bookingsRes, driversRes, ticketsRes] = await Promise.all([
        apiRequest("/api/admin/stats"), apiRequest("/api/admin/notes/latest"),
        apiRequest("/api/admin/cars"), apiRequest("/api/admin/bookings"),
        apiRequest("/api/admin/drivers"), apiRequest("/api/admin/tickets"),
      ]);
      setStats(statsRes.stats || []);
      setBookingOverview(statsRes.bookingOverview || { johannesburg: 0, capeTown: 0, durban: 0 });
      setNoteText(noteRes.note?.noteText || "");
      setCars(carsRes || []); setBookings(bookingsRes || []);
      setDrivers(driversRes || []); setTickets(ticketsRes || []);
      try { const sr = await apiRequest("/api/admin/subscribers/count"); setSubscriberCount(sr.count || 0); } catch {}
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        clearAdminSession(); navigate("/admin/login", { replace: true }); return;
      }
      setStatusMessage(err.message || "Failed to load dashboard data");
    } finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  function handleLogout() { clearAdminSession(); navigate("/admin/login", { replace: true }); }

  async function handleSaveNote() {
    setStatusMessage(""); if (!noteText.trim()) { setStatusMessage("Please type a note."); return; }
    setIsSavingNote(true);
    try { await apiRequest("/api/admin/notes", { method: "POST", body: JSON.stringify({ noteText }) }); setStatusMessage("Note saved."); }
    catch (e) { setStatusMessage(e.message || "Failed."); }
    finally { setIsSavingNote(false); }
  }

  async function refreshData() {
    try {
      const [statsRes, carsRes, bookingsRes, driversRes, ticketsRes] = await Promise.all([
        apiRequest("/api/admin/stats"), apiRequest("/api/admin/cars"),
        apiRequest("/api/admin/bookings"), apiRequest("/api/admin/drivers"), apiRequest("/api/admin/tickets"),
      ]);
      setStats(statsRes.stats || []); setBookingOverview(statsRes.bookingOverview || { johannesburg: 0, capeTown: 0, durban: 0 });
      setCars(carsRes || []); setBookings(bookingsRes || []); setDrivers(driversRes || []); setTickets(ticketsRes || []);
      try { const sr = await apiRequest("/api/admin/subscribers/count"); setSubscriberCount(sr.count || 0); } catch {}
    } catch (e) { setStatusMessage(e.message || "Refresh failed."); }
  }

  function openAddCar() {
    setEditingCar(null); setCarForm({ name: "", category: "", dailyRate: "", status: "available", image: "", description: "" });
    if (imageFileRef.current) imageFileRef.current.value = ""; setShowModal(true);
  }

  function openEditCar(car) {
    setEditingCar(car.id); setCarForm({ name: car.name, category: car.category, dailyRate: String(car.dailyRate), status: car.status, image: car.image || "", description: car.description || "" });
    if (imageFileRef.current) imageFileRef.current.value = ""; setShowModal(true);
  }

  async function saveCar() {
    setIsUploading(true);
    try {
      let imageUrl = carForm.image;
      const file = imageFileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData(); fd.append("file", file);
        const ur = await fetch("/api/admin/upload/car-image", { method: "POST", headers: { Authorization: `Bearer ${getAdminToken()}` }, body: fd });
        const ud = await ur.json(); if (!ur.ok) throw new Error(ud.message); imageUrl = ud.url;
      }
      const body = { ...carForm, dailyRate: parseFloat(carForm.dailyRate), image: imageUrl };
      if (editingCar) await apiRequest(`/api/admin/cars/${editingCar}`, { method: "PUT", body: JSON.stringify(body) });
      else await apiRequest("/api/admin/cars", { method: "POST", body: JSON.stringify(body) });
      setShowModal(false); refreshData();
    } catch (e) { setStatusMessage(e.message || "Failed to save car."); }
    finally { setIsUploading(false); }
  }

  async function deleteCar(id) { if (!window.confirm("Delete?")) return; try { await apiRequest(`/api/admin/cars/${id}`, { method: "DELETE" }); refreshData(); } catch (e) { setStatusMessage(e.message); } }
  async function updateBookingStatus(id, status) { try { await apiRequest(`/api/admin/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); refreshData(); } catch (e) { setStatusMessage(e.message); } }
  async function updateDriverStatus(id, status) { try { await apiRequest(`/api/admin/drivers/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); refreshData(); } catch (e) { setStatusMessage(e.message); } }
  async function updateTicketStatus(id, status) { try { await apiRequest(`/api/admin/tickets/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); refreshData(); } catch (e) { setStatusMessage(e.message); } }

  async function sendNewsletter() {
    if (!newsletterSubject.trim() || !newsletterMessage.trim()) { setStatusMessage("Subject and message required."); return; }
    setIsSendingNewsletter(true);
    try {
      const res = await apiRequest("/api/admin/subscribers/send", { method: "POST", body: JSON.stringify({ subject: newsletterSubject, message: newsletterMessage }) });
      setStatusMessage(`Sent to ${res.sent} of ${res.total} subscribers (${res.failed} failed).`);
      setNewsletterSubject(""); setNewsletterMessage("");
    } catch (e) { setStatusMessage(e.message); }
    finally { setIsSendingNewsletter(false); }
  }

  const tabs = [
    { key: "cars", label: "Fleet" }, { key: "bookings", label: "Bookings" },
    { key: "drivers", label: "Drivers" }, { key: "tickets", label: "Tickets" },
    { key: "newsletter", label: "Newsletter" },
  ];

  if (isLoading) {
    return (
      <div>
        <section className="admin-shell" style={{ textAlign: "center", paddingTop: "3rem" }}>
          <p className="min-font" style={{ color: "hsl(141, 40%, 75%)" }}>Loading dashboard...</p>
        </section>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">MzansiRides Admin Control Panel</p>
      </div>

      <section className="admin-shell">
        <div className="admin-dashboard-header">
          <div>
            <h2 className="admin-title sec-font3">Welcome to MzansiRides Admin</h2>
            <p className="admin-subtitle min-font">Oversee rentals, manage fleet operations, and keep customer service on track.</p>
          </div>
          <button onClick={handleLogout} className="admin-secondary-btn standard-weight transition">Logout</button>
        </div>

        <div className="admin-stats-grid header-margin2">
          {stats.map((stat) => (
            <article key={stat.id} className="admin-panel shadow" data-aos="fade-up">
              <p className="admin-stat-value sec-font2">{stat.value}</p>
              <p className="admin-stat-label min-font">{stat.label}</p>
            </article>
          ))}
        </div>

        <div className="admin-layout-grid">
          <article className="admin-panel shadow" data-aos="fade-up">
            <h3 className="admin-panel-title sec-font3">Booking Oversight</h3>
            <p className="admin-panel-text min-font">Active reservations across major cities.</p>
            <div className="admin-list">
              <p className="admin-list-item">Johannesburg: <strong>{bookingOverview.johannesburg}</strong> active</p>
              <p className="admin-list-item">Cape Town: <strong>{bookingOverview.capeTown}</strong> active</p>
              <p className="admin-list-item">Durban: <strong>{bookingOverview.durban}</strong> active</p>
            </div>
          </article>

          <article className="admin-panel shadow" data-aos="fade-up" data-aos-delay="100">
            <h3 className="admin-panel-title sec-font3">Operations Checklist</h3>
            <div className="admin-checklist">
              {quickActions.map((action) => (
                <label className="admin-check-item min-font" key={action}><input type="checkbox" /> {action}</label>
              ))}
            </div>
          </article>

          <article className="admin-panel shadow" data-aos="fade-up" data-aos-delay="200">
            <h3 className="admin-panel-title sec-font3">Admin Notes</h3>
            <p className="admin-panel-text min-font">Keep branch teams aligned with short daily updates.</p>
            <textarea className="admin-note-input" rows="5" placeholder="Type operational updates..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            {statusMessage && (
              <p className={statusMessage.includes("Failed") || statusMessage.includes("Please") ? "admin-error min-font" : "admin-success min-font"}>{statusMessage}</p>
            )}
            <button onClick={handleSaveNote} className="admin-primary-btn standard-weight transition" disabled={isSavingNote}>{isSavingNote ? "Saving..." : "Save Note"}</button>
          </article>

          <article className="admin-panel shadow" data-aos="fade-up" data-aos-delay="300">
            <h3 className="admin-panel-title sec-font3">Management</h3>
            <div className="tabs">
              {tabs.map((tab) => (
                <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>{tab.label}</button>
              ))}
            </div>

            <div className="admin-table-wrapper">
              {activeTab === "cars" && (
                <>
                  <button onClick={openAddCar} className="admin-primary-btn standard-weight transition" style={{ width: "auto", marginBottom: "0.8rem", padding: "0.5em 1em" }}>+ Add Vehicle</button>
                  <table className="admin-table"><thead><tr><th>Name</th><th>Category</th><th>Rate/day</th><th>Status</th><th></th></tr></thead>
                    <tbody>{cars.map((car) => (
                      <tr key={car.id}><td>{car.name}</td><td>{car.category}</td><td>R{parseInt(car.dailyRate)}</td>
                        <td><span className={`admin-status-badge ${car.status}`}>{car.status}</span></td>
                        <td className="actions"><button className="admin-sm-btn" onClick={() => openEditCar(car)}>Edit</button><button className="admin-sm-btn danger" onClick={() => deleteCar(car.id)}>Delete</button></td>
                      </tr>))}
                    </tbody></table>
                </>
              )}

              {activeTab === "bookings" && (
                <table className="admin-table"><thead><tr><th>Customer</th><th>City</th><th>Date</th><th>Status</th><th></th></tr></thead>
                  <tbody>{bookings.map((b) => (
                    <tr key={b.id}><td>{b.customerName}</td><td>{b.city}</td><td>{b.checkoutDate}</td>
                      <td><span className={`admin-status-badge ${b.status}`}>{b.status}</span></td>
                      <td className="actions">
                        {b.status === "pending" && <><button className="admin-sm-btn" onClick={() => updateBookingStatus(b.id, "active")}>Approve</button><button className="admin-sm-btn danger" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</button></>}
                        {b.status === "active" && <button className="admin-sm-btn" onClick={() => updateBookingStatus(b.id, "completed")}>Complete</button>}
                      </td>
                    </tr>))}
                  </tbody></table>
              )}

              {activeTab === "drivers" && (
                <table className="admin-table"><thead><tr><th>Name</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
                  <tbody>{drivers.map((d) => (
                    <tr key={d.id}><td>{d.applicantName}</td>
                      <td><span className={`admin-status-badge ${d.status}`}>{d.status}</span></td>
                      <td>{d.submittedAt ? new Date(d.submittedAt).toLocaleDateString() : "-"}</td>
                      <td className="actions">{d.status === "pending" && <><button className="admin-sm-btn" onClick={() => updateDriverStatus(d.id, "approved")}>Approve</button><button className="admin-sm-btn danger" onClick={() => updateDriverStatus(d.id, "rejected")}>Reject</button></>}</td>
                    </tr>))}
                  </tbody></table>
              )}

              {activeTab === "tickets" && (
                <table className="admin-table"><thead><tr><th>Customer</th><th>Status</th><th>Created</th><th></th></tr></thead>
                  <tbody>{tickets.map((t) => (
                    <tr key={t.id}><td>{t.customerName}</td>
                      <td><span className={`admin-status-badge ${t.status}`}>{t.status}</span></td>
                      <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="actions">{t.status === "open" && <button className="admin-sm-btn" onClick={() => updateTicketStatus(t.id, "resolved")}>Resolve</button>}</td>
                    </tr>))}
                  </tbody></table>
              )}

              {activeTab === "newsletter" && (
                <div>
                  <p className="admin-panel-text min-font">Active subscribers: <strong>{subscriberCount}</strong></p>
                  <div className="admin-modal-form-group">
                    <label>Subject</label>
                    <input className="admin-modal-input" value={newsletterSubject} onChange={(e) => setNewsletterSubject(e.target.value)} placeholder="e.g. New fleet arrivals this week" />
                  </div>
                  <div className="admin-modal-form-group">
                    <label>Message</label>
                    <textarea className="admin-note-input" rows="4" value={newsletterMessage} onChange={(e) => setNewsletterMessage(e.target.value)} placeholder="Write your newsletter content..." />
                  </div>
                  <button onClick={sendNewsletter} className="admin-primary-btn standard-weight transition" disabled={isSendingNewsletter}>
                    {isSendingNewsletter ? "Sending..." : `Send to ${subscriberCount} subscribers`}
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="sec-font3">{editingCar ? "Edit Vehicle" : "Add New Vehicle"}</h3>
            <div className="admin-modal-form-group"><label>Name</label><input className="admin-modal-input" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} placeholder="e.g. Mercedes C-Class" /></div>
            <div className="admin-modal-form-group"><label>Category</label><input className="admin-modal-input" value={carForm.category} onChange={(e) => setCarForm({ ...carForm, category: e.target.value })} placeholder="e.g. Luxury" /></div>
            <div className="admin-modal-form-group"><label>Daily Rate (ZAR)</label><input className="admin-modal-input" type="number" value={carForm.dailyRate} onChange={(e) => setCarForm({ ...carForm, dailyRate: e.target.value })} placeholder="e.g. 1200" /></div>
            <div className="admin-modal-form-group"><label>Status</label><select className="admin-modal-input" value={carForm.status} onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}><option value="available">Available</option><option value="booked">Booked</option><option value="maintenance">Maintenance</option></select></div>
            <div className="admin-modal-form-group">
              <label>Car Image</label>
              {carForm.image && <div style={{ marginBottom: "0.5rem" }}><img src={carForm.image} alt="Preview" style={{ maxWidth: "200px", maxHeight: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid hsla(141,55%,55%,0.3)" }} /></div>}
              <input ref={imageFileRef} className="admin-modal-input" type="file" accept="image/*" />
              <small className="min-font" style={{ color: "hsl(141,20%,60%)", display: "block", marginTop: "0.3rem" }}>Upload a car image. Leave empty to keep current.</small>
            </div>
            <div className="admin-modal-form-group"><label>Description</label><input className="admin-modal-input" value={carForm.description} onChange={(e) => setCarForm({ ...carForm, description: e.target.value })} placeholder="Brief description" /></div>
            <div className="admin-modal-actions">
              <button className="admin-primary-btn standard-weight transition" onClick={saveCar} disabled={isUploading}>{isUploading ? "Saving..." : (editingCar ? "Update Vehicle" : "Add Vehicle")}</button>
              <button className="admin-secondary-btn standard-weight transition" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
