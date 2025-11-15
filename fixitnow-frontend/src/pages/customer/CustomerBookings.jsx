
// src/pages/customer/CustomerBookings.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ReviewModal from "./ReviewModal";
import ChatWindow from "../../components/ChatWindow";
import DisputeModal from "../../components/DisputeModal";
import ServiceChatView from "../../components/ServiceChatView";

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-lg shadow-amber-400/40 animate-pulse",
    CONFIRMED: "bg-gradient-to-r from-emerald-400 to-green-400 text-white shadow-lg shadow-emerald-400/40",
    COMPLETED: "bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg shadow-blue-400/40",
    REJECTED: "bg-gradient-to-r from-rose-400 to-red-400 text-white shadow-lg shadow-rose-400/40",
    CANCELLED: "bg-gradient-to-r from-slate-400 to-gray-400 text-white shadow-lg shadow-slate-400/40",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-bold ${styles[status] || styles.PENDING}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}

export default function CustomerBookings() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [disputeBooking, setDisputeBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [chatProvider, setChatProvider] = useState(null);
  const [bookingReviews, setBookingReviews] = useState({});
  const [busyId, setBusyId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
  const [totalUnreadChats, setTotalUnreadChats] = useState(0);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    setInfoMessage("");
    try {
      const res = await api.get("/api/customer/bookings");
      const bookingsData = res.data || [];
      setBookings(bookingsData);

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

  const fetchTotalUnreadChats = async () => {
    try {
      const res = await api.get("/api/disputes/service-chats/unread-total");
      setTotalUnreadChats(res.data.totalUnread || 0);
    } catch (e) {
      console.error("Failed to fetch unread count", e);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchTotalUnreadChats();
    const interval = setInterval(fetchTotalUnreadChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setBusyId(bookingId);
      await api.post(`/api/customer/bookings/${bookingId}/cancel`);
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
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-700 font-semibold text-lg">Loading your bookings...</div>
          <div className="text-slate-500 text-sm mt-2">Please wait a moment</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-300 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-rose-800 font-bold text-xl">Error Loading Bookings</h3>
        </div>
        <p className="text-rose-700 mb-4">{error}</p>
        <button
          onClick={fetchBookings}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 mb-8">
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  My Bookings & Chats
                </h2>
                <p className="text-slate-600 text-sm mt-1">Manage your service bookings and communications</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200" aria-live="polite" role="status">
                {activeTab === "bookings" && (loading ? "Loading..." : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`)}
              </div>

              {activeTab === "bookings" && (
                <button
                  onClick={fetchBookings}
                  className="px-5 py-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 hover:shadow-lg transition-all font-medium text-slate-700 hover:scale-105 transform"
                  aria-label="Refresh bookings"
                >
                  🔄 Refresh
                </button>
              )}

              <button
                onClick={() => setActiveTab("service-chats")}
                className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-bold shadow-lg shadow-indigo-500/40 hover:shadow-xl hover:scale-105 transform"
                aria-label="View service chats"
              >
                💬 Service Chats
                {totalUnreadChats > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    {totalUnreadChats > 9 ? "9+" : totalUnreadChats}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative ${
              activeTab === "bookings"
                ? "text-indigo-700 bg-white shadow-sm"
                : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl">📋</span>
              <span>My Bookings</span>
            </span>
            {activeTab === "bookings" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("service-chats")}
            className={`flex-1 px-6 py-4 font-bold transition-all duration-300 relative ${
              activeTab === "service-chats"
                ? "text-indigo-700 bg-white shadow-sm"
                : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl">💬</span>
              <span>Service Chats</span>
              {totalUnreadChats > 0 && (
                <span className="w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg ml-2">
                  {totalUnreadChats > 9 ? "9+" : totalUnreadChats}
                </span>
              )}
            </span>
            {activeTab === "service-chats" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-full"></div>
            )}
          </button>
        </div>

        <div className="p-8">
          {infoMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-2xl text-emerald-800 font-semibold flex items-center gap-3 animate-fade-in shadow-lg" role="status">
              <span className="text-2xl">✅</span>
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <>
              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl border-2 border-dashed border-slate-300">
                  <div className="text-7xl mb-6 animate-bounce">📋</div>
                  <p className="text-2xl font-bold text-slate-800 mb-2">No bookings yet</p>
                  <p className="text-slate-600 mb-6">Browse services and make your first booking!</p>
                  <a
                    href="/customer-panel"
                    className="inline-block bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-green-600 transition-all font-bold shadow-lg shadow-emerald-500/40 hover:shadow-xl transform hover:scale-105"
                  >
                    🔍 Browse Services
                  </a>
                </div>
              ) : (
                <div className="space-y-5">
                  {bookings.map((booking) => {
                    const review = bookingReviews[booking.id];
                    const isBusy = busyId === booking.id;
                    return (
                      <div 
                        key={booking.id} 
                        className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-indigo-300"
                      >
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🛠️</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-xl text-slate-800">Service #{booking.serviceId}</h3>
                                <StatusBadge status={booking.status} />
                              </div>
                            </div>

                            <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
                              <p className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">📅 Date:</span>
                                <span className="text-slate-600">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">⏰ Time:</span>
                                <span className="text-slate-600">{booking.timeSlot || "N/A"}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <span className="font-bold text-slate-700">👨‍🔧 Provider:</span>
                                <span className="text-slate-600">#{booking.providerId}</span>
                              </p>
                              {booking.notes && (
                                <p className="flex items-start gap-2">
                                  <span className="font-bold text-slate-700">📝 Notes:</span>
                                  <span className="text-slate-600">{booking.notes}</span>
                                </p>
                              )}
                              <p className="text-xs text-slate-400 pt-2 border-t border-slate-200">
                                🕐 Booked on: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : "N/A"}
                              </p>
                            </div>

                            {/* Show review if exists */}
                            {review && (
                              <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-md">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-xl">⭐</span>
                                  <span className="font-bold text-blue-800 text-lg">Your Review:</span>
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i} className={`text-2xl ${i < review.rating ? "text-amber-400" : "text-slate-300"}`}>★</span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-slate-700 bg-white p-3 rounded-xl border border-blue-200">{review.comment || "No comment"}</p>
                                <p className="text-xs text-blue-600 mt-2 font-medium">📅 Reviewed on: {new Date(review.createdAt).toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-3 lg:w-56">
                            {/* Chat button */}
                            {(booking.status === "PENDING" ||
                              booking.status === "CONFIRMED" ||
                              booking.status === "COMPLETED") && (
                              <button
                                onClick={() => handleOpenChat(booking.providerId)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-bold shadow-lg shadow-purple-500/40 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
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
                                  className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-5 py-3 rounded-xl hover:from-rose-600 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-rose-500/40 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                  aria-label={`Cancel booking ${booking.id}`}
                                >
                                  {isBusy ? "⏳ Canceling…" : "❌ Cancel Booking"}
                                </button>

                                {booking.status === "CONFIRMED" && (
                                  <button
                                    onClick={() => handleMarkComplete(booking.id)}
                                    disabled={isBusy}
                                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-3 rounded-xl hover:from-emerald-600 hover:to-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-emerald-500/40 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                    aria-label={`Mark booking ${booking.id} as complete`}
                                  >
                                    {isBusy ? "⏳ Updating…" : "✓ Mark Complete"}
                                  </button>
                                )}
                              </>
                            )}

                            {/* Leave Review button */}
                            {booking.status === "COMPLETED" && !review && (
                              <button
                                onClick={() => setReviewBooking(booking)}
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-3 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all font-bold shadow-lg shadow-amber-500/40 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                aria-label={`Leave review for booking ${booking.id}`}
                              >
                                ⭐ Leave Review
                              </button>
                            )}

                            {/* Report Issue button */}
                            {booking.status === "COMPLETED" && (
                              <button
                                onClick={() => setDisputeBooking(booking)}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all font-bold shadow-lg shadow-orange-500/40 hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
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
            </>
          )}

          {/* Service Chats Tab */}
          {activeTab === "service-chats" && (
            <div className="animate-fade-in">
              <ServiceChatView />
            </div>
          )}
        </div>
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
