import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminToken } from "../../utils/adminApi";

export default function DriversPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(null);

  const load = useCallback(async () => {
    document.title = "MzansiRides - Drivers";
    if (!hasAdminSession()) { navigate("/admin/login"); return; }
    try { setDrivers(await apiRequest("/api/admin/drivers") || []); }
    catch (e) { if (e.status === 401) { clearAdminSession(); navigate("/admin/login"); } }
    finally { setIsLoading(false); }
  }, [navigate]);
  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    try { await apiRequest(`/api/admin/drivers/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) }); load(); }
    catch (e) { setMsg(e.message); }
  }

  async function uploadDoc(driverId, field) {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".pdf,.jpg,.jpeg,.png,image/*";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      setUploading(driverId + "-" + field);
      try {
        const fd = new FormData(); fd.append("file", file);
        const r = await fetch("/api/admin/upload/driver-doc", { method: "POST", headers: { Authorization: `Bearer ${getAdminToken()}` }, body: fd });
        const d = await r.json(); if (!r.ok) throw new Error(d.message);
        await apiRequest(`/api/admin/drivers/${driverId}`, { method: "PUT", body: JSON.stringify({ [field]: d.url }) });
        load();
      } catch (e) { setMsg(e.message); }
      finally { setUploading(null); }
    };
    input.click();
  }

  if (isLoading) return <div className="admin-loading">Loading drivers...</div>;

  return (
    <div>
      <div className="classic-header">
        <div>
          <p className="classic-breadcrumb">Admin &raquo; Drivers</p>
          <h2 className="classic-title">Driver Applications</h2>
        </div>
      </div>
      {msg && <p className="admin-error">{msg}</p>}

      <div className="classic-panel">
        <div className="classic-panel-header">{drivers.length} applicants</div>
        <div className="admin-table-wrap">
          <table className="admin-table classic-table">
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Applied</th><th>License</th><th>Passport</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td className="td-id">{d.id}</td>
                  <td className="td-name">{d.applicantName}</td>
                  <td>{d.email || "-"}</td>
                  <td>{d.phone || "-"}</td>
                  <td>{d.city || "-"}</td>
                  <td className="td-date">{d.submittedAt ? new Date(d.submittedAt).toLocaleDateString() : "-"}</td>
                  <td>
                    {d.licenseDoc
                      ? <a href={d.licenseDoc} target="_blank" rel="noreferrer" className="doc-link"><i className="fa-solid fa-file"></i> View</a>
                      : <button onClick={() => uploadDoc(d.id, "licenseDoc")} className="admin-btn sm" disabled={uploading === d.id + "-licenseDoc"}>Upload</button>}
                  </td>
                  <td>
                    {d.passportDoc
                      ? <a href={d.passportDoc} target="_blank" rel="noreferrer" className="doc-link"><i className="fa-solid fa-file"></i> View</a>
                      : <button onClick={() => uploadDoc(d.id, "passportDoc")} className="admin-btn sm" disabled={uploading === d.id + "-passportDoc"}>Upload</button>}
                  </td>
                  <td><span className={`badge ${d.status}`}>{d.status}</span></td>
                  <td className="admin-actions">
                    {d.status === "pending" && <><button onClick={() => updateStatus(d.id, "approved")} className="admin-btn sm success">Approve</button><button onClick={() => updateStatus(d.id, "rejected")} className="admin-btn sm danger">Reject</button></>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {drivers.length === 0 && <p className="admin-empty">No applications yet.</p>}
    </div>
  );
}
