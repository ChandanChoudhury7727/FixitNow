
// src/pages/customer/CustomerBookings.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ReviewModal from "./ReviewModal";
import ChatWindow from "../../components/ChatWindow";
import DisputeModal from "../../components/DisputeModal";

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    COMPLETED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.PENDING}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disputeBooking, setDisputeBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [chatProvider, setChatProvider] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({}); // Store reviews by booking ID
  const [busyId, setBusyId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    setInfoMessage("");
    try {
      const res = await api.get("/api/customer/bookings");
      const bookingsData = res.data || [];
      setBookings(bookingsData);

      // Fetch reviews for completed bookings (non-blocking)
      const reviewsMap = {};
      for (const booking of bookingsData) {
        if (booking.status === "COMPLETED") {
          try {
            const reviewRes = await api.get(`/api/reviews/booking/${booking.id}`);
            if (reviewRes.data) reviewsMap[booking.id] = reviewRes.data;
          } catch (err) {
            // no review yet or error — ignore
          }
        }
      }
      setBookingReviews(reviewsMap);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError(err.response?.data?.error || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setBusyId(bookingId);
      await api.post(`/api/customer/bookings/${bookingId}/cancel`);
      // preserve existing alert behaviour
      alert("Booking cancelled successfully");
      setInfoMessage("Booking cancelled");
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel booking");
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkComplete = async (bookingId) => {
    if (
      !window.confirm(
        "Mark this booking as completed? You'll be able to leave a review after this."
      )
    )
      return;

    try {
      setBusyId(bookingId);
      await api.post(`/api/customer/bookings/${bookingId}/complete`);
      alert("Booking marked as completed! You can now leave a review.");
      setInfoMessage("Booking marked completed");
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark booking as complete");
    } finally {
      setBusyId(null);
    }
  };

  const handleOpenChat = (providerId) => {
    setChatProvider({
      id: providerId,
      name: `Provider #${providerId}`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-gray-600">Loading your bookings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <button
            onClick={fetchBookings}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Bookings</h2>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500" aria-live="polite" role="status">
              {loading ? "Loading..." : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`}
            </div>

            <button
              onClick={fetchBookings}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
              aria-label="Refresh bookings"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {infoMessage && (
          <div className="mb-4 text-sm text-green-700" role="status">
            {infoMessage}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg">No bookings yet</p>
            <p className="text-sm mt-2">Browse services and make your first booking!</p>
            <a
              href="/customer-panel"
              className="inline-block mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const review = bookingReviews[booking.id];
              const isBusy = busyId === booking.id;
              return (
                <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-800">Service #{booking.serviceId}</h3>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Date:</strong>{" "}
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                        </p>
                        <p><strong>Time:</strong> {booking.timeSlot || "N/A"}</p>
                        <p><strong>Provider ID:</strong> {booking.providerId}</p>
                        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                        <p className="text-xs text-gray-400">
                          Booked on: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}
                        </p>
                      </div>

                      {/* Show review if exists */}
                      {review && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-800">Your Review:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{review.comment || "No comment"}</p>
                          <p className="text-xs text-gray-500 mt-1">Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {/* Chat button */}
                      {(booking.status === "PENDING" ||
                        booking.status === "CONFIRMED" ||
                        booking.status === "COMPLETED") && (
                        <button
                          onClick={() => handleOpenChat(booking.providerId)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition whitespace-nowrap flex items-center gap-2"
                          aria-label={`Chat with provider ${booking.providerId}`}
                        >
                          💬 Chat with Provider
                        </button>
                      )}

                      {/* Cancel and Mark Complete buttons */}
                      {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                        <>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={isBusy}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 disabled:opacity-60 whitespace-nowrap"
                            aria-label={`Cancel booking ${booking.id}`}
                          >
                            {isBusy ? "Canceling…" : "❌ Cancel Booking"}
                          </button>

                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleMarkComplete(booking.id)}
                              disabled={isBusy}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 whitespace-nowrap"
                              aria-label={`Mark booking ${booking.id} as complete`}
                            >
                              {isBusy ? "Updating…" : "✓ Mark Complete"}
                            </button>
                          )}
                        </>
                      )}

                      {/* Leave Review button */}
                      {booking.status === "COMPLETED" && !review && (
                        <button
                          onClick={() => setReviewBooking(booking)}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-blue-700 whitespace-nowrap"
                          aria-label={`Leave review for booking ${booking.id}`}
                        >
                          ⭐ Leave Review
                        </button>
                      )}

                      {/* Report Issue button */}
                      {booking.status === "COMPLETED" && (
                        <button
                          onClick={() => setDisputeBooking(booking)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 whitespace-nowrap"
                          aria-label={`Report issue for booking ${booking.id}`}
                        >
                          🚨 Report Issue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            fetchBookings();
          }}
        />
      )}

      {chatProvider && (
        <ChatWindow
          receiverId={chatProvider.id}
          receiverName={chatProvider.name}
          onClose={() => setChatProvider(null)}
        />
      )}

      {disputeBooking && (
        <DisputeModal
          booking={disputeBooking}
          onClose={() => setDisputeBooking(null)}
          onSuccess={() => {
            setDisputeBooking(null);
            setInfoMessage("Dispute submitted successfully. Our team will review it.");
          }}
        />
      )}
    </div>
  );
}

