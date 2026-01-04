import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import HomeTemplate from "../components/HomeTemplate";
import { Rocket, Plus, Users, Calendar, Trophy, Zap } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);

  const images = [
    "src/assets/image/soccer-players-action-professional-stadium.jpg",
    "src/assets/image/american-football-players-wearing-equipment.jpg",
    "src/assets/image/cricket-batsman.jpg",
    "src/assets/image/close-up-athlete-playing-soccer.jpg",
    "src/assets/image/medium-shot-victorious-gamers-winning.jpg",
  ];

  const hasRole = (role: string) => user?.roles?.includes(role) || false;
  const isPlayer = hasRole("PLAYER");
  const isOrganizer = hasRole("ORGANIZER");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      
      {/* 🏟️ FULL SCREEN HERO SECTION */}
      {/* Header එක සඳහා mt-[150px] ලබා දී ඇති අතර උස h-[calc(100vh-150px)] ලෙස සකසා ඇත */}
      <div className="relative w-full h-[calc(100vh-150px)] flex items-center overflow-hidden bg-black mt-[150px]">
        
        {/* Animated Background Images with Ken Burns Effect */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              current === index ? "opacity-70 scale-110 visible" : "opacity-0 scale-100 invisible"
            }`}
            style={{ 
                transition: 'opacity 1.5s ease-in-out, transform 10s linear',
                transformOrigin: 'center center'
            }}
          >
            <img src={img} className="w-full h-full object-cover" alt="Sports Background" />
          </div>
        ))}

        {/* Dynamic Overlays for Better Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-1"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-1"></div>

        {/* Hero Content Area */}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-3 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 px-4 py-2 rounded-full text-blue-400 font-black tracking-[0.3em] uppercase text-[10px] animate-bounce">
              <Zap size={14} fill="currentColor" />
              <span>Unleash Your Potential</span>
            </div>
            
            {/* Massive Sports Headline */}
            <h2 className="text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.85] italic tracking-tighter drop-shadow-2xl">
              BUILD YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400">
                FUTURE DREAM
              </span>
            </h2>
            
            {/* Impactful Description */}
            <p className="text-gray-200 text-sm md:text-lg font-medium max-w-2xl leading-relaxed border-l-4 border-blue-600 pl-6 backdrop-blur-[2px] py-2">
              The ultimate arena where elite athletes connect with professional organizers. 
              Discover matches, build powerful teams, and transform your sports passion into a professional reality.
            </p>

            {/* Skewed Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              
              {/* Conditional Button: Create Team (For Players/Users) */}
              {user && !isOrganizer && (
                <button className="group relative flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-sm skew-x-[-12deg] transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
                  <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-widest text-sm">
                    <Users size={20} /> CREATE TEAM <Plus size={18} />
                  </div>
                </button>
              )}

              {/* Conditional Button: Publish Event (For Organizers) */}
              {user && isOrganizer && (
                <button className="group relative flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-5 rounded-sm skew-x-[-12deg] transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95">
                  <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-widest text-sm">
                    <Calendar size={20} /> PUBLISH EVENT
                  </div>
                </button>
              )}

              {/* Secondary Explore Button */}
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black px-10 py-5 rounded-sm skew-x-[-12deg] border border-white/20 transition-all active:scale-95 group">
                <div className="skew-x-[12deg] flex items-center gap-3 uppercase tracking-widest text-sm">
                  <Trophy size={20} className="group-hover:text-yellow-400 transition-colors" /> EXPLORE NOW
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Line Indicators */}
        <div className="absolute bottom-10 left-10 right-10 flex gap-3 z-20">
          {images.map((_, i) => (
            <div key={i} className="h-[4px] flex-1 bg-white/10 rounded-full overflow-hidden">
               <div 
                 className={`h-full bg-blue-500 transition-none ${current === i ? "animate-progress" : "w-0"}`}
                 style={{ animationDuration: '6000ms' }}
               ></div>
            </div>
          ))}
        </div>
      </div>
        
      <div className="max-w-[800px] mx-auto">
        <HomeTemplate />
      </div>


      {/* CSS For Progress Animation */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation-name: progress;
          animation-timing-function: linear;
        }
      `}</style>

    </div>
  );
}