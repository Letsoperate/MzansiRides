import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { apiRequest, clearAdminSession, hasAdminSession } from "../../utils/adminApi";

export default function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    document.title = "MzansiRides - Bookings";
    if (!hasAdminSession()) { navigate("/admin/login"); return; }
    try { setBookings(await apiRequest("/api/admin/bookings") || []); }
    catch (e) { if (e.status === 401) { clearAdminSession(); navigate("/admin/login"); } }
    finally { setIsLoading(false); }
  }, [navigate]);
  useEffect(() => { load(); }, [load]);

  async function approve(id, auto) {
    try { await apiRequest(`/api/admin/bookings/${id}/approve`, { method: "PUT", body: JSON.stringify({ auto }) }); load(); }
    catch (e) { setMsg(e.message); }
  }
  async function reject(id) {
    try { await apiRequest(`/api/admin/bookings/${id}/reject`, { method: "PUT" }); load(); }
    catch (e) { setMsg(e.message); }
  }
  async function updateStatus(id, status) {
    try { await apiRequest(`/api/admin/bookings/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); load(); }
    catch (e) { setMsg(e.message); }
  }
  async function del(id) { if (!confirm("Delete?")) return; try { await apiRequest(`/api/admin/bookings/${id}`, { method: "DELETE" }); load(); } catch (e) { setMsg(e.message); } }

  if (isLoading) return <div className="admin-loading">Loading bookings...</div>;

  const statusLabel = (s) => {
    switch (s) {
      case "pending_approval": return "Awaiting Approval";
      case "approved": return "Approved";
      default: return s;
    }
  };

  return (
    <div>
      <div className="classic-header">
        <div><p className="classic-breadcrumb">Admin &raquo; Bookings</p><h2 className="classic-title">Booking Management</h2></div>
      </div>
      {msg && <p className="admin-error">{msg}</p>}

      <div className="classic-panel">
        <div className="classic-panel-header">{bookings.length} bookings</div>
        <div className="admin-table-wrap">
          <table className="admin-table classic-table">
            <thead><tr><th>#</th><th>Customer</th><th>Email</th><th>Vehicle</th><th>City</th><th>Pickup</th><th>Payment</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="td-id">{b.id}</td>
                  <td className="td-name">{b.customerName}</td>
                  <td>{b.email || "-"}</td>
                  <td>{b.carName || "-"}</td>
                  <td>{b.city}</td>
                  <td>{b.pickupType === "DELIVERY" ? <><i className="fa-solid fa-location-dot" style={{ color: "#e94560" }}></i> Delivery</> : "Self Collect"}
                    {b.pickupAddress && <div style={{ fontSize: "0.7rem", color: "#666" }}>{b.pickupAddress}</div>}
                  </td>
                  <td>
                    <span className={`badge ${b.paymentStatus === "PAID" ? "completed" : "pending"}`}>
                      {b.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                    </span>
                    {b.paymentAmount > 0 && <div style={{ fontSize: "0.72rem", color: "#4ade80" }}>R{b.paymentAmount}</div>}
                  </td>
                  <td><span className={`badge ${b.status === "pending_approval" ? "pending" : b.status === "approved" ? "active" : b.status}`}>{statusLabel(b.status)}</span></td>
                  <td className="admin-actions">
                    {b.status === "pending_approval" && (
                      <><button onClick={() => approve(b.id, false)} className="admin-btn sm success">Approve</button>
                        <button onClick={() => approve(b.id, true)} className="admin-btn sm" title="Auto-approve without review">Auto</button>
                        <button onClick={() => reject(b.id)} className="admin-btn sm danger">Reject</button></>
                    )}
                    {b.status === "approved" && b.paymentStatus === "PAID" && (
                      <button onClick={() => updateStatus(b.id, "active")} className="admin-btn sm success">Activate</button>
                    )}
                    {b.status === "active" && (
                      <button onClick={() => updateStatus(b.id, "completed")} className="admin-btn sm">Complete</button>
                    )}
                    <button onClick={() => del(b.id)} className="admin-btn sm danger">Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {bookings.length === 0 && <p className="admin-empty">No bookings yet.</p>}
    </div>
  );
}
