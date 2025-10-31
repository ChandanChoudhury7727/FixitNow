
// // src/pages/customer/CustomerPanel.jsx
// import React, { useEffect, useState } from "react";
// import api from "../../api/axiosInstance";
// import ServiceCard from "./ServiceCard";
// import { FaSearch, FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L from "leaflet";

// const CATEGORIES = ["Electrician", "Plumber", "Carpenter", "Cleaning", "Appliance"];

// // custom red pin icon
// const redIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// // helper for focusing map on hovered service
// function FlyToLocation({ coords }) {
//   const map = useMap();
//   useEffect(() => {
//     if (coords) map.flyTo(coords, 13, { duration: 0.5 });
//   }, [coords]);
//   return null;
// }

// export default function CustomerPanel() {
//   const [query, setQuery] = useState("");
//   const [location, setLocation] = useState("");
//   const [category, setCategory] = useState("");
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sort, setSort] = useState("recent");
//   const [hoveredCoords, setHoveredCoords] = useState(null);
//   const [lastFetchedAt, setLastFetchedAt] = useState(null);

//   const fetchServices = async (params = {}) => {
//     setLoading(true);
//     try {
//       // /api/services?category=&location=&q=
//       const res = await api.get("/api/services", { params });
//       setServices(res.data || []);
//       setLastFetchedAt(new Date());
//     } catch (e) {
//       console.error("fetch services", e);
//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices({});
//   }, []);

//   const onSearch = (e) => {
//     e?.preventDefault?.();
//     fetchServices({
//       category: category || undefined,
//       location: location || undefined,
//       q: query || undefined,
//       sort,
//     });
//   };

//   const clearFilters = () => {
//     setQuery("");
//     setLocation("");
//     setCategory("");
//     setSort("recent");
//     fetchServices({});
//   };

//   // convert service.location string → coordinates (dummy geocoding)
//   const parseCoords = (s) => {
//     // in real app use actual lat/lng from backend
//     const cities = {
//       Bhubaneswar: [20.2961, 85.8245],
//       Cuttack: [20.4625, 85.8828],
//       Delhi: [28.6139, 77.209],
//       Mumbai: [19.076, 72.8777],
//       Chennai: [13.0827, 80.2707],
//     };
//     for (const [city, coords] of Object.entries(cities)) {
//       if (s?.toLowerCase()?.includes(city.toLowerCase())) return coords;
//     }
//     // fallback random (Odisha area)
//     return [20.3 + Math.random() * 0.1, 85.8 + Math.random() * 0.1];
//   };

//   // precompute coordinates for map
//   const servicesWithCoords = services.map((s) => ({
//     ...s,
//     coords: parseCoords(s.location || ""),
//   }));

//   return (
//     <div className="mt-6 container mx-auto px-4">
//       <div className="grid grid-cols-12 gap-6">
//         {/* Sidebar */}
//         <aside className="col-span-12 md:col-span-3 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold">Find a service</h3>
//             <button
//               onClick={() =>
//                 fetchServices({
//                   category: category || undefined,
//                   location: location || undefined,
//                   q: query || undefined,
//                   sort,
//                 })
//               }
//               aria-label="Refresh services"
//               className="text-sm text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50 transition"
//               title="Refresh"
//             >
//               <FaSyncAlt />
//             </button>
//           </div>

//           <form onSubmit={onSearch} className="space-y-4" role="search" aria-label="Service search">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="What service do you need?"
//                 className="pl-10 w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
//                 aria-label="Service query"
//               />
//             </div>

//             <div className="relative">
//               <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Location (city / area)"
//                 className="pl-10 w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
//                 aria-label="Location"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium block mb-2">Category</label>
//               <div className="flex flex-wrap gap-2">
//                 {CATEGORIES.map((c) => (
//                   <button
//                     type="button"
//                     key={c}
//                     onClick={() => setCategory(c === category ? "" : c)}
//                     className={`px-3 py-1 rounded-full text-sm border transition ${
//                       category === c ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent" : "bg-gray-50 text-gray-700 border-gray-200"
//                     }`}
//                     aria-pressed={category === c}
//                     aria-label={`Filter by ${c}`}
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium block mb-2">Sort</label>
//               <select
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//                 className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
//                 aria-label="Sort services"
//               >
//                 <option value="recent">Most recent</option>
//                 <option value="price_asc">Price: low to high</option>
//                 <option value="price_desc">Price: high to low</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <button
//                 type="submit"
//                 className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 transition"
//                 aria-label="Search services"
//               >
//                 Search
//               </button>
//               <button
//                 type="button"
//                 onClick={clearFilters}
//                 className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
//                 aria-label="Clear filters"
//               >
//                 Clear
//               </button>
//             </div>

//             <div className="text-xs text-gray-500 pt-2">
//               <div>{loading ? "Loading..." : `${services.length} result${services.length !== 1 ? "s" : ""}`}</div>
//               {lastFetchedAt && <div className="mt-1">Last updated: {lastFetchedAt.toLocaleTimeString()}</div>}
//             </div>
//           </form>
//         </aside>

//         {/* Main content */}
//         <main className="col-span-12 md:col-span-9 space-y-6">
//           {/* Map */}
//           <div className="bg-white rounded-2xl shadow-md mb-2 overflow-hidden border border-gray-100">
//             <MapContainer
//               center={[20.2961, 85.8245]} // default center: Bhubaneswar
//               zoom={11}
//               style={{ height: "350px", width: "100%" }}
//               aria-label="Services map"
//             >
//               <TileLayer
//                 attribution='&copy; OpenStreetMap contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />

//               <FlyToLocation coords={hoveredCoords} />

//               {servicesWithCoords.map((s) => (
//                 <Marker key={s.id} position={s.coords} icon={redIcon}>
//                   <Popup>
//                     <div className="font-semibold">{s.category}</div>
//                     <div className="text-sm text-gray-600">{s.subcategory}</div>
//                     <div className="text-sm text-gray-500 mt-1">{s.location}</div>
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>

//           {/* Results list */}
//           <section className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-lg font-semibold text-gray-800">Services</h4>
//               <div className="text-sm text-gray-500">
//                 {loading ? "Loading..." : `${services.length} found`}
//               </div>
//             </div>

//             {loading && (
//               <div className="min-h-[120px] flex items-center justify-center">
//                 <div className="text-gray-600">Loading services…</div>
//               </div>
//             )}

//             {!loading && services.length === 0 ? (
//               <div className="text-center text-gray-500 py-8">
//                 No services found. Try clearing filters.
//               </div>
//             ) : (
//               <div className="grid gap-4">
//                 {servicesWithCoords.map((s) => (
//                   <div
//                     key={s.id}
//                     onMouseEnter={() => setHoveredCoords(s.coords)}
//                     onMouseLeave={() => setHoveredCoords(null)}
//                   >
//                     <ServiceCard service={s} />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ServiceCard from "./ServiceCard";
import { FaSearch, FaMapMarkerAlt, FaSyncAlt } from "react-icons/fa";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const CATEGORIES = ["Electrician", "Plumber", "Carpenter", "Cleaning", "Appliance"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 20.2961,
  lng: 85.8245,
};

export default function CustomerPanel() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedService, setSelectedService] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const fetchServices = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/api/services", { params });
      setServices(res.data || []);
      setLastFetchedAt(new Date());
    } catch (e) {
      console.error("fetch services", e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices({});
  }, []);

  const onSearch = (e) => {
    e?.preventDefault?.();
    fetchServices({
      category: category || undefined,
      location: location || undefined,
      q: query || undefined,
      sort,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setCategory("");
    setSort("recent");
    fetchServices({});
  };

  // Get user's current location
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        
        // Fetch services near this location
        fetchServices({
          lat: latitude,
          lng: longitude,
          radiusKm: 10,
          category: category || undefined,
          q: query || undefined,
          sort,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location");
      }
    );
  };

  return (
    <div className="mt-6 container mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Find a service</h3>
            <button
              onClick={() => fetchServices({ category: category || undefined, location: location || undefined, q: query || undefined, sort })}
              className="text-sm text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50 transition"
              title="Refresh"
            >
              <FaSyncAlt />
            </button>
          </div>

          <form onSubmit={onSearch} className="space-y-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What service do you need?"
                className="pl-10 w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (city / area)"
                className="pl-10 w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
              />
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center gap-2"
            >
              <FaMapMarkerAlt />
              Use My Location
            </button>

            <div>
              <label className="text-sm font-medium block mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c === category ? "" : c)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      category === c ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-transparent" : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition"
              >
                <option value="recent">Most recent</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>

            <div className="text-xs text-gray-500 pt-2">
              <div>{loading ? "Loading..." : `${services.length} result${services.length !== 1 ? "s" : ""}`}</div>
              {lastFetchedAt && <div className="mt-1">Last updated: {lastFetchedAt.toLocaleTimeString()}</div>}
            </div>
          </form>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 space-y-6">
          {/* Google Map */}
          <div className="bg-white rounded-2xl shadow-md mb-2 overflow-hidden border border-gray-100">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={12}
              >
                {services
                  .filter((s) => s.latitude && s.longitude)
                  .map((service) => (
                    <Marker
                      key={service.id}
                      position={{
                        lat: parseFloat(service.latitude),
                        lng: parseFloat(service.longitude),
                      }}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}

                {selectedService && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(selectedService.latitude),
                      lng: parseFloat(selectedService.longitude),
                    }}
                    onCloseClick={() => setSelectedService(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold">{selectedService.category}</h3>
                      <p className="text-sm text-gray-600">{selectedService.subcategory}</p>
                      <p className="text-sm mt-1">₹{selectedService.price}</p>
                      <p className="text-xs text-gray-500">{selectedService.location}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Results list */}
          <section className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Services</h4>
              <div className="text-sm text-gray-500">
                {loading ? "Loading..." : `${services.length} found`}
              </div>
            </div>

            {loading && (
              <div className="min-h-[120px] flex items-center justify-center">
                <div className="text-gray-600">Loading services…</div>
              </div>
            )}

            {!loading && services.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No services found. Try clearing filters or adjusting your search.
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    onMouseEnter={() => {
                      if (s.latitude && s.longitude) {
                        setMapCenter({
                          lat: parseFloat(s.latitude),
                          lng: parseFloat(s.longitude),
                        });
                      }
                    }}
                  >
                    <ServiceCard service={s} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}