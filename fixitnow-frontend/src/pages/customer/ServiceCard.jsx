
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

export default function ServiceCard({ service }) {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    bookingDate: "",
    timeSlot: "09:00-10:00",
    notes: ""
  });
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login to book services");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        serviceId: service.id,
        bookingDate: bookingForm.bookingDate,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes
      };

      const res = await api.post("/api/bookings", payload);

      if (res.data && (res.data.success || res.status === 200)) {
        setMessage({ type: "success", text: "Booking request sent successfully!" });
        setShowBooking(false);
        setBookingForm({ bookingDate: "", timeSlot: "09:00-10:00", notes: "" });

        // keep existing behavior: navigate after a short delay
        setTimeout(() => {
          navigate("/customer/bookings");
        }, 2000);
      } else {
        const errorMsg = (res.data && res.data.error) || "Booking failed. Please try again.";
        setMessage({ type: "error", text: errorMsg });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Booking failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00"
  ];

  return (
    <article className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h5 className="font-semibold text-lg text-gray-800">
              {service.category} {service.subcategory ? `· ${service.subcategory}` : ""}
            </h5>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              by <span className="font-medium text-gray-700">{service.providerName || `Provider #${service.providerId}`}</span>
              {service.providerVerified && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full" title="Verified Provider">
                  ✓ Verified
                </span>
              )}
            </span>
          </div>

          <p className="text-gray-700 mt-2 text-sm">
            {service.description ? service.description.substring(0, 140) : "No description"}
            {service.description?.length > 140 && "..."}
          </p>

          <div className="text-sm text-gray-500 mt-2 flex items-center gap-4">
            <span>📍 {service.location || "N/A"}</span>
            {service.distanceKm != null && (
              <span className="text-indigo-700">🚗 {Number(service.distanceKm).toFixed(1)} km away</span>
            )}
          </div>
        </div>

        <div className="text-right ml-4 flex flex-col items-end">
          <div className="text-xl font-semibold text-green-700">
            {service.price != null ? `₹${service.price}` : "—"}
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowBooking((s) => !s)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 shadow-sm transition"
              aria-expanded={showBooking}
              aria-controls={`booking-form-${service.id}`}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <section id={`booking-form-${service.id}`} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100" aria-labelledby={`book-heading-${service.id}`}>
          <h6 id={`book-heading-${service.id}`} className="font-semibold mb-3 text-gray-800">Book this Service</h6>

          <form onSubmit={handleBook} className="space-y-3" aria-live="polite">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingForm.bookingDate}
                onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Time Slot</label>
              <select
                required
                value={bookingForm.timeSlot}
                onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Additional Notes (optional)
              </label>
              <textarea
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Describe your requirements..."
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                aria-label={`Confirm booking for service ${service.id}`}
              >
                {submitting ? "Sending…" : "Confirm Booking"}
              </button>

              <button
                type="button"
                onClick={() => setShowBooking(false)}
                className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>

          {message && (
            <div
              role="status"
              className={`mt-3 p-3 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </section>
      )}
    </article>
  );
}
