
// src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-wide hover:scale-105 transition-transform"
        >
          Fixit<span className="text-yellow-300">Now</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {!token ? (
            <>
              <Link
                to="/register"
                className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-indigo-50 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-semibold shadow hover:bg-yellow-300 transition"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              {/* Customer Links */}
              {role === "CUSTOMER" && (
                <>
                  <Link
                    to="/customer-panel"
                    className="text-white/90 hover:text-yellow-300 transition"
                  >
                    Browse Services
                  </Link>
                  <Link
                    to="/customer/bookings"
                    className="text-white/90 hover:text-yellow-300 transition"
                  >
                    My Bookings
                  </Link>
                </>
              )}

              {/* Provider Links */}
              {role === "PROVIDER" && (
                <Link
                  to="/provider"
                  className="text-white/90 hover:text-yellow-300 transition"
                >
                  Provider Panel
                </Link>
              )}

              {/* Admin Links */}
              {role === "ADMIN" && (
                <Link
                  to="/admin-dashboard"
                  className="text-white/90 hover:text-yellow-300 transition"
                >
                  Admin Dashboard
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition shadow-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
