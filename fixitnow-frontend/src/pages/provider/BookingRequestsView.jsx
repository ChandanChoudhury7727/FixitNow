
// src/pages/provider/BookingRequestsView.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

function Badge({ status }) {
  const base = "px-2 py-1 rounded text-xs font-semibold inline-block";
  const s = (status || "PENDING").toString().toUpperCase();
  switch (s) {
    case "CONFIRMED":
      return <span className={base + " bg-green-100 text-green-800"}>CONFIRMED</span>;
    case "COMPLETED":
      return <span className={base + " bg-gray-100 text-gray-800"}>COMPLETED</span>;
    case "REJECTED":
      return <span className={base + " bg-red-100 text-red-800"}>REJECTED</span>;
    case "CANCELLED":
      return <span className={base + " bg-yellow-100 text-yellow-800"}>CANCELLED</span>;
    default:
      return <span className={base + " bg-indigo-100 text-indigo-800"}>{status || "PENDING"}</span>;
  }
}

export default function BookingRequestsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/provider/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) return;
    try {
      setUpdatingId(id);
      await api.post(`/api/provider/bookings/${id}/${action}`);
      await fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-700 font-medium">Loading bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Booking Requests</h2>
        <button
          onClick={fetchBookings}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 shadow-sm transition transform hover:scale-[1.02]"
          aria-label="Refresh booking requests"
        >
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 text-center text-gray-500">
          No booking requests yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-800">
                    {b.serviceId ? `Service #${b.serviceId}` : `Booking #${b.id}`}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    Customer: <span className="font-medium text-gray-700">{b.customerId || "N/A"}</span>
                    <span className="mx-2">·</span>
                    Created: <span className="text-gray-600">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}</span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Badge status={b.status} />
                </div>
              </div>

              <p className="mt-3 text-gray-700">{b.notes || "No notes."}</p>

              <div className="text-sm text-gray-500 mt-2">
                <span className="mr-4">📍 {b.location || "N/A"}</span>
                <span>🕒 {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : b.timeSlot || "N/A"}</span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(b.id, "accept")}
                  disabled={updatingId === b.id}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  aria-label={`Accept booking ${b.id}`}
                >
                  {updatingId === b.id ? "Updating…" : "Accept"}
                </button>

                <button
                  onClick={() => updateStatus(b.id, "reject")}
                  disabled={updatingId === b.id}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  aria-label={`Reject booking ${b.id}`}
                >
                  {updatingId === b.id ? "Updating…" : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
