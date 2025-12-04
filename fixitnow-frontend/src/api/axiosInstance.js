
// import axios from "axios";

// const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// const api = axios.create({
//   baseURL: base,
//   headers: { "Content-Type": "application/json" },
//   timeout: 15000,
// });

// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem("accessToken");
//   console.log("🔐 Token from localStorage:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
//   if (token) {
//     cfg.headers = cfg.headers || {};
//     cfg.headers.Authorization = `Bearer ${token}`;
//     console.log("✅ Authorization header set");
//   } else {
//     console.warn("⚠️ NO TOKEN FOUND - Request will be unauthorized");
//   }
//   console.log("📤 Request to:", cfg.url, "Headers:", cfg.headers);
//   return cfg;
// }, e => Promise.reject(e));

// export default api;
import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  // 🚀 Public routes (NO TOKEN REQUIRED)
  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh"
  ];

  // If the current request is going to a public route → skip token
  if (publicRoutes.some(route => cfg.url.includes(route))) {
    console.log("🟢 Public route, no token needed →", cfg.url);
    return cfg;
  }

  // For protected routes → attach token
  const token = localStorage.getItem("accessToken");
  console.log("🔐 Token from localStorage:", token ? token.substring(0, 20) + "..." : "NO TOKEN");

  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
    console.log("✅ JWT attached");
  } else {
    console.warn("⚠️ NO TOKEN FOUND - protected route, will fail if backend requires auth");
  }

  console.log("📤 Request →", cfg.url, "Headers:", cfg.headers);
  return cfg;

}, e => Promise.reject(e));

export default api;
