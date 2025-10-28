// src/pages/provider/ServicesView.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

function ServiceCard({ s, onEdit, onDelete }) {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{s.category} {s.subcategory ? `— ${s.subcategory}` : ""}</h3>
          <p className="text-sm text-gray-600 mt-1">{s.description || "No description."}</p>
          <div className="mt-2 text-sm text-gray-500">Price: {s.price != null ? `₹ ${s.price}` : "N/A"}</div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => onEdit(s)} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800">Edit</button>
          <button onClick={() => onDelete(s)} className="px-3 py-1 rounded bg-red-100 text-red-800">Delete</button>
        </div>
      </div>
    </div>
  );
}

function ServiceForm({ onCancel, onSave, initial }) {
  const [form, setForm] = useState(initial || {
    category: "",
    subcategory: "",
    description: "",
    price: "",
    location: ""
  });

  useEffect(() => setForm(initial || { category: "", subcategory: "", description: "", price: "", location: "" }), [initial]);

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (payload.price === "") delete payload.price;
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel}></div>
      <form onSubmit={submit} className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3">{initial ? "Edit Service" : "Add Service"}</h3>

        <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
        <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Subcategory (optional)" value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} />
        <textarea className="w-full border px-3 py-2 rounded mb-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
        <input className="w-full border px-3 py-2 rounded mb-2" placeholder="Price (number)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <input className="w-full border px-3 py-2 rounded mb-4" placeholder="Location (city/area)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
        </div>
      </form>
    </div>
  );
}

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // service being edited (object) or null
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/provider/services");
      setServices(res.data || []);
    } catch (e) {
      console.error("fetch services", e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await api.put(`/api/provider/services/${editing.id}`, payload);
      } else {
        await api.post("/api/provider/services", payload);
      }
      setShowForm(false); setEditing(null);
      fetch();
    } catch (e) {
      console.error("save service", e);
      alert("Save failed");
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/provider/services/${s.id}`);
      fetch();
    } catch (e) {
      console.error("delete service", e);
      alert("Delete failed");
    }
  };

  if (loading) return <div>Loading services…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-green-700">My Services</h2>
        <div>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Add Service</button>
        </div>
      </div>

      <div className="grid gap-3">
        {services.length === 0 && <div className="text-gray-500">You have not added any services yet.</div>}
        {services.map(s => <ServiceCard key={s.id} s={s} onEdit={(sv) => { setEditing(sv); setShowForm(true); }} onDelete={handleDelete} />)}
      </div>

      {showForm && <ServiceForm onCancel={() => { setEditing(null); setShowForm(false); }} onSave={handleSave} initial={editing} />}
    </div>
  );
}
