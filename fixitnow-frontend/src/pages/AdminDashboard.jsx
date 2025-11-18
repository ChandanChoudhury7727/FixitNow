
// import React, { useEffect, useState } from "react";
// import api from "../api/axiosInstance";
// import ChatWindow from "../components/ChatWindow";
// import DisputeGroupChat from "../components/DisputeGroupChat";
// import UserProfileModal from "../components/UserProfileModal";
// import {
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [providers, setProviders] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [services, setServices] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [verificationProfiles, setVerificationProfiles] = useState([]);
//   const [disputes, setDisputes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chatUser, setChatUser] = useState(null);
//   const [selectedGroupChat, setSelectedGroupChat] = useState(null);
//   const [selectedUserProfile, setSelectedUserProfile] = useState(null);
//   const [totalUnreadDisputes, setTotalUnreadDisputes] = useState(0);
//   const [unreadByDispute, setUnreadByDispute] = useState({});

//   const calculateTotalUnreadDisputes = async () => {
//     try {
//       const disputesRes = await api.get("/api/disputes/admin/all");
//       const allDisputes = disputesRes.data || [];
      
//       let totalUnread = 0;
//       const unreadCounts = {};
//       for (const dispute of allDisputes) {
//         try {
//           const countRes = await api.get(`/api/disputes/${dispute.id}/group-chat/unread-count`);
//           const count = countRes.data.unreadCount || 0;
//           unreadCounts[dispute.id] = count;
//           totalUnread += count;
//         } catch (e) {
//           // Skip if error
//           unreadCounts[dispute.id] = 0;
//         }
//       }
//       setTotalUnreadDisputes(totalUnread);
//       setUnreadByDispute(unreadCounts);
//     } catch (e) {
//       console.error("Failed to calculate unread disputes", e);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//     calculateTotalUnreadDisputes();
//     // Refresh unread count every 5 seconds
//     const interval = setInterval(calculateTotalUnreadDisputes, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch all users
//       const usersRes = await api.get("/api/admin/users");
//       const allUsers = usersRes.data || [];
//       setUsers(allUsers);

//       // Filter by role
//       setProviders(allUsers.filter(u => u.role === "PROVIDER"));
//       setCustomers(allUsers.filter(u => u.role === "CUSTOMER"));

//       // Fetch bookings
//       const bookingsRes = await api.get("/api/admin/bookings");
//       setBookings(bookingsRes.data || []);

//       // Fetch services
//       const servicesRes = await api.get("/api/admin/services");
//       setServices(servicesRes.data || []);

//       // Fetch analytics
//       const analyticsRes = await api.get("/api/admin/analytics");
//       setAnalytics(analyticsRes.data || {});

//       // Fetch verification profiles
//       try {
//         const verificationRes = await api.get("/api/admin/providers/verification");
//         setVerificationProfiles(verificationRes.data || []);
//       } catch (e) {
//         console.error("Failed to fetch verification profiles", e);
//       }

//       // Fetch disputes
//       try {
//         const disputesRes = await api.get("/api/disputes/admin/all");
//         setDisputes(disputesRes.data || []);
//       } catch (e) {
//         console.error("Failed to fetch disputes", e);
//       }

//       // Calculate stats
//       setStats({
//         totalUsers: allUsers.length,
//         providers: allUsers.filter(u => u.role === "PROVIDER").length,
//         customers: allUsers.filter(u => u.role === "CUSTOMER").length,
//         bookings: bookingsRes.data?.length || 0,
//         services: servicesRes.data?.length || 0,
//         pendingBookings: bookingsRes.data?.filter(b => b.status === "PENDING").length || 0
//       });
//     } catch (e) {
//       console.error("Failed to fetch admin data", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       await api.delete(`/api/admin/users/${userId}`);
//       alert("User deleted successfully");
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to delete user");
//     }
//   };


//   const deleteService = async (serviceId) => {
//     if (!window.confirm("Delete this service?")) return;
//     try {
//       await api.delete(`/api/admin/services/${serviceId}`);
//       alert("Service deleted");
//       fetchDashboardData();
//     } catch (err) {
//       alert("Failed to delete service");
//     }
//   };

//   const makeAdmin = async (userId) => {
//     if (!window.confirm("Promote this user to admin? This action cannot be undone.")) return;
//     try {
//       await api.post(`/api/admin/users/${userId}/make-admin`);
//       alert("User promoted to admin successfully");
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to promote user");
//     }
//   };

//   const handleVerification = async (providerId, action) => {
//     const notes = prompt(`Enter notes for ${action.toLowerCase()}:`);
//     if (notes === null) return; // User cancelled
    
//     try {
//       await api.post(`/api/admin/providers/${providerId}/verify`, { action, notes });
//       alert(`Provider ${action.toLowerCase()} successfully`);
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to update verification");
//     }
//   };

//   const updateDispute = async (disputeId, updates) => {
//     try {
//       await api.patch(`/api/disputes/admin/${disputeId}`, updates);
//       alert("Dispute updated successfully");
//       fetchDashboardData();
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to update dispute");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
//           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-lg font-medium text-gray-700">Loading admin dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
//       <div className="max-w-7xl mx-auto px-6">
//         {/* Header */}
//         <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//               <p className="text-gray-500 mt-1">Manage platform operations and analytics</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setActiveTab("disputes")}
//                 className="relative bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 shadow-md hover:shadow-lg transition"
//               >
//                 ⚖️ Disputes
//                 {totalUnreadDisputes > 0 && (
//                   <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white">
//                     {totalUnreadDisputes > 9 ? "9+" : totalUnreadDisputes}
//                   </span>
//                 )}
//               </button>
//               <button
//                 onClick={() => fetchDashboardData()}
//                 className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg transition"
//               >
//                 🔄 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
//             <h3 className="text-sm text-gray-500">Total Users</h3>
//             <p className="text-2xl font-semibold text-gray-800">{stats?.totalUsers ?? 0}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
//             <h3 className="text-sm text-gray-500">Total Services</h3>
//             <p className="text-2xl font-semibold text-indigo-700">{stats?.services ?? 0}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
//             <h3 className="text-sm text-gray-500">Total Bookings</h3>
//             <p className="text-2xl font-semibold text-purple-700">{stats?.bookings ?? 0}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
//             <h3 className="text-sm text-gray-500">Revenue (₹)</h3>
//             <p className="text-2xl font-semibold text-orange-600">
//               {analytics?.totalRevenue ? analytics.totalRevenue.toFixed(2) : '0'}
//             </p>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-3xl shadow mb-6 overflow-hidden">
//           <div className="flex border-b overflow-x-auto">
//             {["overview", "analytics", "users", "providers", "verification", "services", "bookings", "disputes"].map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-3 font-medium capitalize whitespace-nowrap transition-colors relative ${
//                   activeTab === tab
//                     ? "border-b-2 border-indigo-600 text-indigo-700"
//                     : "text-gray-600 hover:text-indigo-600"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <span>{tab}</span>
//                   {tab === "disputes" && totalUnreadDisputes > 0 && (
//                     <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
//                       {totalUnreadDisputes > 9 ? "9+" : totalUnreadDisputes}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className="p-6">
//             {/* Overview Tab */}
//             {activeTab === "overview" && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold mb-3">Platform Overview</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
//                     <div className="text-sm text-gray-600">Completed Bookings</div>
//                     <div className="text-2xl font-bold text-green-700">{analytics?.completedBookings || 0}</div>
//                   </div>
//                   <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
//                     <div className="text-sm text-gray-600">Pending Bookings</div>
//                     <div className="text-2xl font-bold text-orange-700">{stats?.pendingBookings || 0}</div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold mb-3">Recent Activity</h4>
//                   <div className="space-y-2">
//                     {bookings.slice(0, 5).map(b => (
//                       <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
//                         <div>
//                           <div className="font-medium">Booking #{b.id}</div>
//                           <div className="text-sm text-gray-500">
//                             Service #{b.serviceId} • Customer #{b.customerId}
//                           </div>
//                         </div>
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           b.status === "COMPLETED" ? "bg-green-100 text-green-800" :
//                           b.status === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
//                           b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-red-100 text-red-800"
//                         }`}>
//                           {b.status}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Analytics Tab */}
//             {activeTab === "analytics" && analytics && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-semibold mb-4">📊 Platform Analytics Dashboard</h3>

//                 {/* Booking Status Distribution - Pie Chart */}
//                 <div className="bg-white border rounded-xl p-6">
//                   <h4 className="font-semibold mb-4">Booking Status Distribution</h4>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <PieChart>
//                       <Pie
//                         data={Object.entries(analytics.statusDistribution || {}).map(([name, value]) => ({
//                           name,
//                           value
//                         }))}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({ name, value }) => `${name}: ${value}`}
//                         outerRadius={100}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         <Cell fill="#10b981" />
//                         <Cell fill="#3b82f6" />
//                         <Cell fill="#f59e0b" />
//                         <Cell fill="#ef4444" />
//                         <Cell fill="#8b5cf6" />
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Top Services - Bar Chart */}
//                 <div className="bg-white border rounded-xl p-6">
//                   <h4 className="font-semibold mb-4">📊 Most Booked Services</h4>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={analytics.topServices?.slice(0, 5) || []}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="bookingCount" fill="#3b82f6" name="Bookings" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                   <div className="mt-4 space-y-2">
//                     {analytics.topServices?.slice(0, 5).map((item, idx) => (
//                       <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-bold text-indigo-600">#{idx + 1}</span>
//                           <div className="text-sm">{item.category} - {item.subcategory}</div>
//                         </div>
//                         <span className="font-semibold text-indigo-700">{item.bookingCount}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Top Providers - Bar Chart */}
//                 <div className="bg-white border rounded-xl p-6">
//                   <h4 className="font-semibold mb-4">⭐ Top Rated Providers</h4>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={analytics.topProviders?.slice(0, 5) || []}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="completedBookings" fill="#10b981" name="Completed Bookings" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                   <div className="mt-4 space-y-2">
//                     {analytics.topProviders?.slice(0, 5).map((item, idx) => (
//                       <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-bold text-green-600">#{idx + 1}</span>
//                           <div className="text-sm">{item.name}</div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs text-gray-600">
//                             {item.avgRating ? `⭐ ${item.avgRating.toFixed(1)}` : 'No rating'}
//                           </span>
//                           <span className="font-semibold text-green-700">{item.completedBookings}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Location Distribution - Bar Chart */}
//                 <div className="bg-white border rounded-xl p-6">
//                   <h4 className="font-semibold mb-4">📍 Service Distribution by Location</h4>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={analytics.locationTrends || []}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
//                       <YAxis />
//                       <Tooltip />
//                       <Bar dataKey="serviceCount" fill="#8b5cf6" name="Services" />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Key Metrics Grid */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
//                     <div className="text-sm text-gray-600">Completed</div>
//                     <div className="text-3xl font-bold text-green-700">{analytics?.completedBookings || 0}</div>
//                   </div>
//                   <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
//                     <div className="text-sm text-gray-600">Confirmed</div>
//                     <div className="text-3xl font-bold text-blue-700">{analytics?.statusDistribution?.CONFIRMED || 0}</div>
//                   </div>
//                   <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
//                     <div className="text-sm text-gray-600">Pending</div>
//                     <div className="text-3xl font-bold text-orange-700">{analytics?.statusDistribution?.PENDING || 0}</div>
//                   </div>
//                   <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
//                     <div className="text-sm text-gray-600">Cancelled</div>
//                     <div className="text-3xl font-bold text-red-700">{analytics?.statusDistribution?.CANCELLED || 0}</div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Users Tab */}
//             {activeTab === "users" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">All Users ({users.length})</h3>
//                 <div className="space-y-2">
//                   {users.map(u => (
//                     <div key={u.id} className="flex items-center justify-between border p-3 rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-800">{u.name}</div>
//                         <div className="text-sm text-gray-500">
//                           {u.email} • <span className="font-medium">{u.role}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => setChatUser({ id: u.id, name: u.name })}
//                           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600"
//                         >
//                           💬 Chat
//                         </button>
//                         {u.role !== "ADMIN" && (
//                           <button
//                             onClick={() => makeAdmin(u.id)}
//                             className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:from-blue-600 hover:to-indigo-700"
//                           >
//                             👑 Make Admin
//                           </button>
//                         )}
//                         <button
//                           onClick={() => deleteUser(u.id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Providers Tab */}
//             {activeTab === "providers" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Providers ({providers.length})</h3>
//                 <div className="space-y-2">
//                   {providers.map(p => (
//                     <div key={p.id} className="flex items-center justify-between border p-3 rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-800">{p.name}</div>
//                         <div className="text-sm text-gray-500">{p.email}</div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => setChatUser({ id: p.id, name: p.name })}
//                           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg text-sm"
//                         >
//                           💬
//                         </button>
//                         <button
//                           onClick={() => deleteUser(p.id)}
//                           className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Services Tab */}
//             {activeTab === "services" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">All Services ({services.length})</h3>
//                 <div className="space-y-2">
//                   {services.map(s => (
//                     <div key={s.id} className="flex items-center justify-between border p-3 rounded-lg">
//                       <div className="flex-1">
//                         <div className="font-medium text-gray-800">{s.category} - {s.subcategory}</div>
//                         <div className="text-sm text-gray-500">
//                           Provider #{s.providerId} • ₹{s.price} • {s.location}
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => deleteService(s.id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Bookings Tab */}
//             {activeTab === "bookings" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">All Bookings ({bookings.length})</h3>
//                 <div className="space-y-2">
//                   {bookings.map(b => (
//                     <div key={b.id} className="border p-3 rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <div className="font-medium">Booking #{b.id}</div>
//                           <div className="text-sm text-gray-500">
//                             Service #{b.serviceId} • Customer #{b.customerId}
//                           </div>
//                         </div>
//                         <span className={`px-2 py-1 rounded text-xs ${
//                           b.status === "COMPLETED" ? "bg-green-100 text-green-800" :
//                           b.status === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
//                           b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
//                           "bg-red-100 text-red-800"
//                         }`}>
//                           {b.status}
//                         </span>
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"} • {b.timeSlot || "N/A"}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Verification Tab */}
//             {activeTab === "verification" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Provider Verification ({verificationProfiles.length})</h3>
//                 <div className="space-y-3">
//                   {verificationProfiles.map(profile => {
//                     // Find provider user details
//                     const providerUser = users.find(u => u.id === profile.providerId);
//                     // Normalize status to ensure buttons show when backend returns null/undefined/lowercase
//                     const status = (profile.verificationStatus || "PENDING").toUpperCase();
                    
//                     return (
//                       <div key={profile.id} className="border-2 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition">
//                         <div className="flex justify-between items-start mb-3">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="font-bold text-lg text-gray-800">
//                                 {providerUser?.name || `Provider #${profile.providerId}`}
//                               </div>
//                               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                 status === "APPROVED" ? "bg-green-100 text-green-800" :
//                                 status === "REJECTED" ? "bg-red-100 text-red-800" :
//                                 "bg-yellow-100 text-yellow-800"
//                               }`}>
//                                 {status}
//                               </span>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               📧 {providerUser?.email || "N/A"}
//                             </div>
//                             <div className="text-sm text-gray-600 mt-1">
//                               🏷️ Categories: {Array.isArray(profile.categories) ? profile.categories.join(", ") : profile.categories || "N/A"}
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               📍 Location: {profile.location || "N/A"}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Document Section */}
//                         {profile.verificationDocumentUrl ? (
//                           <div className="mb-3 p-3 bg-blue-50 border-2 border-blue-300 rounded-lg">
//                             <div className="text-xs font-semibold text-blue-700 mb-2">📄 Verification Document</div>
//                             <div className="flex items-center gap-2">
//                               <div className="flex-1 text-sm text-blue-600 truncate" title={profile.verificationDocumentUrl}>
//                                 {profile.verificationDocumentUrl}
//                               </div>
//                               <a
//                                 href={profile.verificationDocumentUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 whitespace-nowrap font-semibold shadow-sm hover:shadow-md transition"
//                               >
//                                 🔍 View Document
//                               </a>
//                               {status !== "APPROVED" && (
//                                 <button
//                                   onClick={() => handleVerification(profile.providerId, "APPROVED")}
//                                   className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 font-semibold shadow-sm hover:shadow-md transition"
//                                   title="Approve after reviewing the document"
//                                 >
//                                   ✓ Approve
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         ) : (
//                           <div className="mb-3 p-3 bg-orange-50 border-2 border-orange-300 rounded-lg">
//                             <div className="text-sm text-orange-700 font-semibold">⚠️ No document uploaded yet</div>
//                             <div className="text-xs text-orange-600 mt-1">Provider needs to upload verification documents</div>
//                           </div>
//                         )}

//                         {/* Admin Notes */}
//                         {profile.verificationNotes && (
//                           <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                             <div className="text-xs font-semibold text-gray-700 mb-1">📝 Admin Notes:</div>
//                             <div className="text-sm text-gray-800">{profile.verificationNotes}</div>
//                           </div>
//                         )}

//                         {/* Action Buttons - Always show for PENDING status */}
//                         {status !== "APPROVED" && (
//                           <div className="flex gap-3 mt-3">
//                             <button
//                               onClick={() => handleVerification(profile.providerId, "APPROVED")}
//                               className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm hover:from-green-600 hover:to-emerald-700 font-bold shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
//                             >
//                               ✓ Approve Verification
//                             </button>
//                             <button
//                               onClick={() => handleVerification(profile.providerId, "REJECTED")}
//                               className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-red-600 font-bold shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
//                             >
//                               ✗ Reject Verification
//                             </button>
//                           </div>
//                         )}

//                         {/* Already Verified/Rejected Status */}
//                         {status === "APPROVED" && (
//                           <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
//                             <div className="text-sm text-green-700 font-semibold">✅ Provider is verified</div>
//                             {profile.verifiedAt && (
//                               <div className="text-xs text-green-600 mt-1">
//                                 Verified on: {new Date(profile.verifiedAt).toLocaleString()}
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {status === "REJECTED" && (
//                           <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
//                             <div className="text-sm text-red-700 font-semibold">❌ Verification rejected</div>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                   {verificationProfiles.length === 0 && (
//                     <div className="text-gray-500 text-center py-8">No verification requests</div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Disputes Tab */}
//             {activeTab === "disputes" && (
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">⚖️ Disputes & Reports ({disputes.length})</h3>
//                 <div className="space-y-4">
//                   {disputes.map(dispute => {
//                     const customer = customers.find(c => c.id === dispute.customerId);
//                     const provider = providers.find(p => p.id === dispute.providerId);
                    
//                     return (
//                       <div key={dispute.id} className="border-2 p-5 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition">
//                         {/* Header */}
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2">
//                               <div className="font-bold text-lg text-gray-800">Dispute #{dispute.id}</div>
//                               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                 dispute.status === "RESOLVED" ? "bg-green-100 text-green-800" :
//                                 dispute.status === "REJECTED" ? "bg-red-100 text-red-800" :
//                                 dispute.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
//                                 "bg-yellow-100 text-yellow-800"
//                               }`}>
//                                 {dispute.status}
//                               </span>
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               📋 Booking #{dispute.bookingId} • 🏷️ {dispute.category}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Parties Involved */}
//                         <div className="bg-white p-4 rounded-lg mb-4 border border-gray-200">
//                           <div className="text-sm font-semibold text-gray-700 mb-3">Parties Involved:</div>
//                           <div className="grid grid-cols-2 gap-3">
//                             <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
//                               <div className="text-xs text-gray-600 mb-1">👤 Customer</div>
//                               <button
//                                 onClick={() => setSelectedUserProfile(dispute.customerId)}
//                                 className="text-blue-600 font-semibold hover:text-blue-800 hover:underline text-sm"
//                               >
//                                 {customer?.name || `Customer #${dispute.customerId}`}
//                               </button>
//                               <div className="text-xs text-gray-500 mt-1">{customer?.email}</div>
//                             </div>
//                             <div className="p-3 bg-green-50 rounded-lg border border-green-200">
//                               <div className="text-xs text-gray-600 mb-1">👨‍💼 Provider</div>
//                               <button
//                                 onClick={() => setSelectedUserProfile(dispute.providerId)}
//                                 className="text-green-600 font-semibold hover:text-green-800 hover:underline text-sm"
//                               >
//                                 {provider?.name || `Provider #${dispute.providerId}`}
//                               </button>
//                               <div className="text-xs text-gray-500 mt-1">{provider?.email}</div>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Issue Details */}
//                         <div className="mb-4">
//                           <div className="font-semibold text-gray-800 mb-2">{dispute.subject}</div>
//                           <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{dispute.description}</div>
//                         </div>

//                         {/* Refund Info */}
//                         {dispute.refundAmount && (
//                           <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
//                             <div className="text-sm text-gray-700">
//                               💰 Refund: <span className="font-bold text-orange-700">₹{dispute.refundAmount}</span> • 
//                               Status: <span className={`font-semibold ${
//                                 dispute.refundStatus === "APPROVED" ? "text-green-700" : "text-yellow-700"
//                               }`}>{dispute.refundStatus}</span>
//                             </div>
//                           </div>
//                         )}

//                         {/* Admin Notes */}
//                         {dispute.adminNotes && (
//                           <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                             <div className="text-xs font-semibold text-blue-700 mb-1">📝 Admin Notes:</div>
//                             <div className="text-sm text-gray-800">{dispute.adminNotes}</div>
//                           </div>
//                         )}

//                         {/* Resolution Notes */}
//                         {dispute.resolutionNotes && (
//                           <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
//                             <div className="text-xs font-semibold text-green-700 mb-1">✅ Resolution:</div>
//                             <div className="text-sm text-gray-800">{dispute.resolutionNotes}</div>
//                           </div>
//                         )}

//                         {/* Action Buttons */}
//                         <div className="flex flex-wrap gap-2 mt-4">
//                           {dispute.status !== "RESOLVED" && dispute.status !== "REJECTED" && (
//                             <>
//                               <button
//                                 onClick={() => setSelectedGroupChat(dispute)}
//                                 className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:from-indigo-700 hover:to-blue-700 font-semibold shadow-sm hover:shadow-md transition"
//                               >
//                                 💬 Service Chat
//                                 {unreadByDispute[dispute.id] > 0 && (
//                                   <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white">
//                                     {unreadByDispute[dispute.id] > 9 ? "9+" : unreadByDispute[dispute.id]}
//                                   </span>
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   const notes = prompt("Enter resolution notes:");
//                                   if (notes) updateDispute(dispute.id, { status: "RESOLVED", resolutionNotes: notes });
//                                 }}
//                                 className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-emerald-700 font-semibold shadow-sm hover:shadow-md transition"
//                               >
//                                 ✓ Resolve
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   const notes = prompt("Enter rejection reason:");
//                                   if (notes) updateDispute(dispute.id, { status: "REJECTED", adminNotes: notes });
//                                 }}
//                                 className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 font-semibold shadow-sm hover:shadow-md transition"
//                               >
//                                 ✗ Reject
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   const amount = prompt("Enter refund amount:");
//                                   if (amount) updateDispute(dispute.id, { refundAmount: parseFloat(amount), refundStatus: "APPROVED" });
//                                 }}
//                                 className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 font-semibold shadow-sm hover:shadow-md transition"
//                               >
//                                 💰 Approve Refund
//                               </button>
//                             </>
//                           )}
//                           {(dispute.status === "RESOLVED" || dispute.status === "REJECTED") && (
//                             <div className="text-sm text-gray-600 italic">
//                               {dispute.status === "RESOLVED" ? "✅ This dispute has been resolved" : "❌ This dispute has been rejected"}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                   {disputes.length === 0 && (
//                     <div className="text-gray-500 text-center py-12">
//                       <div className="text-4xl mb-2">✨</div>
//                       <p className="text-lg">No disputes reported</p>
//                       <p className="text-sm">All is well on the platform!</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {chatUser && (
//         <ChatWindow
//           receiverId={chatUser.id}
//           receiverName={chatUser.name}
//           onClose={() => setChatUser(null)}
//         />
//       )}

//       {selectedGroupChat && (
//         <DisputeGroupChat
//           disputeId={selectedGroupChat.id}
//           customerId={selectedGroupChat.customerId}
//           providerId={selectedGroupChat.providerId}
//           onClose={() => setSelectedGroupChat(null)}
//         />
//       )}

//       {selectedUserProfile && (
//         <UserProfileModal
//           userId={selectedUserProfile}
//           onClose={() => setSelectedUserProfile(null)}
//         />
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChatWindow from "../components/ChatWindow";
import DisputeGroupChat from "../components/DisputeGroupChat";
import UserProfileModal from "../components/UserProfileModal";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [verificationProfiles, setVerificationProfiles] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [totalUnreadDisputes, setTotalUnreadDisputes] = useState(0);
  const [unreadByDispute, setUnreadByDispute] = useState({});

  // Professional color palette
  const COLORS = {
    primary: ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'],
    success: ['#10b981', '#34d399', '#6ee7b7'],
    warning: ['#f59e0b', '#fbbf24', '#fcd34d'],
    danger: ['#ef4444', '#f87171', '#fca5a5'],
    info: ['#3b82f6', '#60a5fa', '#93c5fd'],
    charts: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
  };

  const calculateTotalUnreadDisputes = async () => {
    try {
      const disputesRes = await api.get("/api/disputes/admin/all");
      const allDisputes = disputesRes.data || [];
      
      let totalUnread = 0;
      const unreadCounts = {};
      for (const dispute of allDisputes) {
        try {
          const countRes = await api.get(`/api/disputes/${dispute.id}/group-chat/unread-count`);
          const count = countRes.data.unreadCount || 0;
          unreadCounts[dispute.id] = count;
          totalUnread += count;
        } catch (e) {
          unreadCounts[dispute.id] = 0;
        }
      }
      setTotalUnreadDisputes(totalUnread);
      setUnreadByDispute(unreadCounts);
    } catch (e) {
      console.error("Failed to calculate unread disputes", e);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    calculateTotalUnreadDisputes();
    const interval = setInterval(calculateTotalUnreadDisputes, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching admin dashboard data...");
      
      // Fetch all users
      console.log("📥 Fetching users from /api/admin/users");
      const usersRes = await api.get("/api/admin/users");
      const allUsers = usersRes.data || [];
      console.log("✅ Users fetched:", allUsers.length, allUsers);
      setUsers(allUsers);

      setProviders(allUsers.filter(u => u.role === "PROVIDER"));
      setCustomers(allUsers.filter(u => u.role === "CUSTOMER"));

      // Fetch bookings
      console.log("📥 Fetching bookings from /api/admin/bookings");
      const bookingsRes = await api.get("/api/admin/bookings");
      console.log("✅ Bookings fetched:", bookingsRes.data?.length, bookingsRes.data);
      setBookings(bookingsRes.data || []);

      // Fetch services
      console.log("📥 Fetching services from /api/admin/services");
      const servicesRes = await api.get("/api/admin/services");
      console.log("✅ Services fetched:", servicesRes.data?.length, servicesRes.data);
      setServices(servicesRes.data || []);

      // Fetch analytics
      console.log("📥 Fetching analytics from /api/admin/analytics");
      const analyticsRes = await api.get("/api/admin/analytics");
      console.log("✅ Analytics fetched:", analyticsRes.data);
      setAnalytics(analyticsRes.data || {});

      try {
        console.log("📥 Fetching verification profiles from /api/admin/providers/verification");
        const verificationRes = await api.get("/api/admin/providers/verification");
        console.log("✅ Verification profiles fetched:", verificationRes.data);
        setVerificationProfiles(verificationRes.data || []);
      } catch (e) {
        console.error("❌ Failed to fetch verification profiles", e);
      }

      try {
        console.log("📥 Fetching disputes from /api/disputes/admin/all");
        const disputesRes = await api.get("/api/disputes/admin/all");
        console.log("✅ Disputes fetched:", disputesRes.data);
        setDisputes(disputesRes.data || []);
      } catch (e) {
        console.error("❌ Failed to fetch disputes", e);
      }

      setStats({
        totalUsers: allUsers.length,
        providers: allUsers.filter(u => u.role === "PROVIDER").length,
        customers: allUsers.filter(u => u.role === "CUSTOMER").length,
        bookings: bookingsRes.data?.length || 0,
        services: servicesRes.data?.length || 0,
        pendingBookings: bookingsRes.data?.filter(b => b.status === "PENDING").length || 0
      });
      console.log("✅ Dashboard data fetched successfully");
    } catch (e) {
      const errorMsg = `Failed to fetch admin data: ${e.response?.status} ${e.response?.statusText || e.message}`;
      console.error("❌ " + errorMsg, e);
      console.error("Error details:", {
        message: e.message,
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        config: e.config
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      alert("User deleted successfully");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const deleteService = async (serviceId) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/api/admin/services/${serviceId}`);
      alert("Service deleted");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to delete service");
    }
  };

  const makeAdmin = async (userId) => {
    if (!window.confirm("Promote this user to admin? This action cannot be undone.")) return;
    try {
      await api.post(`/api/admin/users/${userId}/make-admin`);
      alert("User promoted to admin successfully");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to promote user");
    }
  };

  const handleVerification = async (providerId, action) => {
    const notes = prompt(`Enter notes for ${action.toLowerCase()}:`);
    if (notes === null) return;
    
    try {
      await api.post(`/api/admin/providers/${providerId}/verify`, { action, notes });
      alert(`Provider ${action.toLowerCase()} successfully`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update verification");
    }
  };

  const updateDispute = async (disputeId, updates) => {
    try {
      await api.patch(`/api/disputes/admin/${disputeId}`, updates);
      alert("Dispute updated successfully");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update dispute");
    }
  };

  // Custom animated tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-indigo-200 rounded-lg shadow-xl p-3 animate-fadeIn">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading admin dashboard...</p>
          <button
            onClick={async () => {
              try {
                const res = await api.post("/api/auth/promote-to-admin");
                // Store new tokens
                if (res.data.accessToken) {
                  localStorage.setItem("accessToken", res.data.accessToken);
                }
                if (res.data.refreshToken) {
                  localStorage.setItem("refreshToken", res.data.refreshToken);
                }
                alert("Promoted to admin! Refreshing...");
                // Refresh the page to reload with new token
                window.location.reload();
              } catch (err) {
                alert("Error: " + (err.response?.data?.error || err.message));
              }
            }}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Promote to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <h3 className="font-semibold text-red-800">Error Loading Dashboard</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => fetchDashboardData()}
                className="ml-auto px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border border-indigo-100 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 font-medium">Manage platform operations and analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("disputes")}
                className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-orange-600 hover:via-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ⚖️ Disputes
                {totalUnreadDisputes > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
                    {totalUnreadDisputes > 9 ? "9+" : totalUnreadDisputes}
                  </span>
                )}
              </button>
              <button
                onClick={() => fetchDashboardData()}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-sm text-indigo-100 font-semibold mb-1">Total Users</h3>
            <p className="text-4xl font-extrabold text-white">{stats?.totalUsers ?? 0}</p>
            <div className="mt-2 text-xs text-indigo-100">Platform members</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-sm text-blue-100 font-semibold mb-1">Total Services</h3>
            <p className="text-4xl font-extrabold text-white">{stats?.services ?? 0}</p>
            <div className="mt-2 text-xs text-blue-100">Listed services</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-sm text-purple-100 font-semibold mb-1">Total Bookings</h3>
            <p className="text-4xl font-extrabold text-white">{stats?.bookings ?? 0}</p>
            <div className="mt-2 text-xs text-purple-100">All time bookings</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-sm text-orange-100 font-semibold mb-1">Revenue (₹)</h3>
            <p className="text-4xl font-extrabold text-white">
              {analytics?.totalRevenue ? analytics.totalRevenue.toFixed(2) : '0'}
            </p>
            <div className="mt-2 text-xs text-orange-100">Total earnings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl mb-6 overflow-hidden border border-indigo-100">
          <div className="flex border-b border-gray-200 overflow-x-auto bg-gradient-to-r from-indigo-50 to-purple-50">
            {["overview", "analytics", "users", "providers", "verification", "services", "bookings", "disputes"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold capitalize whitespace-nowrap transition-all duration-300 relative ${
                  activeTab === tab
                    ? "text-indigo-700 border-b-4 border-indigo-600 bg-white"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-white/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{tab}</span>
                  {tab === "disputes" && totalUnreadDisputes > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse shadow-lg">
                      {totalUnreadDisputes > 9 ? "9+" : totalUnreadDisputes}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Completed Bookings</div>
                    <div className="text-4xl font-extrabold text-green-700">{analytics?.completedBookings || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-2xl border-2 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <div className="text-sm text-gray-700 font-semibold mb-2">Pending Bookings</div>
                    <div className="text-4xl font-extrabold text-orange-700">{stats?.pendingBookings || 0}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-gray-800 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200">
                        <div>
                          <div className="font-semibold text-gray-800">Booking #{b.id}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Service #{b.serviceId} • Customer #{b.customerId}
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md ${
                          b.status === "COMPLETED" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" :
                          b.status === "CONFIRMED" ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white" :
                          b.status === "PENDING" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
                          "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && analytics && (
              <div className="space-y-8 animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 Platform Analytics Dashboard</h3>

                {/* Booking Status Distribution - Pie Chart */}
                <div className="bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="font-bold text-xl text-gray-800 mb-6">Booking Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics.statusDistribution || {}).map(([name, value]) => ({
                          name,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {COLORS.charts.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Services - Bar Chart */}
                <div className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="font-bold text-xl text-gray-800 mb-6">📊 Most Booked Services</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics.topServices?.slice(0, 5) || []}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} stroke="#6366f1" />
                      <YAxis stroke="#6366f1" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="bookingCount" fill="url(#colorBookings)" name="Bookings" animationDuration={1000} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {analytics.topServices?.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all duration-300 border border-indigo-200">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-indigo-600 bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center">#{idx + 1}</span>
                          <div className="text-sm font-semibold text-gray-700">{item.category} - {item.subcategory}</div>
                        </div>
                        <span className="font-bold text-indigo-700 text-lg">{item.bookingCount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Providers - Bar Chart */}
                <div className="bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="font-bold text-xl text-gray-800 mb-6">⭐ Top Rated Providers</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics.topProviders?.slice(0, 5) || []}>
                      <defs>
                        <linearGradient id="colorProviders" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} stroke="#10b981" />
                      <YAxis stroke="#10b981" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="completedBookings" fill="url(#colorProviders)" name="Completed Bookings" animationDuration={1000} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 space-y-3">
                    {analytics.topProviders?.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all duration-300 border border-green-200">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-green-600 bg-green-100 w-8 h-8 rounded-full flex items-center justify-center">#{idx + 1}</span>
                          <div className="text-sm font-semibold text-gray-700">{item.name}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-semibold text-gray-600 bg-yellow-100 px-2 py-1 rounded-lg">
                            {item.avgRating ? `⭐ ${item.avgRating.toFixed(1)}` : 'No rating'}
                          </span>
                          <span className="font-bold text-green-700 text-lg">{item.completedBookings}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Distribution - Bar Chart */}
                <div className="bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h4 className="font-bold text-xl text-gray-800 mb-6">📍 Service Distribution by Location</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics.locationTrends || []}>
                      <defs>
                        <linearGradient id="colorLocation" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#f472b6" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                      <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} stroke="#ec4899" />
                      <YAxis stroke="#ec4899" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="serviceCount" fill="url(#colorLocation)" name="Services" animationDuration={1000} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-sm text-green-100 font-semibold mb-1">Completed</div>
                    <div className="text-5xl font-extrabold text-white">{analytics?.completedBookings || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-sm text-blue-100 font-semibold mb-1">Confirmed</div>
                    <div className="text-5xl font-extrabold text-white">{analytics?.statusDistribution?.CONFIRMED || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-sm text-yellow-100 font-semibold mb-1">Pending</div>
                    <div className="text-5xl font-extrabold text-white">{analytics?.statusDistribution?.PENDING || 0}</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
                    <div className="text-sm text-red-100 font-semibold mb-1">Cancelled</div>
                    <div className="text-5xl font-extrabold text-white">{analytics?.statusDistribution?.CANCELLED || 0}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">All Users ({users.length})</h3>
                <div className="space-y-3">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between border-2 border-indigo-100 p-4 rounded-xl bg-gradient-to-r from-white to-indigo-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-lg">{u.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {u.email} • <span className="font-semibold text-indigo-600">{u.role}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChatUser({ id: u.id, name: u.name })}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          💬 Chat
                        </button>
                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => makeAdmin(u.id)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            👑 Make Admin
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === "providers" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Providers ({providers.length})</h3>
                <div className="space-y-3">
                  {providers.map(p => (
                    <div key={p.id} className="flex items-center justify-between border-2 border-green-100 p-4 rounded-xl bg-gradient-to-r from-white to-green-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-lg">{p.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{p.email}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChatUser({ id: p.id, name: p.name })}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          💬
                        </button>
                        <button
                          onClick={() => deleteUser(p.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">All Services ({services.length})</h3>
                <div className="space-y-3">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between border-2 border-blue-100 p-4 rounded-xl bg-gradient-to-r from-white to-blue-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-lg">{s.category} - {s.subcategory}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Provider #{s.providerId} • <span className="font-bold text-indigo-600">₹{s.price}</span> • {s.location}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">All Bookings ({bookings.length})</h3>
                <div className="space-y-3">
                  {bookings.map(b => (
                    <div key={b.id} className="border-2 border-purple-100 p-4 rounded-xl bg-gradient-to-r from-white to-purple-50 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-gray-800 text-lg">Booking #{b.id}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Service #{b.serviceId} • Customer #{b.customerId}
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md ${
                          b.status === "COMPLETED" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" :
                          b.status === "CONFIRMED" ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white" :
                          b.status === "PENDING" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
                          "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"} • {b.timeSlot || "N/A"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === "verification" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Provider Verification ({verificationProfiles.length})</h3>
                <div className="space-y-4">
                  {verificationProfiles.map(profile => {
                    const providerUser = users.find(u => u.id === profile.providerId);
                    const status = (profile.verificationStatus || "PENDING").toUpperCase();
                    
                    return (
                      <div key={profile.id} className="border-2 border-indigo-200 p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="font-extrabold text-xl text-gray-800">
                                {providerUser?.name || `Provider #${profile.providerId}`}
                              </div>
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                                status === "APPROVED" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" :
                                status === "REJECTED" ? "bg-gradient-to-r from-red-400 to-pink-500 text-white" :
                                "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              }`}>
                                {status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              📧 {providerUser?.email || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 font-medium">
                              🏷️ Categories: {Array.isArray(profile.categories) ? profile.categories.join(", ") : profile.categories || "N/A"}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              📍 Location: {profile.location || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Document Section */}
                        {profile.verificationDocumentUrl ? (
                          <div className="mb-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl shadow-md">
                            <div className="text-xs font-bold text-blue-800 mb-3">📄 Verification Document</div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 text-sm text-blue-700 truncate font-medium" title={profile.verificationDocumentUrl}>
                                {profile.verificationDocumentUrl}
                              </div>
                              <a
                                href={profile.verificationDocumentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm hover:from-blue-700 hover:to-indigo-700 whitespace-nowrap font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                🔍 View Document
                              </a>
                              {status !== "APPROVED" && (
                                <button
                                  onClick={() => handleVerification(profile.providerId, "APPROVED")}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm hover:from-green-700 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                  title="Approve after reviewing the document"
                                >
                                  ✓ Approve
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4 p-4 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl shadow-md">
                            <div className="text-sm text-orange-800 font-bold">⚠️ No document uploaded yet</div>
                            <div className="text-xs text-orange-700 mt-1 font-medium">Provider needs to upload verification documents</div>
                          </div>
                        )}

                        {/* Admin Notes */}
                        {profile.verificationNotes && (
                          <div className="mb-4 p-4 bg-gray-100 border-2 border-gray-300 rounded-xl shadow-md">
                            <div className="text-xs font-bold text-gray-800 mb-2">📝 Admin Notes:</div>
                            <div className="text-sm text-gray-700 font-medium">{profile.verificationNotes}</div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        {status !== "APPROVED" && (
                          <div className="flex gap-3 mt-4">
                            <button
                              onClick={() => handleVerification(profile.providerId, "APPROVED")}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl text-sm hover:from-green-600 hover:to-emerald-700 font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                              ✓ Approve Verification
                            </button>
                            <button
                              onClick={() => handleVerification(profile.providerId, "REJECTED")}
                              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-3 rounded-xl text-sm hover:from-red-600 hover:to-pink-700 font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                              ✗ Reject Verification
                            </button>
                          </div>
                        )}

                        {/* Already Verified/Rejected Status */}
                        {status === "APPROVED" && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl shadow-md">
                            <div className="text-sm text-green-800 font-bold">✅ Provider is verified</div>
                            {profile.verifiedAt && (
                              <div className="text-xs text-green-700 mt-1 font-medium">
                                Verified on: {new Date(profile.verifiedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        )}

                        {status === "REJECTED" && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 rounded-xl shadow-md">
                            <div className="text-sm text-red-800 font-bold">❌ Verification rejected</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {verificationProfiles.length === 0 && (
                    <div className="text-gray-500 text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                      <div className="text-5xl mb-3">📋</div>
                      <p className="text-lg font-semibold">No verification requests</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disputes Tab */}
            {activeTab === "disputes" && (
              <div className="animate-fadeIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">⚖️ Disputes & Reports ({disputes.length})</h3>
                <div className="space-y-5">
                  {disputes.map(dispute => {
                    const customer = customers.find(c => c.id === dispute.customerId);
                    const provider = providers.find(p => p.id === dispute.providerId);
                    
                    return (
                      <div key={dispute.id} className="border-2 border-orange-200 p-6 rounded-2xl bg-gradient-to-br from-white to-orange-50 shadow-lg hover:shadow-2xl transition-all duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="font-extrabold text-xl text-gray-800">Dispute #{dispute.id}</div>
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-md ${
                                dispute.status === "RESOLVED" ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white" :
                                dispute.status === "REJECTED" ? "bg-gradient-to-r from-red-400 to-pink-500 text-white" :
                                dispute.status === "IN_PROGRESS" ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white" :
                                "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              }`}>
                                {dispute.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              📋 Booking #{dispute.bookingId} • 🏷️ {dispute.category}
                            </div>
                          </div>
                        </div>

                        {/* Parties Involved */}
                        <div className="bg-white p-5 rounded-xl mb-4 border-2 border-gray-200 shadow-md">
                          <div className="text-sm font-bold text-gray-800 mb-4">Parties Involved:</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                              <div className="text-xs text-gray-700 mb-2 font-semibold">👤 Customer</div>
                              <button
                                onClick={() => setSelectedUserProfile(dispute.customerId)}
                                className="text-blue-700 font-bold hover:text-blue-900 hover:underline text-sm"
                              >
                                {customer?.name || `Customer #${dispute.customerId}`}
                              </button>
                              <div className="text-xs text-gray-600 mt-1 font-medium">{customer?.email}</div>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                              <div className="text-xs text-gray-700 mb-2 font-semibold">👨‍💼 Provider</div>
                              <button
                                onClick={() => setSelectedUserProfile(dispute.providerId)}
                                className="text-green-700 font-bold hover:text-green-900 hover:underline text-sm"
                              >
                                {provider?.name || `Provider #${dispute.providerId}`}
                              </button>
                              <div className="text-xs text-gray-600 mt-1 font-medium">{provider?.email}</div>
                            </div>
                          </div>
                        </div>

                        {/* Issue Details */}
                        <div className="mb-4">
                          <div className="font-bold text-gray-800 mb-3 text-lg">{dispute.subject}</div>
                          <div className="text-sm text-gray-700 bg-gray-100 p-4 rounded-xl border border-gray-300 shadow-inner">{dispute.description}</div>
                        </div>

                        {/* Refund Info */}
                        {dispute.refundAmount && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 rounded-xl shadow-md">
                            <div className="text-sm text-gray-800 font-semibold">
                              💰 Refund: <span className="font-extrabold text-orange-700">₹{dispute.refundAmount}</span> • 
                              Status: <span className={`font-extrabold ${
                                dispute.refundStatus === "APPROVED" ? "text-green-700" : "text-yellow-700"
                              }`}>{dispute.refundStatus}</span>
                            </div>
                          </div>
                        )}

                        {/* Admin Notes */}
                        {dispute.adminNotes && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl shadow-md">
                            <div className="text-xs font-bold text-blue-800 mb-2">📝 Admin Notes:</div>
                            <div className="text-sm text-gray-800 font-medium">{dispute.adminNotes}</div>
                          </div>
                        )}

                        {/* Resolution Notes */}
                        {dispute.resolutionNotes && (
                          <div className="mb-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl shadow-md">
                            <div className="text-xs font-bold text-green-800 mb-2">✅ Resolution:</div>
                            <div className="text-sm text-gray-800 font-medium">{dispute.resolutionNotes}</div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-5">
                          {dispute.status !== "RESOLVED" && dispute.status !== "REJECTED" && (
                            <>
                              <button
                                onClick={() => setSelectedGroupChat(dispute)}
                                className="relative bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm hover:from-indigo-700 hover:to-blue-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                💬 Service Chat
                                {unreadByDispute[dispute.id] > 0 && (
                                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white shadow-lg">
                                    {unreadByDispute[dispute.id] > 9 ? "9+" : unreadByDispute[dispute.id]}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  const notes = prompt("Enter resolution notes:");
                                  if (notes) updateDispute(dispute.id, { status: "RESOLVED", resolutionNotes: notes });
                                }}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm hover:from-green-600 hover:to-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                ✓ Resolve
                              </button>
                              <button
                                onClick={() => {
                                  const notes = prompt("Enter rejection reason:");
                                  if (notes) updateDispute(dispute.id, { status: "REJECTED", adminNotes: notes });
                                }}
                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm hover:from-red-600 hover:to-pink-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                ✗ Reject
                              </button>
                              <button
                                onClick={() => {
                                  const amount = prompt("Enter refund amount:");
                                  if (amount) updateDispute(dispute.id, { refundAmount: parseFloat(amount), refundStatus: "APPROVED" });
                                }}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm hover:from-blue-600 hover:to-indigo-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                💰 Approve Refund
                              </button>
                            </>
                          )}
                          {(dispute.status === "RESOLVED" || dispute.status === "REJECTED") && (
                            <div className="text-sm text-gray-600 italic font-semibold">
                              {dispute.status === "RESOLVED" ? "✅ This dispute has been resolved" : "❌ This dispute has been rejected"}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {disputes.length === 0 && (
                    <div className="text-gray-500 text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-inner">
                      <div className="text-6xl mb-4">✨</div>
                      <p className="text-xl font-bold text-gray-700">No disputes reported</p>
                      <p className="text-sm text-gray-600 mt-2">All is well on the platform!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {chatUser && (
        <ChatWindow
          receiverId={chatUser.id}
          receiverName={chatUser.name}
          onClose={() => setChatUser(null)}
        />
      )}

      {selectedGroupChat && (
        <DisputeGroupChat
          disputeId={selectedGroupChat.id}
          customerId={selectedGroupChat.customerId}
          providerId={selectedGroupChat.providerId}
          onClose={() => setSelectedGroupChat(null)}
        />
      )}

      {selectedUserProfile && (
        <UserProfileModal
          userId={selectedUserProfile}
          onClose={() => setSelectedUserProfile(null)}
        />
      )}
    </div>
  );
}

// Add these CSS animations to your global CSS file or Tailwind config
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
`;