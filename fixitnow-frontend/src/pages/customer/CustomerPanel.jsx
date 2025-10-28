// import React, { useEffect, useState } from "react";
// import api from "../../api/axiosInstance";
// import ServiceCard from "./ServiceCard";
// import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

// const CATEGORIES = ["Electrician","Plumber","Carpenter","Cleaning","Appliance"];

// export default function CustomerPanel(){
//   const [query, setQuery] = useState("");
//   const [location, setLocation] = useState("");
//   const [category, setCategory] = useState("");
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sort, setSort] = useState("recent"); // or price_asc

//   const fetchServices = async (params={})=>{
//     setLoading(true);
//     try{
//       // Example: /api/services?category=Plumber&location=Bhubaneswar&q=wire
//       const res = await api.get("/api/services", { params });
//       setServices(res.data || []);
//     }catch(e){
//       console.error("fetch services", e);
//       setServices([]);
//     }finally{ setLoading(false); }
//   };

//   useEffect(()=> {
//     fetchServices({}); // initial
//   }, []);

//   const onSearch = (e) => {
//     e?.preventDefault?.();
//     fetchServices({ category: category || undefined, location: location || undefined, q: query || undefined, sort });
//   };

//   const clearFilters = () => {
//     setQuery(""); setLocation(""); setCategory(""); setSort("recent");
//     fetchServices({});
//   };

//   return (
//     <div className="mt-6 container mx-auto">
//       <div className="grid grid-cols-12 gap-6">
//         {/* Left sidebar */}
//         <aside className="col-span-12 md:col-span-3 bg-white p-4 rounded-xl shadow">
//           <h3 className="text-lg font-semibold mb-3">Find a service</h3>

//           <form onSubmit={onSearch} className="space-y-3">
//             <div className="relative">
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 value={query}
//                 onChange={e=>setQuery(e.target.value)}
//                 placeholder="What service do you need?"
//                 className="pl-10 w-full border rounded-md px-3 py-2"
//               />
//             </div>

//             <div className="relative">
//               <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 value={location}
//                 onChange={e=>setLocation(e.target.value)}
//                 placeholder="Location (city / area)"
//                 className="pl-10 w-full border rounded-md px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Category</label>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {CATEGORIES.map(c => (
//                   <button
//                     type="button"
//                     key={c}
//                     onClick={() => setCategory(c === category ? "" : c)}
//                     className={`px-3 py-1 rounded-full text-sm border ${category===c ? 'bg-green-600 text-white' : 'bg-gray-50 text-gray-700'}`}
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="text-sm font-medium">Sort</label>
//               <select value={sort} onChange={e=>setSort(e.target.value)} className="w-full border rounded-md px-3 py-2">
//                 <option value="recent">Most recent</option>
//                 <option value="price_asc">Price: low to high</option>
//                 <option value="price_desc">Price: high to low</option>
//               </select>
//             </div>

//             <div className="flex gap-2">
//               <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Search</button>
//               <button type="button" onClick={clearFilters} className="px-3 py-2 border rounded">Clear</button>
//             </div>
//           </form>
//         </aside>

//         {/* Main content */}
//         <main className="col-span-12 md:col-span-9">
//           {/* Map placeholder */}
//           <div className="bg-white rounded-xl shadow p-4 mb-6">
//             <div className="h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">Map placeholder (integrate later)</div>
//           </div>

//           {/* Results */}
//           <div className="bg-white rounded-xl shadow p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h4 className="text-lg font-semibold">Services</h4>
//               <div className="text-sm text-gray-500">{loading ? "Loading..." : `${services.length} found`}</div>
//             </div>

//             {services.length === 0 && !loading ? (
//               <div className="text-center text-gray-500 py-8">No services found. Try clearing filters.</div>
//             ) : (
//               <div className="grid gap-4">
//                 {services.map(s => <ServiceCard key={s.id} service={s} />)}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import ServiceCard from "./ServiceCard";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const CATEGORIES = ["Electrician","Plumber","Carpenter","Cleaning","Appliance"];

// custom red pin icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// helper for focusing map on hovered service
function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, 13, { duration: 0.5 });
  }, [coords]);
  return null;
}

export default function CustomerPanel() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("recent");
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const fetchServices = async (params = {}) => {
    setLoading(true);
    try {
      // /api/services?category=&location=&q=
      const res = await api.get("/api/services", { params });
      setServices(res.data || []);
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

  // convert service.location string → coordinates (dummy geocoding)
  const parseCoords = (s) => {
    // in real app use actual lat/lng from backend
    const cities = {
      Bhubaneswar: [20.2961, 85.8245],
      Cuttack: [20.4625, 85.8828],
      Delhi: [28.6139, 77.209],
      Mumbai: [19.076, 72.8777],
      Chennai: [13.0827, 80.2707],
    };
    for (const [city, coords] of Object.entries(cities)) {
      if (s?.toLowerCase()?.includes(city.toLowerCase())) return coords;
    }
    // fallback random (Odisha area)
    return [20.3 + Math.random() * 0.1, 85.8 + Math.random() * 0.1];
  };

  // precompute coordinates for map
  const servicesWithCoords = services.map((s) => ({
    ...s,
    coords: parseCoords(s.location || ""),
  }));

  return (
    <div className="mt-6 container mx-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-3">Find a service</h3>
          <form onSubmit={onSearch} className="space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What service do you need?"
                className="pl-10 w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (city / area)"
                className="pl-10 w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c === category ? "" : c)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      category === c
                        ? "bg-green-600 text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="recent">Most recent</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Search
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 border rounded"
              >
                Clear
              </button>
            </div>
          </form>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9">
          {/* Map */}
          <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
            <MapContainer
              center={[20.2961, 85.8245]} // default center: Bhubaneswar
              zoom={11}
              style={{ height: "350px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <FlyToLocation coords={hoveredCoords} />

              {servicesWithCoords.map((s) => (
                <Marker key={s.id} position={s.coords} icon={redIcon}>
                  <Popup>
                    <div className="font-semibold">{s.category}</div>
                    <div>{s.subcategory}</div>
                    <div className="text-sm text-gray-600">{s.location}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Results list */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Services</h4>
              <div className="text-sm text-gray-500">
                {loading ? "Loading..." : `${services.length} found`}
              </div>
            </div>

            {services.length === 0 && !loading ? (
              <div className="text-center text-gray-500 py-8">
                No services found. Try clearing filters.
              </div>
            ) : (
              <div className="grid gap-4">
                {servicesWithCoords.map((s) => (
                  <div
                    key={s.id}
                    onMouseEnter={() => setHoveredCoords(s.coords)}
                    onMouseLeave={() => setHoveredCoords(null)}
                  >
                    <ServiceCard service={s} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

