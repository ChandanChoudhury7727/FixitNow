// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function NavBar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("accessToken");
//   const role = localStorage.getItem("role");

//   const logout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("role");
//     localStorage.removeItem("userId");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Brand */}
//         <Link to="/" className="text-xl font-bold text-blue-600">
//           FixitNow
//         </Link>

//         {/* Navigation Links */}
//         <div className="flex items-center gap-4">
//           {!token ? (
//             <>
//               <Link
//                 to="/register"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//               >
//                 Register
//               </Link>
//               <Link
//                 to="/login"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//               >
//                 Login
//               </Link>
//             </>
//           ) : (
//             <>
//               {/* Customer Links */}
//               {role === "CUSTOMER" && (
//                 <>
//                   <Link 
//                     to="/customer-panel" 
//                     className="px-3 py-1 rounded text-sm text-green-700 hover:underline"
//                   >
//                     Browse Services
//                   </Link>
//                   <Link 
//                     to="/customer/bookings" 
//                     className="px-3 py-1 rounded text-sm text-green-700 hover:underline"
//                   >
//                     My Bookings
//                   </Link>
//                 </>
//               )}

//               {/* Provider Links */}
//               {role === "PROVIDER" && (
//                 <Link to="/provider" className="hover:text-blue-600">
//                   Provider Panel
//                 </Link>
//               )}

//               {/* Admin Links */}
//               {role === "ADMIN" && (
//                 <Link to="/admin-dashboard" className="hover:text-blue-600">
//                   Admin Dashboard
//                 </Link>
//               )}

//               {/* Logout button */}
//               <button
//                 onClick={logout}
//                 className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

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
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          FixitNow
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
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
                    className="px-3 py-1 rounded text-sm text-green-700 hover:underline"
                  >
                    Browse Services
                  </Link>
                  <Link 
                    to="/customer/bookings" 
                    className="px-3 py-1 rounded text-sm text-green-700 hover:underline"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => window.open('/chat-admin', '_blank')}
                    className="px-3 py-1 rounded text-sm bg-purple-600 text-white hover:bg-purple-700"
                  >
                    💬 Chat with Admin
                  </button>
                </>
              )}

              {/* Provider Links */}
              {role === "PROVIDER" && (
                <Link to="/provider" className="hover:text-blue-600">
                  Provider Panel
                </Link>
              )}

              {/* Admin Links */}
              {role === "ADMIN" && (
                <Link to="/admin-dashboard" className="hover:text-blue-600">
                  Admin Dashboard
                </Link>
              )}

              {/* Logout button */}
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
