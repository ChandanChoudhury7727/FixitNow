// // src/pages/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import api from "../api/axiosInstance";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     // sample: get summary/stats if backend has endpoint. If not, it will fail silently.
//     (async () => {
//       try {
//         const res = await api.get("/api/admin/summary"); // optional endpoint
//         setStats(res.data);
//       } catch (e) {
//         // ignore if endpoint not present
//       }
//       try {
//         const resp = await api.get("/api/admin/users"); // optional admin users endpoint
//         setUsers(resp.data || []);
//       } catch (e) {
//         // ignore
//       }
//     })();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="bg-white rounded-2xl shadow p-6 mb-6">
//           <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
//           <p className="text-gray-600 mt-1">Manage users, providers and bookings from here.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <div className="bg-white rounded-xl shadow p-4">
//             <h3 className="text-sm text-gray-500">Total Users</h3>
//             <p className="text-2xl font-semibold">{stats?.totalUsers ?? "—"}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow p-4">
//             <h3 className="text-sm text-gray-500">Providers</h3>
//             <p className="text-2xl font-semibold">{stats?.providers ?? "—"}</p>
//           </div>
//           <div className="bg-white rounded-xl shadow p-4">
//             <h3 className="text-sm text-gray-500">Bookings</h3>
//             <p className="text-2xl font-semibold">{stats?.bookings ?? "—"}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-4">
//           <h2 className="text-lg font-semibold mb-3">Recent users</h2>
//           <div className="space-y-2">
//             {users.length === 0 && <div className="text-gray-500">No user data (or endpoint not implemented).</div>}
//             {users.map((u) => (
//               <div key={u.id} className="flex items-center justify-between border p-3 rounded">
//                 <div>
//                   <div className="font-medium">{u.name}</div>
//                   <div className="text-sm text-gray-500">{u.email} • {u.role}</div>
//                 </div>
//                 <div className="text-sm text-gray-500">{new Date(u.created_at || u.createdAt || Date.now()).toLocaleString()}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChatWindow from "../components/ChatWindow";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersRes = await api.get("/api/admin/users");
      const allUsers = usersRes.data || [];
      setUsers(allUsers);

      // Filter by role
      setProviders(allUsers.filter(u => u.role === "PROVIDER"));
      setCustomers(allUsers.filter(u => u.role === "CUSTOMER"));

      // Fetch bookings
      const bookingsRes = await api.get("/api/admin/bookings");
      setBookings(bookingsRes.data || []);

      // Fetch services
      const servicesRes = await api.get("/api/admin/services");
      setServices(servicesRes.data || []);

      // Calculate stats
      setStats({
        totalUsers: allUsers.length,
        providers: allUsers.filter(u => u.role === "PROVIDER").length,
        customers: allUsers.filter(u => u.role === "CUSTOMER").length,
        bookings: bookingsRes.data?.length || 0,
        services: servicesRes.data?.length || 0,
        pendingBookings: bookingsRes.data?.filter(b => b.status === "PENDING").length || 0
      });
    } catch (e) {
      console.error("Failed to fetch admin data", e);
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

  const verifyProvider = async (providerId) => {
    try {
      await api.post(`/api/admin/providers/${providerId}/verify`);
      alert("Provider verified successfully");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to verify provider");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, providers, services and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Total Users</h3>
            <p className="text-2xl font-semibold text-green-700">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Providers</h3>
            <p className="text-2xl font-semibold text-blue-700">{stats?.providers ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Customers</h3>
            <p className="text-2xl font-semibold text-purple-700">{stats?.customers ?? 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-sm text-gray-500">Total Bookings</h3>
            <p className="text-2xl font-semibold text-orange-700">{stats?.bookings ?? 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {["overview", "users", "providers", "services", "bookings"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-green-600 text-green-700"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">Booking #{b.id}</div>
                          <div className="text-sm text-gray-500">
                            Service #{b.serviceId} • Customer #{b.customerId} • Provider #{b.providerId}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          b.status === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
                          b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">All Users ({users.length})</h3>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between border p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-gray-500">
                          {u.email} • {u.role} • {u.location || "No location"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChatUser({ id: u.id, name: u.name })}
                          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
              <div>
                <h3 className="text-lg font-semibold mb-3">Providers ({providers.length})</h3>
                <div className="space-y-2">
                  {providers.map(p => (
                    <div key={p.id} className="flex items-center justify-between border p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">
                          {p.email} • {p.location || "No location"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChatUser({ id: p.id, name: p.name })}
                          className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
                        >
                          💬 Chat
                        </button>
                        <button
                          onClick={() => verifyProvider(p.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          ✓ Verify
                        </button>
                        <button
                          onClick={() => deleteUser(p.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
              <div>
                <h3 className="text-lg font-semibold mb-3">All Services ({services.length})</h3>
                <div className="space-y-2">
                  {services.map(s => (
                    <div key={s.id} className="flex items-center justify-between border p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{s.category} - {s.subcategory}</div>
                        <div className="text-sm text-gray-500">
                          Provider #{s.providerId} • ₹{s.price} • {s.location}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
              <div>
                <h3 className="text-lg font-semibold mb-3">All Bookings ({bookings.length})</h3>
                <div className="space-y-2">
                  {bookings.map(b => (
                    <div key={b.id} className="border p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">Booking #{b.id}</div>
                          <div className="text-sm text-gray-500">
                            Service #{b.serviceId} • Customer #{b.customerId} • Provider #{b.providerId}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          b.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                          b.status === "CONFIRMED" ? "bg-blue-100 text-blue-800" :
                          b.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Date: {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString() : "N/A"} • 
                        Time: {b.timeSlot || "N/A"}
                      </div>
                      {b.notes && (
                        <div className="text-sm text-gray-500 mt-1">Notes: {b.notes}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {chatUser && (
        <ChatWindow
          receiverId={chatUser.id}
          receiverName={chatUser.name}
          onClose={() => setChatUser(null)}
        />
      )}
    </div>
  );
}