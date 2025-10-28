// src/pages/provider/BookingRequestsView.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";

function Badge({ status }) {
  const base = "px-2 py-1 rounded text-xs font-semibold";
  switch ((status || "").toString().toUpperCase()) {
    case "CONFIRMED": return <span className={base + " bg-green-100 text-green-800"}>CONFIRMED</span>;
    case "COMPLETED": return <span className={base + " bg-gray-100 text-gray-800"}>COMPLETED</span>;
    case "REJECTED": return <span className={base + " bg-red-100 text-red-800"}>REJECTED</span>;
    case "CANCELLED": return <span className={base + " bg-yellow-100 text-yellow-800"}>CANCELLED</span>;
    default: return <span className={base + " bg-indigo-100 text-indigo-800"}>{status || "PENDING"}</span>;
  }
}

export default function BookingRequestsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this booking?`)) return;
    try {
      await api.post(`/api/provider/bookings/${id}/${action}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading bookings…</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Booking Requests</h2>

      {bookings.length === 0 ? <div className="text-gray-500">No booking requests yet.</div> :
        <div className="grid gap-4">
          {bookings.map(b => (
            <div key={b.id} className="p-4 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{b.serviceId ? `Service #${b.serviceId}` : `Booking #${b.id}`}</h3>
                  <div className="text-sm text-gray-600">Customer: {b.customerId || "N/A"} · Created: {b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A"}</div>
                </div>
                <Badge status={b.status} />
              </div>

              <p className="mt-2 text-gray-700">{b.notes || "No notes."}</p>
              <div className="text-sm text-gray-500 mt-2">📍 {b.location || "N/A"} · 🕒 {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : b.timeSlot || "N/A"}</div>

              <div className="flex gap-3 mt-3">
                <button onClick={() => updateStatus(b.id, "accept")} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
                <button onClick={() => updateStatus(b.id, "reject")} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
