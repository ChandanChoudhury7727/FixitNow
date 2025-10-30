
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ServiceDetail(){
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00-10:00');
  const [notes, setNotes] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchService();
  }, [id]);

  async function fetchService(){
    try{
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${base}/api/services/${id}`);
      if (!res.ok) throw new Error('Service not found');
      const data = await res.json();
      setService(data);
    }catch(err){
      setMessage({ type: 'error', text: err.message });
    }
  }

  async function submitBooking(e){
    e.preventDefault();
    setMessage(null);
    try{
      if (!customerId) return setMessage({ type:'error', text:'Enter customerId (or login first)' });
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const payload = { serviceId: Number(id), customerId: Number(customerId), bookingDate: date, timeSlot, notes };
      const res = await fetch(`${base}/api/bookings`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Booking failed');
      setMessage({ type:'success', text: 'Booking created (id: ' + json.bookingId + ')' });
      // optional: navigate to my bookings
      // navigate('/my-bookings');
    }catch(err){
      setMessage({ type:'error', text: err.message });
    }
  }

  if (!service) return <div className="p-4">Loading service...</div>;

  return (
    <div className="p-4 max-w-3xl">
      <h2 className="text-2xl font-bold mb-2">{service.category} — {service.subcategory}</h2>
      <div className="mb-4">Provider: {service.providerName} ({service.providerEmail})</div>
      <div className="mb-4">Price: {service.price}</div>
      <div className="mb-4">Location: {service.location} {service.latitude && service.longitude ? `(${service.latitude}, ${service.longitude})` : ''}</div>
      <div className="mb-4">Description: <div className="border p-2 rounded">{service.description}</div></div>

      <h3 className="text-xl font-semibold mt-6">Provider profile</h3>
      <div className="mb-4">{service.providerProfileDescription}</div>
      <div className="mb-4">Categories: {service.providerProfileCategories}</div>

      <h3 className="text-xl font-semibold mt-6">Reviews (avg {service.avgRating})</h3>
      <div className="mb-4">
        {service.reviews && service.reviews.length ? (
          <ul>
            {service.reviews.map(r => (
              <li key={r.id} className="border-b py-2">
                <div>Rating: {r.rating}</div>
                <div>{r.comment}</div>
                <div className="text-sm text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : <div>No reviews yet</div>}
      </div>

      <h3 className="text-xl font-semibold mt-6">Book this service</h3>
      <form onSubmit={submitBooking} className="space-y-3">
        <div>
          <label className="block">Your customerId (use a real user id or login)</label>
          <input value={customerId} onChange={e=>setCustomerId(e.target.value)} className="border rounded p-2 w-48" />
        </div>
        <div>
          <label className="block">Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border rounded p-2" />
        </div>
        <div>
          <label className="block">Time slot</label>
          <input value={timeSlot} onChange={e=>setTimeSlot(e.target.value)} className="border rounded p-2 w-48" />
        </div>
        <div>
          <label className="block">Notes</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Request Booking</button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-2 rounded ${message.type==='error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

