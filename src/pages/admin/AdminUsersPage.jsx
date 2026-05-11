import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminUser } from "../../utils/adminApi";

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
      setAdmins(data || []);
    } catch (err) {
      if (err.status === 403) {
        setMessage("Only Super Admins can manage users.");
      } else if (err.status === 401) {
        clearAdminSession(); navigate("/admin/login");
      }
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function handleCreate(e) {
    e.preventDefault();
    setMessage("");
    if (!form.fullName || !form.email) {
      setMessage("Full name and email are required.");
      return;
    }
    try {
      await apiRequest("/api/admin/users", { method: "POST", body: JSON.stringify(form) });
      setMessage("Admin created successfully!");
      setForm({ fullName: "", email: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function toggleAdmin(id) {
    try {
      await apiRequest(`/api/admin/users/${id}/toggle`, { method: "PUT" });
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteAdmin(id) {
    if (!window.confirm("Delete this admin permanently?")) return;
    try {
      await apiRequest(`/api/admin/users/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  if (loading) return <div className="constant-padding align"><p className="sec-font-clr">Loading...</p></div>;

  const isSuper = admin?.role === "SUPER_ADMIN";

  if (!isSuper) {
    return (
      <div className="constant-padding constant-margin align">
        <div className="shadow constant-padding" style={{ maxWidth: "500px", margin: "2rem auto", background: "rgba(22,33,62,0.8)", borderRadius: "12px", border: "1px solid rgba(233,69,96,0.15)" }}>
          <i className="fa-solid fa-lock sec-font-clr2 title-fz"></i>
          <h3 className="standard-fz2 pri-font-clr header-margin">Access Denied</h3>
          <p className="sec-font-clr min-font">Only the Super Admin can manage admin users.</p>
          <Link to="/admin/dashboard" className="pri-bg btn-padding transition standard-weight" style={{ textDecoration: "none", display: "inline-block", marginTop: "1rem", borderRadius: "6px" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="constant-padding constant-margin" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div className="flex-main header-margin" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="min-font sec-font-clr" style={{ textTransform: "uppercase" }}>Super Admin</p>
          <h1 className="standard-fz2 pri-font-clr" style={{ margin: 0 }}>Admin Users</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="pri-bg btn-padding transition standard-weight"
          style={{ border: "none", cursor: "pointer", borderRadius: "6px", fontSize: "0.85rem" }}
        >
          <i className="fa-solid fa-plus"></i> {showForm ? "Cancel" : "Add Admin"}
        </button>
      </div>

      {message && (
        <p className="min-font header-margin" style={{ color: message.includes("success") || message.includes("created") ? "#4ade80" : "#e94560", padding: "0.6em 1em", borderRadius: "6px", background: "rgba(255,255,255,0.05)" }}>
          {message}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="shadow constant-padding header-margin" style={{ background: "rgba(22,33,62,0.8)", borderRadius: "12px", border: "1px solid rgba(233,69,96,0.15)", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <h3 className="standard-fz sec-font-clr2">Add New Admin</h3>
          <input type="text" placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
            style={{ padding: "0.7em 1em", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,52,96,0.3)", color: "#fff", fontSize: "0.9rem" }} />
          <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ padding: "0.7em 1em", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,52,96,0.3)", color: "#fff", fontSize: "0.9rem" }} />
          <p className="min-font" style={{ color: "#4ade80", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="fa-solid fa-circle-info"></i> A temporary password will be generated and emailed to the admin.
          </p>
          <button type="submit" className="pri-bg btn-padding transition standard-weight" style={{ border: "none", cursor: "pointer", borderRadius: "6px" }}>
            Create Admin
          </button>
        </form>
      )}

      <div className="cars-container header-margin" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {admins.map(a => (
          <div key={a.id} className="shadow constant-padding transition" style={{
            background: "linear-gradient(145deg, rgba(22,33,62,0.8), rgba(15,52,96,0.5))",
            border: `1px solid ${a.active ? "rgba(74,222,128,0.2)" : "rgba(255,0,0,0.2)"}`,
            borderRadius: "12px",
            opacity: a.active ? 1 : 0.6,
          }}>
            <div className="flex-main" style={{ marginBottom: "0.5rem" }}>
              <div className="flex" style={{ gap: "0.8rem", alignItems: "center" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: a.role === "SUPER_ADMIN" ? "linear-gradient(135deg, #e94560, #c0392b)" : "linear-gradient(135deg, #0f3460, #16213e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                }}>
                  {a.fullName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="standard-fz pri-font-clr standard-weight">{a.fullName}</p>
                  <p className="min-font sec-font-clr">{a.email}</p>
                </div>
              </div>
              <div>
                {a.role === "SUPER_ADMIN" ? (
                  <span style={{ padding: "0.15em 0.6em", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(233,69,96,0.2)", color: "#e94560" }}>
                    SUPER ADMIN
                  </span>
                ) : (
                  <span style={{ padding: "0.15em 0.6em", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 600, background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>
                    {a.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                )}
              </div>
            </div>

            <p className="min-font sec-font-clr" style={{ marginBottom: "0.8rem" }}>
              Created: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "N/A"}
              {a.createdBy ? ` by ${a.createdBy}` : ""}
            </p>

            {a.role !== "SUPER_ADMIN" && (
              <div className="flex" style={{ gap: "0.5rem" }}>
                <button
                  onClick={() => toggleAdmin(a.id)}
                  className="btn-padding transition standard-weight"
                  style={{
                    cursor: "pointer", border: "none", borderRadius: "6px", fontSize: "0.8rem",
                    background: a.active ? "rgba(245,158,11,0.2)" : "rgba(74,222,128,0.2)",
                    color: a.active ? "#f59e0b" : "#4ade80",
                  }}
                >
                  <i className={`fa-solid fa-${a.active ? "ban" : "check"}`}></i> {a.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => deleteAdmin(a.id)}
                  className="btn-padding transition standard-weight"
                  style={{ cursor: "pointer", border: "none", borderRadius: "6px", fontSize: "0.8rem", background: "rgba(233,69,96,0.15)", color: "#e94560" }}
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
