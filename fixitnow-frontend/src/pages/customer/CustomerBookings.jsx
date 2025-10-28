
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ReviewModal from "./ReviewModal";
import ChatWindow from "../../components/ChatWindow";

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
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || styles.PENDING
      }`}
    >
      {status}
    </span>
  );
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [chatProvider, setChatProvider] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({}); // Store reviews by booking ID

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/customer/bookings");
      const bookingsData = res.data || [];
      setBookings(bookingsData);

      // Fetch reviews for completed bookings
      const reviewsMap = {};
      for (const booking of bookingsData) {
        if (booking.status === "COMPLETED") {
          try {
            const reviewRes = await api.get(
              `/api/reviews/booking/${booking.id}`
            );
            if (reviewRes.data) {
              reviewsMap[booking.id] = reviewRes.data;
            }
          } catch (err) {
            // No review exists yet
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
      await api.post(`/api/customer/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel booking");
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
      await api.post(`/api/customer/bookings/${bookingId}/complete`);
      alert("Booking marked as completed! You can now leave a review.");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark booking as complete");
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
        <div className="text-gray-500">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
        <h3 className="text-red-800 font-semibold">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-green-700">My Bookings</h2>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            🔄 Refresh
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg">No bookings yet</p>
            <p className="text-sm mt-2">
              Browse services and make your first booking!
            </p>
            {/* 🟢 Fixed Missing <a> Tag */}
            <a
              href="/customer-panel"
              className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const review = bookingReviews[booking.id];
              return (
                <div
                  key={booking.id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          Service #{booking.serviceId}
                        </h3>
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Date:</strong>{" "}
                          {booking.bookingDate
                            ? new Date(
                                booking.bookingDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Time:</strong> {booking.timeSlot || "N/A"}
                        </p>
                        <p>
                          <strong>Provider ID:</strong> {booking.providerId}
                        </p>
                        {booking.notes && (
                          <p>
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Booked on:{" "}
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* Show review if exists */}
                      {review && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-blue-800">
                              Your Review:
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.comment || "No comment"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Reviewed on:{" "}
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}
                          </p>
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
                          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 whitespace-nowrap flex items-center gap-2"
                        >
                          💬 Chat with Provider
                        </button>
                      )}

                      {/* Cancel and Mark Complete buttons */}
                      {(booking.status === "PENDING" ||
                        booking.status === "CONFIRMED") && (
                        <>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 whitespace-nowrap"
                          >
                            ❌ Cancel Booking
                          </button>

                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleMarkComplete(booking.id)}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 whitespace-nowrap"
                            >
                              ✓ Mark Complete
                            </button>
                          )}
                        </>
                      )}

                      {/* Leave Review button */}
                      {booking.status === "COMPLETED" && !review && (
                        <button
                          onClick={() => setReviewBooking(booking)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
                        >
                          ⭐ Leave Review
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
    </div>
  );
}
