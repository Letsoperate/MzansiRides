import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin.css";
import { apiRequest, clearAdminSession, hasAdminSession, getAdminToken } from "../../utils/adminApi";

export default function FleetPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const imageFileRef = useRef(null);
  const [carForm, setCarForm] = useState({ name: "", category: "", dailyRate: "", status: "available", image: "", description: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    document.title = "MzansiRides - Fleet";
    if (!hasAdminSession()) { navigate("/admin/login"); return; }
    try { setCars(await apiRequest("/api/admin/cars") || []); }
    catch (e) { if (e.status === 401) { clearAdminSession(); navigate("/admin/login"); } }
    finally { setIsLoading(false); }
  }, [navigate]);
  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditingCar(null); setCarForm({ name: "", category: "", dailyRate: "", status: "available", image: "", description: "" });
    if (imageFileRef.current) imageFileRef.current.value = ""; setShowModal(true);
  }
  function openEdit(car) {
    setEditingCar(car.id);
    setCarForm({ name: car.name, category: car.category, dailyRate: String(car.dailyRate), status: car.status, image: car.image || "", description: car.description || "" });
    if (imageFileRef.current) imageFileRef.current.value = ""; setShowModal(true);
  }

  async function save() {
    setIsUploading(true); setMsg("");
    try {
      let img = carForm.image;
      const file = imageFileRef.current?.files?.[0];
      if (file) {
        const fd = new FormData(); fd.append("file", file);
        const r = await fetch("/api/admin/upload/car-image", { method: "POST", headers: { Authorization: `Bearer ${getAdminToken()}` }, body: fd });
        const d = await r.json(); if (!r.ok) throw new Error(d.message); img = d.url;
      }
      const body = { ...carForm, dailyRate: parseFloat(carForm.dailyRate), image: img };
      if (editingCar) await apiRequest(`/api/admin/cars/${editingCar}`, { method: "PUT", body: JSON.stringify(body) });
      else await apiRequest("/api/admin/cars", { method: "POST", body: JSON.stringify(body) });
      setShowModal(false); load();
    } catch (e) { setMsg(e.message); }
    finally { setIsUploading(false); }
  }

  async function del(id) { if (!confirm("Delete this vehicle?")) return; try { await apiRequest(`/api/admin/cars/${id}`, { method: "DELETE" }); load(); } catch (e) { setMsg(e.message); } }

  if (isLoading) return <div className="admin-loading">Loading fleet...</div>;

  return (
    <div>
      <div className="classic-header">
        <div>
          <p className="classic-breadcrumb">Admin &raquo; Fleet</p>
          <h2 className="classic-title">Vehicle Management</h2>
        </div>
        <button onClick={openAdd} className="classic-btn primary">+ Add Vehicle</button>
      </div>
      {msg && <p className="admin-error">{msg}</p>}

      <div className="classic-panel">
        <div className="classic-panel-header">{cars.length} vehicles in fleet</div>
        <div className="admin-table-wrap">
          <table className="admin-table classic-table">
            <thead><tr><th></th><th>Vehicle</th><th>Category</th><th>Rate</th><th>Status</th><th>Description</th><th></th></tr></thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c.id}>
                  <td className="td-img">
                    <img src={c.image || ""} alt={c.name} className="admin-table-img" onError={(e) => { e.target.style.display = "none"; }} />
                  </td>
                  <td className="td-name">{c.name}</td>
                  <td><span className="classic-tag">{c.category}</span></td>
                  <td className="td-rate">R{parseInt(c.dailyRate)}</td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                  <td className="td-desc">{c.description || "-"}</td>
                  <td className="admin-actions">
                    <button onClick={() => openEdit(c)} className="admin-btn sm">Edit</button>
                    <button onClick={() => del(c.id)} className="admin-btn sm danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCar ? "Edit Vehicle" : "Add Vehicle"}</h3>
            <div className="admin-field"><label>Name</label><input value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} placeholder="e.g. Toyota Corolla" /></div>
            <div className="admin-field"><label>Category</label><select value={carForm.category} onChange={(e) => setCarForm({ ...carForm, category: e.target.value })}><option value="">Select...</option><option>Sedan</option><option>Hatchback</option><option>SUV</option><option>Luxury</option><option>Utility</option></select></div>
            <div className="admin-field"><label>Daily Rate (ZAR)</label><input type="number" value={carForm.dailyRate} onChange={(e) => setCarForm({ ...carForm, dailyRate: e.target.value })} /></div>
            <div className="admin-field"><label>Status</label><select value={carForm.status} onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}><option value="available">Available</option><option value="booked">Booked</option><option value="maintenance">Maintenance</option></select></div>
            <div className="admin-field"><label>Description</label><input value={carForm.description} onChange={(e) => setCarForm({ ...carForm, description: e.target.value })} placeholder="Brief description" /></div>
            <div className="admin-field">
              <label>Car Image</label>
              {carForm.image && <img src={carForm.image} alt="preview" className="admin-preview-img" />}
              <input ref={imageFileRef} type="file" accept="image/*" />
              <small>Upload a photo. Leave empty to keep current.</small>
            </div>
            <div className="admin-modal-btns">
              <button onClick={save} className="admin-btn primary" disabled={isUploading}>{isUploading ? "Saving..." : "Save"}</button>
              <button onClick={() => setShowModal(false)} className="admin-btn secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
