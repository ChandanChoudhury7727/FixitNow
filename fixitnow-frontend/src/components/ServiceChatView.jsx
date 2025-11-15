// import React, { useState, useEffect } from "react";
// import api from "../api/axiosInstance";
// import DisputeGroupChat from "./DisputeGroupChat";

// export default function ServiceChatView() {
//   const [disputes, setDisputes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [unreadCounts, setUnreadCounts] = useState({});

//   useEffect(() => {
//     fetchServiceChats();
//     // Refresh unread counts every 5 seconds
//     const interval = setInterval(fetchUnreadCounts, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchServiceChats = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/api/disputes/service-chats/my");
//       setDisputes(res.data || []);
//       fetchUnreadCounts();
//     } catch (e) {
//       console.error("Failed to fetch service chats", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUnreadCounts = async () => {
//     try {
//       const res = await api.get("/api/disputes/service-chats/my");
//       const chats = res.data || [];
      
//       const counts = {};
//       for (const chat of chats) {
//         try {
//           const countRes = await api.get(`/api/disputes/${chat.id}/group-chat/unread-count`);
//           counts[chat.id] = countRes.data.unreadCount || 0;
//         } catch (e) {
//           counts[chat.id] = 0;
//         }
//       }
//       setUnreadCounts(counts);
//     } catch (e) {
//       console.error("Failed to fetch unread counts", e);
//     }
//   };

//   const handleChatOpen = async (dispute) => {
//     setSelectedChat(dispute);
//     // Mark messages as read
//     try {
//       await api.put(`/api/disputes/${dispute.id}/group-chat/mark-read`);
//       setUnreadCounts(prev => ({ ...prev, [dispute.id]: 0 }));
//     } catch (e) {
//       console.error("Failed to mark messages as read", e);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
//           <p className="text-gray-600">Loading service chats...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-semibold text-gray-800">💬 Service Chats</h3>
//         <button
//           onClick={fetchServiceChats}
//           className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition"
//         >
//           🔄 Refresh
//         </button>
//       </div>

//       {disputes.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//           <p className="text-gray-600 text-lg">✨ You are not in any service chats</p>
//           <p className="text-gray-500 text-sm mt-1">Service chats will appear here when an admin initiates one for a dispute</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {disputes.map(dispute => {
//             const unreadCount = unreadCounts[dispute.id] || 0;
//             return (
//               <div
//                 key={dispute.id}
//                 className={`border-2 p-4 rounded-lg bg-white hover:shadow-md transition cursor-pointer relative ${
//                   unreadCount > 0 ? "border-red-300" : "border-gray-200"
//                 }`}
//                 onClick={() => handleChatOpen(dispute)}
//               >
//                 {unreadCount > 0 && (
//                   <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
//                 )}
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="font-semibold text-gray-800">Service Chat #{dispute.id}</div>
//                       {unreadCount > 0 && (
//                         <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
//                           {unreadCount} new
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-sm text-gray-600 mb-2">
//                       📋 Booking #{dispute.bookingId} • 🏷️ {dispute.category}
//                     </div>
//                     <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
//                       <strong>Issue:</strong> {dispute.subject}
//                     </div>
//                   </div>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
//                       dispute.status === "RESOLVED"
//                         ? "bg-green-100 text-green-800"
//                         : dispute.status === "REJECTED"
//                         ? "bg-red-100 text-red-800"
//                         : dispute.status === "IN_PROGRESS"
//                         ? "bg-blue-100 text-blue-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {dispute.status}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {selectedChat && (
//         <DisputeGroupChat
//           disputeId={selectedChat.id}
//           customerId={selectedChat.customerId}
//           providerId={selectedChat.providerId}
//           onClose={() => {
//             setSelectedChat(null);
//             fetchServiceChats();
//           }}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import DisputeGroupChat from "./DisputeGroupChat";

export default function ServiceChatView() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    fetchServiceChats();
    const interval = setInterval(fetchUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchServiceChats = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/disputes/service-chats/my");
      setDisputes(res.data || []);
      fetchUnreadCounts();
    } catch (e) {
      console.error("Failed to fetch service chats", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await api.get("/api/disputes/service-chats/my");
      const chats = res.data || [];
      
      const counts = {};
      for (const chat of chats) {
        try {
          const countRes = await api.get(`/api/disputes/${chat.id}/group-chat/unread-count`);
          counts[chat.id] = countRes.data.unreadCount || 0;
        } catch (e) {
          counts[chat.id] = 0;
        }
      }
      setUnreadCounts(counts);
    } catch (e) {
      console.error("Failed to fetch unread counts", e);
    }
  };

  const handleChatOpen = async (dispute) => {
    setSelectedChat(dispute);
    try {
      await api.put(`/api/disputes/${dispute.id}/group-chat/mark-read`);
      setUnreadCounts(prev => ({ ...prev, [dispute.id]: 0 }));
    } catch (e) {
      console.error("Failed to mark messages as read", e);
    }
  };

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-indigo-100">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-gray-800 mb-1">Loading Service Chats</p>
          <p className="text-sm text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 border border-indigo-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">Service Chats</h3>
              <p className="text-indigo-100 text-sm mt-1">
                {disputes.length} {disputes.length === 1 ? 'conversation' : 'conversations'}
                {totalUnread > 0 && (
                  <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    {totalUnread} unread
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={fetchServiceChats}
            className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {disputes.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 shadow-inner">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">💬</span>
            </div>
            <p className="text-gray-700 text-xl font-bold mb-2">No Service Chats Yet</p>
            <p className="text-gray-500 text-sm">
              Service chats will appear here when an admin initiates one for a dispute
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {disputes.map(dispute => {
            const unreadCount = unreadCounts[dispute.id] || 0;
            return (
              <div
                key={dispute.id}
                className={`border-2 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300 cursor-pointer relative transform hover:scale-[1.02] ${
                  unreadCount > 0 
                    ? "border-red-300 shadow-lg shadow-red-100" 
                    : "border-gray-200 hover:border-indigo-300"
                }`}
                onClick={() => handleChatOpen(dispute)}
              >
                {/* Unread Indicator Dot */}
                {unreadCount > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg shadow-md">
                          <span className="text-white text-xl">💬</span>
                        </div>
                        <div className="font-bold text-lg text-gray-800">
                          Service Chat #{dispute.id}
                        </div>
                      </div>
                      {unreadCount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                          {unreadCount} new {unreadCount === 1 ? 'message' : 'messages'}
                        </span>
                      )}
                    </div>

                    {/* Booking Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                      <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                        <span>📋</span>
                        <span>Booking #{dispute.bookingId}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                        <span>🏷️</span>
                        <span>{dispute.category}</span>
                      </div>
                    </div>

                    {/* Issue Description */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 shadow-inner">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Issue</div>
                      <div className="text-sm text-gray-800 font-semibold">{dispute.subject}</div>
                      {dispute.description && (
                        <div className="text-sm text-gray-600 mt-2 line-clamp-2">{dispute.description}</div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-start">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap shadow-lg ${
                        dispute.status === "RESOLVED"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : dispute.status === "REJECTED"
                          ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                          : dispute.status === "IN_PROGRESS"
                          ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                      }`}
                    >
                      {dispute.status === "IN_PROGRESS" ? "IN PROGRESS" : dispute.status}
                    </span>
                  </div>
                </div>

                {/* Click Indicator */}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">Click to open chat</span>
                  <span className="text-indigo-600 font-bold">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedChat && (
        <DisputeGroupChat
          disputeId={selectedChat.id}
          customerId={selectedChat.customerId}
          providerId={selectedChat.providerId}
          onClose={() => {
            setSelectedChat(null);
            fetchServiceChats();
          }}
        />
      )}
    </div>
  );
}

// Add this to your global CSS or Tailwind config
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
`;