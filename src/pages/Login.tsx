import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { login, getMyDetails } from "../service/auth";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LogIn, Mail, Lock, Zap } from "lucide-react";
import { showAlert } from "../components/Swail";
import stadiumBg from "../assets/image/soccer-players-action-professional-stadium.jpg";

export default function Login() {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const data: any = await login(username, password);

      if (data?.status === 403 || data?.message === "User is not active") {
        showAlert({
          icon: "error",
          title: "Account Deactivated",
          text: "Your account has been deactivated. Please contact support.",
        });
        setErrorMessage("Login failed: account is deactivated.");
        setIsLoading(false);
        return;
      }

      if (data?.data?.accessToken) {
        await localStorage.setItem("accessToken", data.data.accessToken);
        await localStorage.setItem("refreshToken", data.data.refreshToken);

        const resData = await getMyDetails();
        setUser(resData.data);

        const roles: string[] = resData.data.roles || [];

        if (roles.includes("ADMIN")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("ORGANIZER") || roles.includes("PLAYER") || roles.includes("USER")) {
          navigate("/home");
        } else {
          setErrorMessage("Invalid user role detected.");
        }
      } else {
        setErrorMessage("Invalid credentials, please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.status === 403) {
        setErrorMessage("Your account is deactivated.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden p-4 md:p-10">
      <div className="absolute inset-0 z-0">
      <img 
        src={stadiumBg} 
        className="w-full h-full object-cover opacity-40 scale-110 animate-ken-burns"
        alt="Stadium Background"
      />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black/60 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
        
        <div className="hidden lg:block flex-1 space-y-4 text-left animate-in slide-in-from-left duration-1000">
          <div className="flex items-center gap-3 text-blue-500 font-black tracking-[0.4em] uppercase text-sm mb-4">
            <Zap size={20} fill="currentColor" /> <span>The Elite Arena</span>
          </div>
          <h1 className="text-8xl xl:text-9xl font-black italic text-white leading-[0.8] tracking-tighter uppercase drop-shadow-2xl">
            STEP <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">INSIDE</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-lg max-w-sm border-l-4 border-blue-600 pl-6">
            Your Sports Legacy Starts Here.
          </p>
        </div>

        <div className="w-full max-w-[500px] glass-card p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl animate-in zoom-in duration-500">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Login</h2>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2">Welcome back, Athlete!</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500" size={18} />
                <input 
                  type="email" value={username} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all font-bold backdrop-blur-md"
                  placeholder="name@arena.com"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 transition-colors group-focus-within:text-blue-500">Secret Password</label>
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

            {errorMessage && (
                <p className="text-red-500 text-xs font-bold uppercase tracking-tight text-center animate-pulse">{errorMessage}</p>
            )}

            <button 
                type="button" 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs skew-x-[-10deg] disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="skew-x-[10deg] flex items-center gap-2">
                <LogIn size={18}/> {isLoading ? "Authenticating..." : "Authenticate"}
              </div>
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-gray-500">
            NOT REGISTERED? <Link to="/register" className="text-blue-500 italic uppercase ml-1 hover:underline tracking-widest">Join Team</Link>
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