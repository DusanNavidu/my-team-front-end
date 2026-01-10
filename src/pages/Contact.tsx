import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Zap, Globe, Clock, MessageCircle } from "lucide-react";
import { showAlert } from "../components/Swail";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        
        showAlert({
            icon: "success",
            title: "STRATEGY RECEIVED!",
            text: "Your tactical query has been transmitted to our arena support team.",
        });

        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="relative min-h-screen w-full bg-zinc-950 text-white overflow-hidden pt-[120px] pb-10">
            
            <div className="absolute inset-0 z-0">
                <img 
                    src={"https://i.ibb.co/TDV1LcmP/soccer-players-action-professional-stadium.jpg"} 
                    className="w-full h-full object-cover opacity-25 animate-ken-burns"
                    alt="Stadium"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-zinc-950" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 backdrop-blur-md border border-blue-500/30 text-blue-400 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                        <Zap size={12} fill="currentColor" /> The Support Arena
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">
                        GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">TOUCH</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* 📞 Contact Info - Left Side (Compact Cards) */}
                    <div className="lg:col-span-5 space-y-4 animate-in slide-in-from-left duration-1000">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {/* Phone Card - Reduced Padding */}
                            <div className="glass-card p-4 rounded-2xl border border-white/5 group hover:border-blue-500/50 transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Phone size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Direct Line</p>
                                        <p className="text-lg font-black text-white">+94 71 234 5678</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Card - Reduced Padding */}
                            <div className="glass-card p-4 rounded-2xl border border-white/5 group hover:border-cyan-500/50 transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="bg-cyan-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Mail size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Tactical Email</p>
                                        <p className="text-lg font-black text-white">support@myteam.lk</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🏢 Location Card - Compact */}
                        <div className="bg-zinc-900/80 backdrop-blur-md p-6 rounded-[2rem] text-white relative overflow-hidden group border border-white/5 shadow-xl">
                            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <Globe size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-black uppercase italic mb-3 flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" /> HQ Base
                                </h3>
                                <p className="text-zinc-400 text-sm font-bold leading-snug mb-4">
                                    123 Sports Avenue, <br /> Colombo 07, Sri Lanka
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
                                    <Clock size={14} /> Mon - Sun: 08:00 - 20:00
                                </div>
                            </div>
                        </div>

                        {/* 🏢 CTA Card - Compact */}
                        <div className="bg-blue-600 p-6 rounded-[2rem] relative overflow-hidden group shadow-lg">
                            <div className="absolute -right-8 -bottom-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                                <MessageCircle size={140} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black uppercase italic mb-1 tracking-tighter">Live Chat</h3>
                                <p className="text-blue-100 text-xs font-bold mb-4">Real-time tactical help.</p>
                                <button className="bg-white text-blue-600 font-black uppercase text-[9px] tracking-widest px-6 py-2 rounded-lg hover:bg-zinc-900 hover:text-white transition-all active:scale-95">
                                    Start Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ✉️ Form Section - Right Side */}
                    <div className="lg:col-span-7 animate-in slide-in-from-right duration-1000">
                        <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 italic">
                                SEND A <span className="text-blue-500">MESSAGE</span>
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Name</label>
                                        <input
                                            type="text" name="name" required value={formData.name} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Email</label>
                                        <input
                                            type="email" name="email" required value={formData.email} onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                                            placeholder="pro@myteam.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Subject</label>
                                    <input
                                        type="text" name="subject" required value={formData.subject} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                                        placeholder="Subject of Query"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-2">Message Brief</label>
                                    <textarea
                                        name="message" rows={4} required value={formData.message} onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-sm resize-none"
                                        placeholder="Tactical brief..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.1em] py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-900/40 skew-x-[-10deg]"
                                >
                                    <div className="skew-x-[10deg] flex items-center gap-2 text-xs">
                                        TRANSMIT <Send size={16} />
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.04);
                    backdrop-filter: blur(12px) saturate(160%);
                    -webkit-backdrop-filter: blur(12px) saturate(160%);
                }
                @keyframes kenburns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-ken-burns {
                    animation: kenburns 20s ease infinite alternate;
                }
            `}</style>
        </div>
    );
}