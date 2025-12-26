import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import Button from "../components/Button";
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
        // මෙහිදී ඔබේ Backend එකට දත්ත යැවීමේ logic එක ඇතුළත් කළ හැක.
        console.log("Form Submitted:", formData);
        
        showAlert({
            icon: "success",
            title: "Message Sent!",
            text: "Thank you for contacting us. We will get back to you soon.",
        });

        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="mt-[150px] min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl uppercase tracking-tighter">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 font-medium">
                        ඔබට ඇති ඕනෑම ගැටලුවක් හෝ අදහසක් අප වෙත යොමු කරන්න.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* 📞 Contact Information Cards */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase italic">Contact Information</h2>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                        <p className="text-lg font-bold text-gray-800">+94 71 234 5678</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</p>
                                        <p className="text-lg font-bold text-gray-800">support@myteam.lk</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 p-3 rounded-2xl text-red-600">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Office</p>
                                        <p className="text-lg font-bold text-gray-800">123 Sports Avenue, Colombo 07, Sri Lanka</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media or Additional Info */}
                        <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-100">
                            <h3 className="text-xl font-black uppercase mb-2">Live Support</h3>
                            <p className="text-blue-100 mb-4">අපගේ සහය සේවාව සතියේ සෑම දිනකම පෙ.ව 8.00 සිට ප.ව 8.00 දක්වා ක්‍රියාත්මකයි.</p>
                            <Button color="white" className="w-full font-bold">
                                <p className="text-black">Chat with us</p>
                            </Button>
                        </div>
                    </div>

                    {/* ✉️ Contact Form Section */}
                    <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none"
                                    placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center items-center gap-2 bg-black text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-gray-200"
                            >
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}