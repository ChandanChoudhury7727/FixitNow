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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-10">
      <div className="w-full max-w-full mx-auto text-center mb-8 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-3">
          Welcome to FixitNow
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Reliable home services at your fingertips. Book experts instantly!
        </p>
      </div>

      {/* Service Tiles */}
      <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-12">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition transform cursor-pointer min-h-[220px]"
          >
            <img
              src={s.img}
              alt={s.title}
              className="w-28 h-28 md:w-36 md:h-36 mb-4 object-cover rounded-lg"
            />
            <h2 className="text-lg md:text-xl font-semibold text-green-700">
              {s.title}
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
