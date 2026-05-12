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
  const [faqs, setFaqs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("tickets");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [answeringId, setAnsweringId] = useState(null);

  const load = useCallback(async () => {
    document.title = "MzansiRides - Support";
    if (!hasAdminSession()) { navigate("/admin/login"); return; }
    try {
      const [t, s, f] = await Promise.all([
        apiRequest("/api/admin/tickets"),
        apiRequest("/api/admin/subscribers/count"),
        apiRequest("/api/admin/faqs"),
      ]);
      setTickets(t || []); setSubCount(s.count || 0); setFaqs(f || []);
    } catch (e) { if (e.status === 401) { clearAdminSession(); navigate("/admin/login"); return; } }
    finally { setIsLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function resolveTicket(id) {
    try { await apiRequest(`/api/admin/tickets/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "resolved" }) }); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function deleteTicket(id) {
    if (!window.confirm("Delete this ticket?")) return;
    try { await apiRequest(`/api/admin/tickets/${id}`, { method: "DELETE" }); setMsg("Ticket deleted."); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function reopenTicket(id) {
    try { await apiRequest(`/api/admin/tickets/${id}/status`, { method: "PUT", body: JSON.stringify({ status: "open" }) }); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function answerFaq(id) {
    if (!faqAnswer.trim()) { setMsg("Answer required."); return; }
    try { await apiRequest(`/api/admin/faqs/${id}/answer`, { method: "PUT", body: JSON.stringify({ answer: faqAnswer }) }); setFaqAnswer(""); setAnsweringId(null); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function deleteFaq(id) {
    if (!window.confirm("Delete this FAQ question?")) return;
    try { await apiRequest(`/api/admin/faqs/${id}`, { method: "DELETE" }); load(); }
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
        <button className={`admin-inline-tab ${tab === "faqs" ? "active" : ""}`} onClick={() => setTab("faqs")}>FAQs ({faqs.filter(f => f.status === "pending").length})</button>
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
                    {t.status === "resolved" && <button onClick={() => reopenTicket(t.id)} className="admin-btn sm">Reopen</button>}
                    <button onClick={() => deleteTicket(t.id)} className="admin-btn sm danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "faqs" && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Email</th><th>Question</th><th>Answer</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {faqs.map((f) => (
                <tr key={f.id}>
                  <td>#{f.id}</td>
                  <td>{f.email}</td>
                  <td>{f.question}</td>
                  <td>{f.answer || "-"}</td>
                  <td><span className={`badge ${f.status}`}>{f.status}</span></td>
                  <td className="admin-actions">
                    {f.status === "pending" && (
                      answeringId === f.id ? (
                        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                          <input value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} placeholder="Type answer..." style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #444", background: "#1a1a2e", color: "#e0e0e0", fontSize: "12px", width: "140px" }} />
                          <button onClick={() => answerFaq(f.id)} className="admin-btn sm success">Save</button>
                          <button onClick={() => { setAnsweringId(null); setFaqAnswer(""); }} className="admin-btn sm">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setAnsweringId(f.id); setFaqAnswer(""); }} className="admin-btn sm">Answer</button>
                      )
                    )}
                    <button onClick={() => deleteFaq(f.id)} className="admin-btn sm danger">Delete</button>
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>No FAQ questions yet.</td></tr>}
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
