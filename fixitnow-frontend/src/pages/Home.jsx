
import React from "react";
import ElectricianImg from "../assets/Electrician.jpg";
import PlumberImg from "../assets/Plumber.jpg";
import CarpenterImg from "../assets/Carpenter.jpg";
import CleaningImg from "../assets/cleaning.jpg";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      {/* Header Section */}
      <div className="text-center mb-12 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm mb-3">
          Welcome to FixitNow
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
          Reliable home services at your fingertips. Book experts instantly and get your work done hassle-free!
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-12">
        {services.map((s, i) => (
          <div
            key={i}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-indigo-200 cursor-pointer"
          >
            <div className="relative">
              <img
                src={s.img}
                alt={s.title}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition"
              />
              <div className="absolute inset-0 rounded-2xl bg-indigo-600/0 group-hover:bg-indigo-600/10 transition"></div>
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-indigo-700 mt-5">
              {s.title}
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base leading-relaxed">
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer / Tagline */}
      <div className="text-center mt-14 text-gray-500 text-sm">
        <p>⚙️ Expert services. Trusted professionals. Anytime, anywhere.</p>
      </div>
    </div>
  );
}
