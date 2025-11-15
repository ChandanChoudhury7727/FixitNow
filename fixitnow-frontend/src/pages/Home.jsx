
import React from "react";
import ElectricianImg from "../assets/Electrician.jpg";
import PlumberImg from "../assets/Plumber.jpg";
import CarpenterImg from "../assets/Carpenter.jpg";
import CleaningImg from "../assets/cleaning.jpg";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "⚡ Electrician",
    desc: "Quick fixes & wiring solutions",
    img: ElectricianImg,
  },
  {
    title: "🔧 Plumbing",
    desc: "Pipes, leaks & bathroom repairs",
    img: PlumberImg,
  },
  {
    title: "🪚 Carpenter",
    desc: "Furniture repair & woodwork",
    img: CarpenterImg,
  },
  {
    title: "🧹 Cleaning",
    desc: "Home & office deep cleaning",
    img: CleaningImg,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-12">
        <div className="inline-block bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm mb-4 shadow-sm">
          Trusted • Local • Fast
        </div>

        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
          Welcome to <span className="text-indigo-800">Fixit</span>
          <span className="text-yellow-400">Now</span>
        </h1>

        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Reliable home services at your fingertips. Book vetted experts instantly and get your work done — hassle-free and on time.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => navigate("/customer-panel")}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-0.5 transition"
          >
            Browse Services
            <span className="text-sm opacity-90">→</span>
          </button>

          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 hover:shadow-md transition"
          >
            Become a Provider
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Available in your city • Safe & insured professionals
        </div>
      </header>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
          Popular Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => (
            <article
              key={i}
              onClick={() =>
                navigate(
                  "/customer-panel?category=" +
                    encodeURIComponent(s.title.replace(/[^a-zA-Z]/g, ""))
                )
              }
              className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  className="object-cover w-full h-full transform group-hover:scale-105 transition"
                />
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-indigo-700 mt-5">
                {s.title}
              </h3>

              <p className="text-gray-500 mt-2 text-sm md:text-base leading-relaxed">
                {s.desc}
              </p>

              {/* Decorative bar only (buttons removed) */}
              <div className="pointer-events-none absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-2 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full opacity-60"></div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer / Tagline */}
        <div className="text-center mt-14 text-gray-500 text-sm">
          <p>⚙️ Expert services. Trusted professionals. Anytime, anywhere.</p>
        </div>
      </section>
    </main>
  );
}
