import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminUser } from "../../utils/adminApi";
import "../../styles/admin.css";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const admin = getAdminUser();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    document.title = "MzansiRides - Admin Users";
    if (!hasAdminSession()) { navigate("/admin/login", { replace: true }); return; }
    try {
      const data = await apiRequest("/api/admin/users");
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 403) setMessage("Only Super Admins can manage users.");
      else if (err.status === 401) { clearAdminSession(); navigate("/admin/login"); }
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
    if (!form.fullName || !form.email) { setMessage("Full name and email are required."); return; }
    try {
      await apiRequest("/api/admin/users", { method: "POST", body: JSON.stringify(form) });
      setMessage("Admin created successfully.");
      setForm({ fullName: "", email: "" });
      setShowForm(false);
      load();
    } catch (err) { setMessage(err.message); }
  }

  async function toggleAdmin(id) {
    try { await apiRequest(`/api/admin/users/${id}/toggle`, { method: "PUT" }); load(); }
    catch (err) { setMessage(err.message); }
  }

  async function deleteAdmin(id, name) {
    if (!window.confirm(`Delete ${name} permanently?`)) return;
    try { await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" }); load(); }
    catch (err) { setMessage(err.message); }
  }

  if (loading) return <div className="admin-loading">Loading admin users...</div>;

  const isSuper = admin?.role === "SUPER_ADMIN";

  if (!isSuper) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <i className="fa-solid fa-lock" style={{ fontSize: "3rem", color: "#e94560" }}></i>
        <h3 style={{ color: "#fff", margin: "1rem 0 0.5rem" }}>Access Denied</h3>
        <p style={{ color: "#94a3b8" }}>Only the Super Admin can manage admin users.</p>
        <Link to="/admin/dashboard" className="admin-btn primary" style={{ marginTop: "1rem", display: "inline-block" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="classic-header">
        <div>
          <p className="classic-breadcrumb">Admin &raquo; Users</p>
          <h2 className="classic-title">Admin User Management</h2>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="classic-btn primary">
          <i className="fa-solid fa-user-plus"></i> {showForm ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {message && <p className={message.includes("success") || message.includes("created") ? "admin-success" : "admin-error"}>{message}</p>}

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: "hsl(210, 8%, 13%)", border: "1px solid hsl(141, 15%, 18%)",
          borderRadius: "8px", padding: "1.2rem", marginBottom: "1rem",
          display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "flex-end"
        }}>
          <div className="admin-field" style={{ flex: 1, minWidth: "200px", margin: 0 }}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="admin-field" style={{ flex: 1, minWidth: "200px", margin: 0 }}>
            <label>Email Address</label>
            <input type="email" placeholder="Enter email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <button type="submit" className="admin-btn primary" style={{ height: "fit-content" }}>
            <i className="fa-solid fa-paper-plane"></i> Create &amp; Send Email
          </button>
        </form>
      )}

      {showForm && (
        <p style={{ color: "hsl(141, 25%, 55%)", fontSize: "0.82rem", margin: "-0.5rem 0 1rem" }}>
          <i className="fa-solid fa-circle-info"></i> A temporary password will be auto-generated and emailed to the new admin. They must change it on first login.
        </p>
      )}

      <div className="classic-panel">
        <div className="classic-panel-header">{admins.length} admin{admins.length !== 1 ? "s" : ""} registered</div>
        <div className="admin-table-wrap">
          <table className="admin-table classic-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "hsl(141, 10%, 35%)" }}>No admin users found.</td></tr>
              )}
              {admins.map(a => (
                <tr key={a.id} style={{ opacity: a.active ? 1 : 0.5 }}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{
                        width: "36px", height: "36px", borderRadius: "50%", display: "inline-flex",
                        alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem",
                        background: a.role === "SUPER_ADMIN" ? "linear-gradient(135deg, #e94560, #c0392b)" : "linear-gradient(135deg, hsl(141, 40%, 25%), hsl(141, 30%, 18%))",
                        color: "#fff", flexShrink: 0
                      }}>
                        {a.fullName?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                      <span style={{ fontWeight: 600, color: "#fff" }}>{a.fullName}</span>
                    </div>
                  </td>
                  <td style={{ color: "hsl(0, 0%, 80%)" }}>{a.email}</td>
                  <td>
                    <span className={`badge ${a.role === "SUPER_ADMIN" ? "completed" : "active"}`}>
                      {a.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${a.active ? "available" : "maintenance"}`}>
                      {a.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "hsl(210, 6%, 45%)" }}>
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-ZA") : ""}
                    {a.createdBy ? <span style={{ display: "block", fontSize: "0.72rem", color: "hsl(210, 6%, 35%)" }}>by {a.createdBy}</span> : ""}
                  </td>
                  <td>
                    <div className="admin-actions">
                      {a.role !== "SUPER_ADMIN" && (
                        <>
                          <button onClick={() => toggleAdmin(a.id)}
                            className={`admin-btn sm ${a.active ? "danger" : "success"}`}>
                            <i className={`fa-solid fa-${a.active ? "ban" : "check"}`}></i> {a.active ? "Deactivate" : "Activate"}
                          </button>
                          <button onClick={() => deleteAdmin(a.id, a.fullName)} className="admin-btn sm danger">
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </>
                      )}
                      {a.role === "SUPER_ADMIN" && (
                        <span style={{ fontSize: "0.78rem", color: "hsl(0, 55%, 55%)", fontWeight: 600 }}>
                          <i className="fa-solid fa-crown"></i> Protected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
