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
      const payload = {
        serviceId: service.id,
        bookingDate: bookingForm.bookingDate,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes
      };

      const res = await api.post("/api/bookings", payload);
      
      if (res.data.success) {
        setMessage({ type: "success", text: "Booking request sent successfully!" });
        setShowBooking(false);
        setBookingForm({ bookingDate: "", timeSlot: "09:00-10:00", notes: "" });
        
        setTimeout(() => {
          navigate("/customer/bookings");
        }, 2000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Booking failed. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    }
  };

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "14:00-15:00", "15:00-16:00",
    "16:00-17:00", "17:00-18:00"
  ];

  return (
    <div className="p-4 border rounded-md hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            <h5 className="font-semibold text-lg">
              {service.category} {service.subcategory ? `· ${service.subcategory}` : ""}
            </h5>
            <span className="text-sm text-gray-500">
              by {service.providerName || `Provider #${service.providerId}`}
            </span>
          </div>
          <p className="text-gray-700 mt-2">
            {service.description ? service.description.substring(0, 140) : "No description"}
            {service.description?.length > 140 && "..."}
          </p>
          <div className="text-sm text-gray-500 mt-2 flex items-center gap-4">
            <span>📍 {service.location || "N/A"}</span>
            {service.distanceKm && (
              <span className="text-blue-600">🚗 {service.distanceKm.toFixed(1)} km away</span>
            )}
          </div>
        </div>

        <div className="text-right ml-4 flex flex-col items-end">
          <div className="text-xl font-semibold text-green-700">
            {service.price != null ? `₹${service.price}` : "—"}
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowBooking(!showBooking)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {showBooking && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <h6 className="font-semibold mb-3">Book this Service</h6>
          
          <form onSubmit={handleBook} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={bookingForm.bookingDate}
                onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Slot</label>
              <select
                required
                value={bookingForm.timeSlot}
                onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Describe your requirements..."
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setShowBooking(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-3 p-2 rounded text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}