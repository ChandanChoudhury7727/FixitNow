
// import React, { useState } from "react";
// import api from "../api/axiosInstance";
// import { useNavigate, Link } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [msg, setMsg] = useState("");
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/api/auth/login", { email, password });
//       const data = res.data;

//       const accessToken = data.accessToken || data.token;
//       const refreshToken = data.refreshToken;
//       const role = data.role; // backend must return role

//       if (accessToken) localStorage.setItem("accessToken", accessToken);
//       if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
//       if (role) localStorage.setItem("role", role);

//       setMsg("✅ Login successful! Redirecting...");

//       // Redirect based on role
//       setTimeout(() => {
//         // After login we want customers to land on the "Browse Services" link
//         // which is `/customer-panel` (shown in the NavBar). Previously this
//         // went to `/services` — update to the panel route.
//         if (role === "CUSTOMER") nav("/customer-panel");
//         else if (role === "PROVIDER") nav("/provider");
//         else if (role === "ADMIN") nav("/admin-dashboard");
//         else nav("/"); // fallback
//       }, 800);
//     } catch (err) {
//       const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
//       setMsg(serverMsg ? `❌ ${serverMsg}` : "❌ Invalid credentials");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
//       <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
//         <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Welcome Back</h2>

//         <form onSubmit={submit} className="space-y-4">
//           <input
//             type="email"
//             className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none pr-10"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />

//             <button
//               type="button"
//               onClick={() => setShowPassword((s) => !s)}
//               className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
//               aria-label={showPassword ? "Hide password" : "Show password"}
//             >
//               {showPassword ? (
//                 // eye icon (password visible)
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//               ) : (
//                 // eye-off icon (password hidden) - full eye + slash so it doesn't look clipped
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   <line x1="3" y1="3" x2="21" y2="21" strokeLinecap="round" strokeLinejoin="round" />
//                 </svg>
//               )}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
//           >
//             🔑 Login
//           </button>

//           {msg && (
//             <div
//               className={`text-sm mt-2 p-2 rounded ${
//                 msg.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//               }`}
//             >
//               {msg}
//             </div>
//           )}
//         </form>

//         <div className="text-center mt-4 text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-green-600 hover:underline">
//             Register here
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const data = res.data;

      const accessToken = data.accessToken || data.token;
      const refreshToken = data.refreshToken;
      const role = data.role;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (role) localStorage.setItem("role", role);

      // ✅ Fetch user details to get user ID
      try {
        const userRes = await api.get("/api/auth/me");
        if (userRes.data && userRes.data.id) {
          localStorage.setItem("userId", userRes.data.id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }

      setMsg("✅ Login successful! Redirecting...");

      setTimeout(() => {
        if (role === "CUSTOMER") nav("/customer-panel");
        else if (role === "PROVIDER") nav("/provider");
        else if (role === "ADMIN") nav("/admin-dashboard");
        else nav("/");
      }, 800);
    } catch (err) {
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
      setMsg(serverMsg ? `❌ ${serverMsg}` : "❌ Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Welcome Back</h2>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-400 outline-none pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <line x1="3" y1="3" x2="21" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            🔑 Login
          </button>

          {msg && (
            <div
              className={`text-sm mt-2 p-2 rounded ${
                msg.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {msg}
            </div>
          )}
        </form>

        <div className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}