import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { UserPlus, Mail, Lock, User, Zap } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      await register(fullname, email, password);
      navigate("/login");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden p-4 md:p-10">
      {/* Background Image with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <img 
          src="src/assets/image/american-football-player-wearing-equipment.jpg" 
          className="w-full h-full object-cover opacity-40 scale-110 animate-ken-burns scale-x-[-1]"
          alt=""
        />
        {/* Mirror the gradient as well to match Login */}
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/40 via-black/60 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row-reverse items-center justify-center gap-10 lg:gap-20">
        
        {/* Right Side: Brand Identity (Mirror of Login Left side) */}
        <div className="hidden lg:block flex-1 space-y-4 text-right animate-in slide-in-from-right duration-1000">
          <div className="flex items-center justify-end gap-3 text-blue-500 font-black tracking-[0.4em] uppercase text-sm mb-4">
             <span>Official Recruitment</span> <Zap size={20} fill="currentColor" />
          </div>
          <h1 className="text-8xl xl:text-9xl font-black italic text-white leading-[0.8] tracking-tighter uppercase drop-shadow-2xl">
            JOIN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-500 to-cyan-400">THE CLUB</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-lg max-w-sm ml-auto border-r-4 border-blue-600 pr-6">
            Start Your Professional Journey.
          </p>
        </div>

        {/* Left Side: Blur Form Card */}
        <div className="w-full max-w-[500px] glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Register</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2">Start your legacy today</p>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type="text" value={fullname} onChange={(e) => setFullname(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-bold backdrop-blur-md"
                  placeholder="John Mark"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-bold backdrop-blur-md"
                  placeholder="player@pro.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-bold backdrop-blur-md text-sm"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500">
                  {showPassword ? <FaRegEyeSlash size={20}/> : <FaRegEye size={20}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs skew-x-[-10deg] mt-4 shadow-xl">
              <div className="skew-x-[10deg] flex items-center gap-2"><UserPlus size={18}/> Create Profile</div>
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">
            ALREADY IN THE TEAM? <Link to="/login" className="text-blue-500 italic ml-1 hover:underline">Log In</Link>
          </p>
        </div>
      </div>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
        }
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        .animate-ken-burns {
          animation: kenburns 20s ease infinite alternate;
        }
      `}</style>
    </div>
  );
}