
// import React, { useEffect, useRef, useState } from "react";
// import api from "../../api/axiosInstance";

// export default function ReviewModal({ booking, onClose, onSuccess }) {
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const dialogRef = useRef(null);
//   const firstButtonRef = useRef(null);

//   useEffect(() => {
//     // focus first actionable item for keyboard users
//     firstButtonRef.current?.focus();

//     const onKey = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [onClose]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);

//     try {
//       await api.post("/api/reviews", {
//         bookingId: booking.id,
//         rating: rating,
//         comment: comment.trim()
//       });

//       // keep existing behavior: show browser alert then call callbacks
//       alert("Review submitted successfully!");
//       if (onSuccess) onSuccess();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to submit review");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="review-modal-title"
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//     >
//       {/* backdrop */}
//       <div className="absolute inset-0 bg-black/50" onClick={onClose} />

//       <div
//         ref={dialogRef}
//         className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 z-10"
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h3 id="review-modal-title" className="text-xl font-semibold text-gray-800">
//             Leave a Review
//           </h3>

//           <button
//             onClick={onClose}
//             aria-label="Close review dialog"
//             className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
//             ref={firstButtonRef}
//           >
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
//           {/* Star Rating */}
//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
//             <div className="flex items-center gap-3">
//               <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
//                 {[1, 2, 3, 4, 5].map((star) => {
//                   const selected = star <= rating;
//                   return (
//                     <button
//                       key={star}
//                       type="button"
//                       onClick={() => setRating(star)}
//                       aria-pressed={selected}
//                       aria-label={`${star} star${star > 1 ? "s" : ""}`}
//                       className={`text-3xl transition-transform transform ${selected ? "scale-105" : ""} focus:outline-none`}
//                     >
//                       {selected ? <span className="text-yellow-400">★</span> : <span className="text-gray-300">☆</span>}
//                     </button>
//                   );
//                 })}
//               </div>

//               <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
//             </div>
//           </div>

//           {/* Comment */}
//           <div>
//             <label className="block text-sm font-medium mb-2 text-gray-700">Your Review (optional)</label>
//             <textarea
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//               placeholder="Share your experience with this service..."
//               className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 outline-none transition"
//               rows={4}
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm" role="alert">
//               {error}
//             </div>
//           )}

//           {/* Buttons */}
//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={submitting}
//               className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
//             >
//               {submitting ? "Submitting..." : "Submit Review"}
//             </button>

//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// UI-only changes — safe to replace
// src/pages/customer/ReviewModal.jsx
// Visual / accessibility improvements only. No logic or network behavior changed.

import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axiosInstance";

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);
  const firstButtonRef = useRef(null);

  useEffect(() => {
    // focus first actionable item for keyboard users
    firstButtonRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post("/api/reviews", {
        bookingId: booking.id,
        rating: rating,
        comment: comment.trim(),
      });

      // preserve original behavior
      alert("Review submitted successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 z-10 ring-1 ring-black/5"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 id="review-modal-title" className="text-xl font-semibold text-gray-800">
              Leave a Review
            </h3>
            <p className="text-xs text-gray-500 mt-1">Share feedback to help improve the service.</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close review dialog"
            className="text-gray-400 hover:text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-100"
            ref={firstButtonRef}
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
            <div className="flex items-center gap-3">
              <div
                className="flex gap-1"
                role="radiogroup"
                aria-label="Star rating"
                tabIndex={-1}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const selected = star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-pressed={selected}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className={`text-3xl transition-transform transform ${selected ? "scale-105" : ""} focus:outline-none focus:ring-2 focus:ring-indigo-100 rounded`}
                    >
                      {selected ? <span className="text-yellow-400">★</span> : <span className="text-gray-300">☆</span>}
                    </button>
                  );
                })}
              </div>

              <span className="ml-2 text-sm text-gray-600" aria-live="polite">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium mb-2 text-gray-700">
              Your Review (optional)
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this service..."
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 focus:ring-4 focus:ring-indigo-100 outline-none transition min-h-[96px] resize-y"
              rows={4}
            />
            <div className="text-xs text-gray-400 mt-1">Be constructive — feedback helps providers improve.</div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
