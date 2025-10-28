import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = { width: '100%', height: '600px' };
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

export default function MapSearch() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const inputRef = useRef(null);
  const mapRef = useRef();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {});

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;
      const loc = place.geometry.location;
      const lat = loc.lat();
      const lng = loc.lng();
      setMapCenter({ lat, lng });
      fetchServices(lat, lng, radiusKm);
    });

    return () => {
      if (inputRef.current) window.google.maps.event.clearInstanceListeners(inputRef.current);
    };
  }, [isLoaded, radiusKm]);

  async function fetchServices(lat, lng, radius) {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString(), radiusKm: radius.toString() });
      const res = await fetch(`${base}/api/services?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="p-4">
      <div className="mb-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search location (autocomplete)"
          className="border rounded px-2 py-1 w-96"
        />
        <label className="flex items-center gap-2">
          Radius (km):
          <input
            type="number"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-20 border rounded px-2 py-1"
          />
        </label>
        <button
          onClick={() => {
            fetchServices(mapCenter.lat, mapCenter.lng, radiusKm);
          }}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </div>

      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={mapCenter} onLoad={onMapLoad}>
        {services.map((s) => (
          s.latitude && s.longitude ? (
            <Marker key={s.id} position={{ lat: Number(s.latitude), lng: Number(s.longitude) }} onClick={() => setSelected(s)} />
          ) : null
        ))}

        {selected && (
          <InfoWindow position={{ lat: Number(selected.latitude), lng: Number(selected.longitude) }} onCloseClick={() => setSelected(null)}>
            <div style={{ maxWidth: 240 }}>
              <h4 className="font-semibold">{selected.category} — {selected.subcategory}</h4>
              <div>Provider: {selected.providerName || selected.providerId}</div>
              <div>Price: {selected.price}</div>
              <div style={{ marginTop: 8 }}>
                <a href={`/services/${selected.id}`} className="text-blue-600 underline">View details</a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
