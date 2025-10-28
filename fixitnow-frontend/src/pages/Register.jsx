import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
    location: "",
  });
  const [msg, setMsg] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const nav = useNavigate();

  const captureLocation = async () => {
    if (!navigator.geolocation) {
      setMsg("❌ Geolocation not supported");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        try {
          // Reverse geocode using Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const data = await res.json();
          const place =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.display_name ||
            coords;

          setForm((f) => ({ ...f, location: place }));
          setMsg("📍 Location captured: " + place);
        } catch (err) {
          setForm((f) => ({ ...f, location: coords }));
          setMsg("⚠️ Location (coords only): " + coords);
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        setMsg("❌ Location error: " + err.message);
        setLoadingLocation(false);
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", form);
      setMsg("✅ Registered successfully. Please login.");
      nav("/login");
    } catch (err) {
      setMsg(err?.response?.data?.error || "❌ Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Create an Account
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>

          {/* Location capture button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={captureLocation}
              disabled={loadingLocation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loadingLocation ? "Capturing..." : "📍 Capture Location"}
            </button>
            {form.location && (
              <span className="text-sm text-gray-600 truncate max-w-[180px]">
                {form.location}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>

          {msg && (
            <div
              className={`text-sm mt-2 p-2 rounded ${
                msg.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : msg.startsWith("📍")
                  ? "bg-blue-100 text-blue-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
