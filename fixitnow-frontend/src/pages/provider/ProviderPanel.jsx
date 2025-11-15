
// src/pages/provider/ProviderPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ChatWindow from "../../components/ChatWindow";
import ServiceChatView from "../../components/ServiceChatView";

const TABS = ["Profile", "Services", "Offer Service", "Bookings", "Reviews", "Service Chats"];

// helper: reverse geocode using OpenStreetMap Nominatim
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat
    )}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error("Reverse geocoding failed");
    const data = await res.json();
    return (
      data.display_name ||
      [
        data.address?.neighbourhood,
        data.address?.suburb,
        data.address?.city,
        data.address?.state,
      ]
        .filter(Boolean)
        .join(", ") ||
      ""
    );
  } catch (e) {
    return "";
  }
}

function Sidebar({ active, setActive, unreadCount }) {
  const icons = {
    "Profile": "👤",
    "Services": "🛠️",
    "Offer Service": "➕",
    "Bookings": "📅",
    "Reviews": "⭐",
    "Service Chats": "💬"
  };

  return (
    <aside className="w-full md:w-72 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-xl p-6 border border-slate-200 sticky top-6 h-fit">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Provider Panel
        </h3>
        <p className="text-sm text-slate-600">Manage your services & bookings</p>
      </div>
      <nav className="space-y-2" aria-label="Provider panel navigation">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`block w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 relative group ${
              active === tab
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/50 transform scale-105"
                : "text-slate-700 hover:bg-white hover:shadow-md hover:scale-102"
            }`}
            aria-pressed={active === tab}
            aria-label={`Open ${tab}`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3 font-medium">
                <span className="text-xl">{icons[tab]}</span>
                <span>{tab}</span>
              </span>
              {tab === "Service Chats" && unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse shadow-lg">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </aside>
  );
}

// Profile pane
function ProfilePane() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categories: [], description: "", location: "" });
  const [verificationStatus, setVerificationStatus] = useState("PENDING");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/provider/profile");
        if (res?.data && Object.keys(res.data).length) {
          setForm({
            categories: Array.isArray(res.data.categories) ? res.data.categories : [],
            description: res.data.description || "",
            location: res.data.location || "",
          });
          setVerificationStatus(res.data.verificationStatus || "PENDING");
          setVerificationNotes(res.data.verificationNotes || "");
          setDocumentUrl(res.data.verificationDocumentUrl || "");
        }
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (cat) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter((c) => c !== cat) : [...f.categories, cat],
    }));
  };

  const save = async () => {
    try {
      await api.post("/api/provider/profile", {
        categories: form.categories,
        description: form.description,
        location: form.location,
        verificationDocumentUrl: documentUrl,
      });
      setMsg("Profile saved ✅");
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setMsg("Save failed ❌");
    }
  };

  const fetchMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const human = await reverseGeocode(latitude, longitude);
        setForm((f) => ({ ...f, location: human || `${latitude}, ${longitude}` }));
        setLocLoading(false);
      },
      (err) => {
        alert("Unable to retrieve your location");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-600 font-medium">Loading profile…</div>
        </div>
      </div>
    );
  }

  const ALL = ["Electrician", "Plumber", "Carpenter", "Cleaning"];

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 space-y-6 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">👤</span>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-800">Manage Profile</h4>
          <p className="text-sm text-slate-600">Update your professional information</p>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
          <span className="text-lg">🏷️</span>
          <span>Service Categories</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL.map((c) => {
            const checked = form.categories.includes(c);
            return (
              <label
                key={c}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  checked 
                    ? "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 shadow-md shadow-indigo-100 scale-105" 
                    : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 rounded-lg border-slate-300"
                  aria-checked={checked}
                  aria-label={`Toggle ${c}`}
                />
                <span className="text-sm font-medium text-slate-800">{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
          <span className="text-lg">📝</span>
          <span>Description</span>
        </div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-2 border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-200 bg-white"
          rows={4}
          placeholder="Describe your expertise and services..."
          aria-label="Profile description"
        />
      </div>

      <div>
        <div className="text-sm font-semibold mb-2 text-slate-700 flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span>Location</span>
        </div>
        <div className="flex gap-3">
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="flex-1 border-2 border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-200 bg-white"
            placeholder="City / area"
            aria-label="Location"
          />
          <button
            onClick={fetchMyLocation}
            disabled={locLoading}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 transition-all duration-300 shadow-lg shadow-blue-500/30 font-medium"
            aria-label="Use my current location"
          >
            {locLoading ? "Locating…" : "📍 Use my location"}
          </button>
        </div>
      </div>

      {/* Verification Status */}
      <div className="border-t-2 border-slate-200 pt-6">
        <div className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span>Verification Status</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-5 py-2.5 rounded-full text-sm font-bold shadow-lg ${
            verificationStatus === "APPROVED" 
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30" :
            verificationStatus === "REJECTED" 
              ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/30" :
              "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-amber-500/30"
          }`}>
            {verificationStatus === "APPROVED" ? "✓ Verified Provider" :
             verificationStatus === "REJECTED" ? "✗ Verification Rejected" :
             "⏳ Verification Pending"}
          </span>
        </div>
        
        {verificationNotes && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl mb-4 border-2 border-blue-200">
            <div className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-2">
              <span>📋</span>
              <span>Admin Notes:</span>
            </div>
            <div className="text-sm text-slate-800">{verificationNotes}</div>
          </div>
        )}

        <div>
          <div className="text-sm font-semibold mb-2 text-slate-700">Verification Document URL</div>
          <input
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            className="w-full border-2 border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all duration-200 bg-white"
            placeholder="Enter document URL (e.g., Google Drive link, Dropbox link)"
            aria-label="Verification document URL"
          />
          <div className="text-xs text-slate-500 mt-2 flex items-start gap-2">
            <span>💡</span>
            <span>Upload your verification documents (ID, certifications) to a cloud service and paste the link here</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          onClick={save}
          className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
        >
          💾 Save Profile
        </button>

        <button
          onClick={() => setForm({ categories: [], description: "", location: "" })}
          className="px-6 py-4 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 hover:shadow-lg transition-all duration-300 font-medium text-slate-700"
        >
          🔄 Reset
        </button>

        <div className="ml-auto text-sm" role="status" aria-live="polite">
          <span className={`font-bold ${msg.startsWith("Profile saved") ? "text-emerald-600" : "text-rose-600"}`}>{msg}</span>
        </div>
      </div>
    </div>
  );
}

// Services pane
function ServicesPane() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/provider/services");
      setServices(res.data || []);
    } catch (e) {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/provider/services/${id}`);
      fetch();
    } catch (e) {
      alert("Delete failed");
    }
  };

  const openEdit = (s) => setEditing({ ...s });
  const closeEdit = () => setEditing(null);

  const saveEdit = async () => {
    try {
      await api.put(`/api/provider/services/${editing.id}`, editing);
      closeEdit();
      fetch();
    } catch (e) {
      alert("Update failed");
    }
  };

  const CreateForm = ({ onClose }) => {
    const [form, setForm] = useState({ category: "", subcategory: "", description: "", price: "", availability: [], location: "" });
    const [locLoading, setLocLoading] = useState(false);

    const submit = async () => {
      try {
        await api.post("/api/provider/services", {
          category: form.category,
          subcategory: form.subcategory,
          description: form.description,
          price: form.price ? Number(form.price) : null,
          availability: form.availability,
          location: form.location,
        });
        onClose();
        fetch();
      } catch (e) {
        alert("Create failed");
      }
    };

    const fetchMyLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }
      setLocLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const human = await reverseGeocode(latitude, longitude);
          setForm((f) => ({ ...f, location: human || `${latitude}, ${longitude}` }));
          setLocLoading(false);
        },
        (err) => {
          alert("Unable to retrieve your location");
          setLocLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    return (
      <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-xl border-2 border-slate-200">
        <h5 className="font-bold text-xl mb-5 text-slate-800 flex items-center gap-2">
          <span className="text-2xl">➕</span>
          <span>Create New Service</span>
        </h5>
        <input
          className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
          placeholder="Subcategory"
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
        />
        <textarea
          className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
        <input
          className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <div className="flex gap-3 mb-3">
          <input
            className="flex-1 border-2 border-slate-200 px-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <button
            onClick={fetchMyLocation}
            disabled={locLoading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/30 font-medium"
            aria-label="Use my location"
          >
            {locLoading ? "Locating…" : "📍"}
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={submit} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all">✓ Create</button>
          <button onClick={onClose} className="px-6 py-3 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 font-medium">Cancel</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-600 font-medium">Loading services…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🛠️</span>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-800">My Services</h4>
            <p className="text-sm text-slate-600">Manage your service offerings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreating(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all"
            aria-label="Create new service"
          >
            ➕ New Service
          </button>
          <button onClick={fetch} className="px-5 py-3 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 hover:shadow-lg transition-all font-medium">🔄</button>
        </div>
      </div>

      {creating && <div className="mb-6"><CreateForm onClose={() => setCreating(false)} /></div>}

      {services.length === 0 ? (
        <div className="text-slate-500 text-center py-12 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-lg font-medium">No services yet</p>
          <p className="text-sm">Create one to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((s) => (
            <div key={s.id} className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex justify-between items-start border border-slate-200">
              <div>
                <div className="font-bold text-lg text-slate-800 mb-2">{s.category} {s.subcategory ? `— ${s.subcategory}` : ""}</div>
                <div className="text-sm text-slate-600 mb-3">{s.description}</div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <span>💰</span>
                    <span className="font-semibold">₹{s.price ?? "N/A"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{s.location ?? "N/A"}</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => openEdit(s)} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all">✏️ Edit</button>
                <button onClick={() => remove(s.id)} className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-5 py-2 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white p-8 rounded-3xl shadow-2xl border border-slate-200">
            <h4 className="text-xl font-bold mb-5 text-slate-800 flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              <span>Edit Service</span>
            </h4>
            <input className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none" placeholder="Category" value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} />
            <input className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none" placeholder="Subcategory" value={editing.subcategory || ""} onChange={e => setEditing({ ...editing, subcategory: e.target.value })} />
            <textarea className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none" placeholder="Description" rows={3} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            <input className="w-full border-2 border-slate-200 px-4 py-3 mb-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none" placeholder="Price" value={editing.price ?? ""} onChange={e => setEditing({ ...editing, price: e.target.value })} />
            <div className="flex gap-3 mb-5">
              <input className="w-full border-2 border-slate-200 px-4 py-3 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none" placeholder="Location" value={editing.location ?? ""} onChange={e => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button onClick={saveEdit} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all">✓ Save</button>
              <button onClick={closeEdit} className="px-6 py-3 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Offer Service pane
function OfferServicePane() {
  const [form, setForm] = useState({ category: "", subcategory: "", description: "", price: "", location: "" });
  const [msg, setMsg] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const submit = async () => {
    try {
      await api.post("/api/provider/services", {
        category: form.category,
        subcategory: form.subcategory,
        description: form.description,
        price: form.price ? Number(form.price) : null,
        location: form.location,
      });
      setMsg("Service created ✅");
      setForm({ category: "", subcategory: "", description: "", price: "", location: "" });
      setTimeout(() => setMsg(""), 2500);
    } catch (e) {
      setMsg("Create failed ❌");
    }
  };

  const fetchMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const human = await reverseGeocode(latitude, longitude);
        setForm((f) => ({ ...f, location: human || `${latitude}, ${longitude}` }));
        setLocLoading(false);
      },
      (err) => {
        alert("Unable to retrieve your location");
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 border border-slate-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
          <span className="text-2xl">➕</span>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-800">Offer a Service</h4>
          <p className="text-sm text-slate-600">Create a new service offering</p>
        </div>
      </div>
      <input className="w-full border-2 border-slate-200 px-5 py-4 mb-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input className="w-full border-2 border-slate-200 px-5 py-4 mb-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white" placeholder="Subcategory" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
      <textarea className="w-full border-2 border-slate-200 px-5 py-4 mb-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="w-full border-2 border-slate-200 px-5 py-4 mb-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <div className="flex gap-3 mb-5">
        <input className="flex-1 border-2 border-slate-200 px-5 py-4 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none bg-white" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <button
          onClick={fetchMyLocation}
          disabled={locLoading}
          className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/30 font-medium"
        >
          {locLoading ? "Locating…" : "📍 Use my location"}
        </button>
      </div>
      <div className="flex gap-3 items-center">
        <button onClick={submit} className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all">✓ Create Service</button>
        {msg && <div className="text-sm font-bold text-emerald-600">{msg}</div>}
      </div>
    </div>
  );
}

// Bookings pane
function BookingsPane({ setChatCustomer }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({});

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/provider/bookings");
      const bookingsData = res.data || [];
      setBookings(bookingsData);

      const details = {};
      for (const booking of bookingsData) {
        try {
          const customerRes = await api.get(`/api/users/${booking.customerId}`);
          details[booking.customerId] = customerRes.data;
        } catch (err) {
          console.error(`Failed to fetch customer ${booking.customerId}`, err);
        }
      }
      setCustomerDetails(details);
    } catch (e) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const [updatingId, setUpdatingId] = useState(null);

  const update = async (id, action) => {
    try {
      setUpdatingId(id);
      const response = await api.post(`/api/provider/bookings/${id}/${action}`);
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id 
            ? { ...booking, status: response.data.status }
            : booking
        )
      );
    } catch (e) {
      console.error(e);
      await fetch();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-600 font-medium">Loading bookings…</div>
        </div>
      </div>
    );
  }
  
  if (bookings.length === 0) {
    return (
      <div className="text-slate-500 text-center py-12 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
        <span className="text-6xl mb-4 block">📅</span>
        <p className="text-lg font-medium">No booking requests</p>
        <p className="text-sm">New bookings will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-2xl">📅</span>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-slate-800">Booking Requests</h4>
          <p className="text-sm text-slate-600">Manage your customer bookings</p>
        </div>
      </div>

      {bookings.map((b) => {
        const customer = customerDetails[b.customerId];
        return (
          <div key={b.id} className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-bold text-lg text-slate-800 mb-1">Booking #{b.id} — Service {b.serviceId || "—"}</div>
                <div className="text-sm text-slate-600">
                  Customer: <span className="font-semibold text-indigo-600">{customer?.name || `#${b.customerId}`}</span>
                  <span className="mx-2">·</span>
                  Created: <span className="text-slate-500">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}</span>
                </div>
                {customer?.email && <div className="text-sm text-slate-500">✉️ {customer.email}</div>}
              </div>
              <div className="text-sm">
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                  b.status === "PENDING" ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-lg shadow-amber-400/30" :
                  b.status === "CONFIRMED" ? "bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg shadow-emerald-400/30" :
                  b.status === "COMPLETED" ? "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg shadow-blue-400/30" :
                  b.status === "REJECTED" ? "bg-gradient-to-r from-rose-400 to-red-400 text-white shadow-lg shadow-rose-400/30" :
                  "bg-gradient-to-r from-slate-400 to-gray-400 text-white shadow-lg shadow-slate-400/30"
                }`}>{b.status}</span>
              </div>
            </div>

            <p className="mt-3 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">{b.notes || "No notes."}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span>{customer?.location || "Location not provided"}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🕒</span>
                <span>{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"} {b.timeSlot || ""}</span>
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setChatCustomer({ id: b.customerId, name: customer?.name || `Customer #${b.customerId}` })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold shadow-lg shadow-purple-500/30"
              >
                💬 Chat
              </button>

              {b.status === "PENDING" && (
                <>
                  <button 
                    onClick={() => update(b.id, "accept")} 
                    disabled={updatingId === b.id}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-60 transition-all font-bold shadow-lg shadow-emerald-500/30"
                  >
                    {updatingId === b.id ? "Updating…" : "✓ Accept"}
                  </button>
                  <button 
                    onClick={() => update(b.id, "reject")} 
                    disabled={updatingId === b.id}
                    className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-5 py-2.5 rounded-xl hover:from-rose-600 hover:to-red-600 disabled:opacity-60 transition-all font-bold shadow-lg shadow-rose-500/30"
                  >
                    {updatingId === b.id ? "Updating…" : "✗ Reject"}
                  </button>
                </>
              )}

              {b.status === "CONFIRMED" && (
                <>
                  <div className="text-emerald-700 font-bold bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-2.5 rounded-xl border-2 border-emerald-300 text-sm shadow-lg shadow-emerald-500/20">
                    ✓ Accepted
                  </div>
                  <button 
                    onClick={() => update(b.id, "complete")} 
                    disabled={updatingId === b.id}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 transition-all font-bold shadow-lg shadow-indigo-500/30"
                  >
                    {updatingId === b.id ? "Updating…" : "✓ Mark Complete"}
                  </button>
                </>
              )}

              {b.status === "REJECTED" && (
                <div className="text-rose-700 font-bold bg-gradient-to-r from-rose-50 to-red-50 px-5 py-2.5 rounded-xl border-2 border-rose-300 text-sm shadow-lg shadow-rose-500/20">
                  ✗ Rejected
                </div>
              )}

              {b.status === "COMPLETED" && (
                <div className="text-blue-700 font-bold bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-2.5 rounded-xl border-2 border-blue-300 text-sm shadow-lg shadow-blue-500/20">
                  ✓ Completed
                </div>
              )}

              {b.status === "CANCELLED" && (
                <div className="text-slate-700 font-bold bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-2.5 rounded-xl border-2 border-slate-300 text-sm shadow-lg shadow-slate-500/20">
                  Cancelled by Customer
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Reviews pane
function ReviewsPane() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const userRes = await api.get("/api/auth/me");
        const providerId = userRes.data.id;

        const res = await api.get(`/api/reviews/provider/${providerId}`);
        setReviews(res.data.reviews || []);
        setAvgRating(res.data.avgRating || 0);
      } catch (e) {
        console.error("Failed to fetch reviews", e);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-600 font-medium">Loading reviews…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 mb-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg">
            <span className="text-2xl">⭐</span>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-800">My Reviews</h4>
            <p className="text-sm text-slate-600">See what customers are saying</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-5xl font-black bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">{avgRating.toFixed(1)}</div>
          <div>
            <div className="flex mb-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(avgRating) ? "text-amber-400 text-2xl" : "text-slate-300 text-2xl"}>★</span>
              ))}
            </div>
            <div className="text-slate-600 font-medium">{reviews.length} total reviews</div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-slate-500 text-center py-12 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
          <span className="text-6xl mb-4 block">📝</span>
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm">Complete bookings to receive reviews</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < r.rating ? "text-amber-400 text-2xl" : "text-slate-300 text-2xl"}>★</span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">Customer #{r.customerId}</span>
                  </div>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">{r.comment || "No comment"}</p>
                </div>
                <div className="text-sm text-slate-500 ml-4">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main component
export default function ProviderPanel() {
  const [active, setActive] = useState("Profile");
  const [chatCustomer, setChatCustomer] = useState(null);
  const [totalUnreadChats, setTotalUnreadChats] = useState(0);

  useEffect(() => {
    const fetchTotalUnreadChats = async () => {
      try {
        const res = await api.get("/api/disputes/service-chats/unread-total");
        setTotalUnreadChats(res.data.totalUnread || 0);
      } catch (e) {
        console.error("Failed to fetch unread count", e);
      }
    };

    fetchTotalUnreadChats();
    const interval = setInterval(fetchTotalUnreadChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          {/* Sidebar - Fixed width and sticky positioning */}
          <div className="flex-shrink-0">
            <Sidebar active={active} setActive={setActive} unreadCount={totalUnreadChats} />
          </div>
          
          {/* Main Content - Takes remaining space with proper margin */}
          <div className="flex-1 min-w-0">
            {active === "Profile" && <ProfilePane />}
            {active === "Services" && <ServicesPane />}
            {active === "Offer Service" && <OfferServicePane />}
            {active === "Bookings" && <BookingsPane setChatCustomer={setChatCustomer} />}
            {active === "Reviews" && <ReviewsPane />}
            {active === "Service Chats" && <ServiceChatView />}
          </div>
        </div>
      </div>

      {chatCustomer && (
        <ChatWindow receiverId={chatCustomer.id} receiverName={chatCustomer.name} onClose={() => setChatCustomer(null)} />
      )}
    </div>
  );
}