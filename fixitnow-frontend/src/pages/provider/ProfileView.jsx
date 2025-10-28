// src/pages/provider/ProfileView.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

export default function ProfileView() {
  const [form, setForm] = useState({ categories: [], description: "", location: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/provider/profile");
        if (res?.data && Object.keys(res.data).length) {
          let categories = [];
          if (res.data.categories) {
            try { categories = JSON.parse(res.data.categories); } catch { categories = []; }
          }
          setForm({ categories, description: res.data.description || "", location: res.data.location || "" });
        }
      } catch (e) {
        // profile may be empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const AVAILABLE_CATEGORIES = ["Electrician", "Plumber", "Carpenter", "Cleaning"];

  const toggleCategory = (cat) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat]
    }));
  };

  const save = async () => {
    try {
      await api.post("/api/provider/profile", {
        categories: form.categories,
        description: form.description,
        location: form.location
      });
      setMsg("Profile saved ✅");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) {
      console.error(e);
      setMsg("Save failed ❌");
    }
  };

  if (loading) return <div>Loading profile…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Provider Profile</h2>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
        <div>
          <p className="mb-2 font-medium">Select Categories</p>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="w-4 h-4"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Short description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            placeholder="Describe your services"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location (city / area)</label>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Bhubaneswar, Odisha"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Profile</button>
          <button onClick={() => setForm({ categories: [], description: "", location: "" })} className="px-4 py-2 rounded border">Reset</button>
        </div>

        {msg && <div className="text-green-700">{msg}</div>}
      </div>
    </div>
  );
}
