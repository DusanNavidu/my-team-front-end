import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Rocket, UserPlus } from "lucide-react";
import stadium1 from "../assets/image/soccer-game-concept.jpg";
import stadium2 from "../assets/image/cricket-match-with-player.jpg";
import stadium3 from "../assets/image/cyclist-riding-bicycle-nature.jpg";

export default function Index() {
  const images = [
    stadium1,
    stadium2,
    stadium3
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Slider with Ken Burns Effect */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-60 scale-110" : "opacity-0 scale-100"
          }`}
          style={{ transition: 'opacity 1.5s ease-in-out, transform 10s linear' }}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

      {/* Content Area */}
      <div className="relative z-20 container mx-auto h-full flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-8 animate-in fade-in zoom-in duration-1000">
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-2xl">
            MY <span className="text-blue-500">TEAM</span>
          </h1>
          
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/10">
            "My Team" is the definitive digital hub for the sports enthusiast. Get real-time live scores, access in-depth player profiles, career stats, and breaking news in one streamlined arena.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/login">
              <button className="group relative flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-sm skew-x-[-12deg] transition-all shadow-xl active:scale-95">
                <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-widest text-lg">
                  <Rocket size={24} /> Get Started
                </div>
              </button>
            </Link>
            
            <Link to="/register">
              <button className="group relative flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black px-12 py-5 rounded-sm skew-x-[-12deg] border border-white/20 transition-all active:scale-95">
                <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-widest text-lg">
                  <UserPlus size={24} /> Register
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}