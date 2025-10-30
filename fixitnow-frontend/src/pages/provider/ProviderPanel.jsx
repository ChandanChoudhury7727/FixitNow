
// src/pages/provider/ProviderPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ChatWindow from "../../components/ChatWindow";

const TABS = ["Profile", "Services", "Offer Service", "Bookings", "Reviews"];

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

function Sidebar({ active, setActive }) {
  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Provider Panel</h3>
      <nav className="space-y-2" aria-label="Provider panel navigation">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              active === tab
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-pressed={active === tab}
            aria-label={`Open ${tab}`}
          >
            {tab}
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
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Loading profile…</div>
        </div>
      </div>
    );
  }

  const ALL = ["Electrician", "Plumber", "Carpenter", "Cleaning"];

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-100">
      <h4 className="text-xl font-semibold text-gray-800">Manage Profile</h4>

      <div>
        <div className="text-sm font-medium mb-2 text-gray-700">Categories</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL.map((c) => {
            const checked = form.categories.includes(c);
            return (
              <label
                key={c}
                className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer ${
                  checked ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-200 rounded"
                  aria-checked={checked}
                  aria-label={`Toggle ${c}`}
                />
                <span className="text-sm font-medium text-gray-800">{c}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium mb-1 text-gray-700">Description</div>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200"
          rows={4}
          aria-label="Profile description"
        />
      </div>

      <div>
        <div className="text-sm font-medium mb-1 text-gray-700">Location</div>
        <div className="flex gap-2">
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all duration-200"
            placeholder="City / area"
            aria-label="Location"
          />
          <button
            onClick={fetchMyLocation}
            disabled={locLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-60 transition shadow-sm"
            aria-label="Use my current location"
          >
            {locLoading ? "Locating…" : "Use my location"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 shadow-md transition"
        >
          Save Profile
        </button>

        <button
          onClick={() => setForm({ categories: [], description: "", location: "" })}
          className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
        >
          Reset
        </button>

        <div className="ml-auto text-sm" role="status" aria-live="polite">
          <span className={`${msg.startsWith("Profile saved") ? "text-green-700" : "text-red-700"}`}>{msg}</span>
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
      <div className="bg-white p-4 rounded-2xl shadow border border-gray-100">
        <h5 className="font-semibold mb-3">Create Service</h5>
        <input
          className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
          placeholder="Subcategory"
          value={form.subcategory}
          onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
        />
        <textarea
          className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
        />
        <input
          className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <div className="flex gap-2 mb-2">
          <input
            className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <button
            onClick={fetchMyLocation}
            disabled={locLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-60 transition"
            aria-label="Use my location"
          >
            {locLoading ? "Locating…" : "Use my location"}
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={submit} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl">Create</button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Loading services…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-800">My Services</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreating(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 rounded-xl font-medium shadow-sm hover:from-green-600 hover:to-emerald-700 transition"
            aria-label="Create new service"
          >
            + New Service
          </button>
          <button onClick={fetch} className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">Refresh</button>
        </div>
      </div>

      {creating && <div className="mb-4"><CreateForm onClose={() => setCreating(false)} /></div>}

      {services.length === 0 ? (
        <div className="text-gray-500">No services. Create one to get started.</div>
      ) : (
        <div className="grid gap-3">
          {services.map((s) => (
            <div key={s.id} className="p-4 bg-white rounded-2xl shadow-sm flex justify-between items-start border border-gray-100">
              <div>
                <div className="font-semibold text-gray-800">{s.category} {s.subcategory ? `— ${s.subcategory}` : ""}</div>
                <div className="text-sm text-gray-600 mt-1">{s.description}</div>
                <div className="text-sm text-gray-500 mt-1">Price: {s.price ?? "N/A"} · Location: {s.location ?? "N/A"}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => openEdit(s)} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 rounded-xl">Edit</button>
                <button onClick={() => remove(s.id)} className="bg-red-500 text-white px-3 py-1 rounded-xl">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h4 className="text-lg font-semibold mb-3">Edit Service</h4>
            <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Category" value={editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} />
            <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Subcategory" value={editing.subcategory || ""} onChange={e => setEditing({ ...editing, subcategory: e.target.value })} />
            <textarea className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Description" rows={3} value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} />
            <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Price" value={editing.price ?? ""} onChange={e => setEditing({ ...editing, price: e.target.value })} />
            <div className="flex gap-2 mb-4">
              <input className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Location" value={editing.location ?? ""} onChange={e => setEditing({ ...editing, location: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveEdit} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl">Save</button>
              <button onClick={closeEdit} className="px-4 py-2 rounded-xl border border-gray-200">Cancel</button>
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
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h4 className="text-xl font-semibold mb-3 text-gray-800">Offer a Service</h4>
      <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Subcategory" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
      <textarea className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="w-full border-2 border-gray-200 px-3 py-2 mb-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <div className="flex gap-2 mb-4">
        <input className="w-full border-2 border-gray-200 px-3 py-2 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <button
          onClick={fetchMyLocation}
          disabled={locLoading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 disabled:opacity-60 transition"
        >
          {locLoading ? "Locating…" : "Use my location"}
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={submit} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl">Create</button>
        {msg && <div className="self-center text-sm text-green-700">{msg}</div>}
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

      // Fetch customer details
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

  const update = async (id, action) => {
    if (!window.confirm(`${action} booking?`)) return;
    try {
      await api.post(`/api/provider/bookings/${id}/${action}`);
      fetch();
    } catch (e) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Loading bookings…</div>
        </div>
      </div>
    );
  }
  if (bookings.length === 0) {
    return <div className="p-4 text-gray-500">No booking requests.</div>;
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const customer = customerDetails[b.customerId];
        return (
          <div key={b.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-800">Booking #{b.id} — Service {b.serviceId || "—"}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Customer: <span className="font-medium text-gray-700">{customer?.name || `#${b.customerId}`}</span>
                  <span className="mx-2">·</span>
                  Created: <span className="text-gray-600">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}</span>
                </div>
                {customer?.email && <div className="text-sm text-gray-500">Email: {customer.email}</div>}
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800">{b.status}</span>
              </div>
            </div>

            <p className="mt-2 text-gray-700">{b.notes || "No notes."}</p>
            <div className="mt-2 text-sm text-gray-500">
              📍 {customer?.location || "Location not provided"} · 🕒 {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"} {b.timeSlot || ""}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setChatCustomer({ id: b.customerId, name: customer?.name || `Customer #${b.customerId}` })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-xl"
              >
                💬 Chat
              </button>
              <button onClick={() => update(b.id, "accept")} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-xl">Accept</button>
              <button onClick={() => update(b.id, "reject")} className="bg-red-500 text-white px-3 py-1 rounded-xl">Reject</button>
              <button onClick={() => update(b.id, "complete")} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-3 py-1 rounded-xl">Complete</button>
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
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600">Loading reviews…</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
        <h4 className="text-xl font-semibold mb-2 text-gray-800">My Reviews</h4>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-indigo-700">{avgRating.toFixed(1)} ⭐</div>
          <div className="text-gray-600">{reviews.length} reviews</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="p-4 text-gray-500">No reviews yet.</div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < r.rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">by Customer #{r.customerId}</span>
                  </div>
                  <p className="text-gray-700">{r.comment || "No comment"}</p>
                </div>
                <div className="text-sm text-gray-500">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-1">
            <Sidebar active={active} setActive={setActive} />
          </div>
          <div className="col-span-1 md:col-span-4 space-y-6">
            {active === "Profile" && <ProfilePane />}
            {active === "Services" && <ServicesPane />}
            {active === "Offer Service" && <OfferServicePane />}
            {active === "Bookings" && <BookingsPane setChatCustomer={setChatCustomer} />}
            {active === "Reviews" && <ReviewsPane />}
          </div>
        </div>
      </div>

      {chatCustomer && (
        <ChatWindow receiverId={chatCustomer.id} receiverName={chatCustomer.name} onClose={() => setChatCustomer(null)} />
      )}
    </div>
  );
}
