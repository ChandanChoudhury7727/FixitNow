
// import axios from "axios";

// const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// const api = axios.create({
//   baseURL: base,
//   headers: {
//     "Content-Type": "application/json"
//   },
//   timeout: 15000
// });

// // attach token automatically (if present)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, (err) => Promise.reject(err));

// // optional: handle common response errors (refresh token logic left simple)
// api.interceptors.response.use(
//   res => res,
//   async (error) => {
//     // if 401 you might want to try refresh flow here (optional)
//     return Promise.reject(error);
//   }
// );

// export default api;

// src/api/axiosInstance.js
import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
}, e => Promise.reject(e));

export default api;
