import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { apiRequest, clearAdminSession, hasAdminSession } from "../../utils/adminApi";

export default function SupportPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const [nlSubject, setNlSubject] = useState("");
  const [nlMessage, setNlMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("tickets");

  const load = useCallback(async () => {
    document.title = "MzansiRides - Support";
    if (!hasAdminSession()) { navigate("/admin/login"); return; }
    try {
      const [t, s] = await Promise.all([apiRequest("/api/admin/tickets"), apiRequest("/api/admin/subscribers/count")]);
      setTickets(t || []); setSubCount(s.count || 0);
    } catch (e) { if (e.status === 401) { clearAdminSession(); navigate("/admin/login"); return; } }
    finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function resolveTicket(id) {
    try { await apiRequest(`/api/admin/tickets/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "resolved" }) }); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function sendNewsletter() {
    if (!nlSubject.trim() || !nlMessage.trim()) { setMsg("Subject and message required."); return; }
    setIsSending(true); setMsg("");
    try {
      const r = await apiRequest("/api/admin/subscribers/send", { method: "POST", body: JSON.stringify({ subject: nlSubject, message: nlMessage }) });
      setMsg(`Sent to ${r.sent} of ${r.total} subscribers.`); setNlSubject(""); setNlMessage("");
    } catch (e) { setMsg(e.message); }
    finally { setIsSending(false); }
  }

  if (isLoading) return <div className="admin-loading">Loading support...</div>;

  return (
    <div>
      <h2 className="admin-heading">Support & Newsletter</h2>

      <div className="admin-inline-tabs">
        <button className={`admin-inline-tab ${tab === "tickets" ? "active" : ""}`} onClick={() => setTab("tickets")}>Support Tickets</button>
        <button className={`admin-inline-tab ${tab === "newsletter" ? "active" : ""}`} onClick={() => setTab("newsletter")}>Newsletter ({subCount})</button>
      </div>

      {msg && <p className={msg.includes("failed") ? "admin-error" : "admin-success"}>{msg}</p>}

      {tab === "tickets" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Subject</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td>{t.customerName}</td>
                  <td>{t.subject || "-"}</td>
                  <td>{t.email || "-"}</td>
                  <td><span className={`badge ${t.status}`}>{t.status}</span></td>
                  <td className="admin-actions">
                    {t.status === "open" && <button onClick={() => resolveTicket(t.id)} className="admin-btn sm success">Resolve</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "newsletter" && (
        <div className="admin-card2">
          <h3>Send Newsletter</h3>
          <p className="admin-muted">Active subscribers: <strong>{subCount}</strong></p>
          <div className="admin-field"><label>Subject</label><input value={nlSubject} onChange={(e) => setNlSubject(e.target.value)} placeholder="e.g. Weekend Special" /></div>
          <div className="admin-field"><label>Message</label><textarea rows="5" value={nlMessage} onChange={(e) => setNlMessage(e.target.value)} placeholder="Write your newsletter..." /></div>
          <button onClick={sendNewsletter} className="admin-btn primary" disabled={isSending}>{isSending ? "Sending..." : `Send to ${subCount} Subscribers`}</button>
        </div>
      )}
    </div>
  );
}
