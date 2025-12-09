// src/components/Header.tsx (FINAL FIX - lg Breakpoint and User Info Visible)

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/authContext"
import React, { useState } from "react";
import { Menu, X } from 'lucide-react'; 

export default function Header() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation(); 
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        navigate("/login")
    }

    const hasRole = (role: string) => {
        return user?.roles?.includes(role) || false;
    };

    const isPlayer = hasRole('PLAYER');
    const isOrganizer = hasRole('ORGANIZER');
    const isUser = hasRole('USER'); 

    const hideTopButtons = location.pathname === "/organizer-register";
    const userIsLoggedIn = !!user;

    const showCreatePlayer = userIsLoggedIn && !hideTopButtons && !isPlayer && isUser;
    const showCreateOrganizer = userIsLoggedIn && !hideTopButtons && !isOrganizer && isUser;
    const showJoinTeam = userIsLoggedIn && !hideTopButtons && !isPlayer && !isOrganizer && isUser;


    return (
        // 💡 FIX 1: Header height is kept at h-[150px] for all sizes above mobile. 
        // We use md:h-[75px] for small screens to prevent unnecessary space.
        <header className="w-full h-[150px] bg-gray-900 fixed top-0 left-0 z-4 p-4 shadow-md flex">

            <div className="flex flex-col space-y-2 container mx-auto">
                
                {/* --- Top Row: Logo, Action Buttons, Hamburger --- */}
                <div className="flex space-x-4 justify-between items-center h-auto">
                    
                    <h1 className="text-3xl lg:text-5xl font-extrabold w-[150px] lg:w-[250px] animate-float bg-gradient-to-r from-blue-600 via-white to-blue-600 bg-clip-text text-transparent drop-shadow-lg text-shadow-lg">MY TEAM</h1>
                    
                    {/* --- 💡 FIX 2: Hamburger Button (lg:hidden) --- */}
                    <button 
                        className="lg:hidden text-white z-50 p-2" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                    
                    {/* --- Action Buttons (Desktop/Tablet - lg:flex) --- */}
                    {/* These buttons disappear when the menu button appears (< 1024px) */}
                    <div className="hidden lg:flex space-x-4 items-center">
                        
                        {showCreatePlayer && (
                            <Link to="/" className="text-amber-50">
                                <button className="font-bold p-2 border-e-2 pr-8">
                                    <p className="hover:text-blue-400">Create Player Account</p>
                                </button>
                            </Link>
                        )}
                        
                        {showCreateOrganizer && (
                            <Link to="/organizer-register" className="text-amber-50">
                                <button className="font-bold p-2 border-e-2 pr-8">
                                    <p className="hover:text-blue-400">Create Organizer Account</p>
                                </button>
                            </Link>
                        )}
                        
                        {showJoinTeam && (
                            <Link to="/" className="text-amber-50">
                                <button className="font-bold p-2">
                                    <p className="hover:text-blue-400">Join Team</p>
                                </button>
                            </Link>
                        )}
                        
                        {/* Logout/Login Button (Desktop) */}
                        {userIsLoggedIn ? (
                            <Link to="/" className="text-amber-50">
                                <button onClick={handleLogout} className="border border-red-600 hover:bg-red-600 hover:text-white hover:rounded-3xl transition-all duration-500 text-red-600 font-bold py-2 px-4 rounded">
                                    Logout
                                </button>
                            </Link>
                        ) : (
                             <Link to="/login" className="text-amber-50">
                                <button className="border border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 text-blue-600 font-bold py-2 px-4 rounded">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* --- Bottom Navigation and User Info --- */}
                <div className="flex space-x-4 mt-6 text-lg font-medium justify-between">
                    {/* 💡 FIX 3: Desktop Navigation Links (hidden on < 1024px) */}
                    <div className="hidden lg:flex gap-10 overflow-x-auto pb-1 whitespace-nowrap">
                        {!hideTopButtons && (<Link to="/home" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Home</Link>)}
                        {!hideTopButtons && (<Link to="/event" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Events</Link>)}
                        {!hideTopButtons && (<Link to="/live-scores" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Live Scores</Link>)}
                        {!hideTopButtons && (<Link to="/news" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">News</Link>)}
                        {!hideTopButtons && (<Link to="/team" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Team</Link>)}
                        {!hideTopButtons && (<Link to="/profile" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Profile</Link>)}
                        {!hideTopButtons && (<Link to="/contact" className="hover:underline hover:underline-offset-4 hover:decoration-2 transition-all duration-500 text-amber-50">Contact Us</Link>)}
                    </div>

                    {/* 💡 FIX 4: User Info Block (Always visible on large screens, moved below navigation for desktop) */}
                    {/* The requirement was to keep this visible, so we ensure no "hidden" classes remove it on desktop. */}
                    <div className="hidden lg:flex space-x-2 items-center min-w-max">
                        {user ? (
                            <p className="text-white">
                                Hello, {user.fullname || 'Guest'}
                            </p>
                        ) : (null
                        )}
                        <img className="w-[30px] border rounded-4xl border-amber-50" src="src/assets/image/9131478.png" alt="User Avatar" />
                    </div>

                </div>
            </div>
            
            {/* --- 💡 NEW: Mobile Menu Overlay (< 1024px) --- */}
            <div className={`
                lg:hidden fixed top-[75px] left-0 w-full h-full bg-gray-900/95 backdrop-blur-sm z-30 transform transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col space-y-6 p-8 text-xl font-medium">
                    
                    {/* Mobile User Info (Only show here if it was hidden in the top bar) */}
                    {/* Since the requirement is to always show it, we don't duplicate it here, 
                       but if you want the name to appear *inside* the menu on mobile, this is where you'd place it. */}
                    
                    {/* Mobile Nav Links */}
                    <div className="flex flex-col space-y-4 border-b border-gray-700 pb-4">
                        {!hideTopButtons && (<Link to="/home" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Home</Link>)}
                        {!hideTopButtons && (<Link to="/event" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Events</Link>)}
                        {!hideTopButtons && (<Link to="/live-scores" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Live Scores</Link>)}
                        {!hideTopButtons && (<Link to="/news" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>News</Link>)}
                        {!hideTopButtons && (<Link to="/team" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Team</Link>)}
                        {!hideTopButtons && (<Link to="/profile" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Profile</Link>)}
                        {!hideTopButtons && (<Link to="/contact" className="text-amber-50 hover:text-blue-400" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>)}
                    </div>
                    
                    {/* Mobile Action Buttons (Top buttons, now displayed vertically) */}
                    <div className="pt-4 space-y-4">
                        {showCreatePlayer && (
                            <Link to="/" className="text-blue-400 block" onClick={() => setIsMenuOpen(false)}>Create Player Account</Link>
                        )}
                        {showCreateOrganizer && (
                            <Link to="/organizer-register" className="text-blue-400 block" onClick={() => setIsMenuOpen(false)}>Create Organizer Account</Link>
                        )}
                        {showJoinTeam && (
                             <Link to="/" className="text-blue-400 block" onClick={() => setIsMenuOpen(false)}>Join Team</Link>
                        )}
                        
                        {/* Logout/Login Button (Mobile Action) */}
                        {userIsLoggedIn ? (
                            <button onClick={handleLogout} className="w-full text-left text-red-500 pt-4 border-t border-gray-700">Logout</button>
                        ) : (
                            <Link to="/login" className="text-blue-500 block pt-4 border-t border-gray-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        )}
                    </div>
                </div>
            </div>
            
            {/* 💡 FIX 5: User Info Block (Separate for Mobile) */}
            {/* This block is positioned absolutely/fixed on top of the hamburger menu on mobile, to keep it visible */}
            {userIsLoggedIn && (
                 <div className="lg:hidden absolute top-4 right-14 flex space-x-2 items-center min-w-max mt-[90px]">
                    <p className="text-white text-sm sm:block"> 
                        Hello, {user.fullname || 'Guest'}
                    </p>
                    <img className="w-[30px] border rounded-4xl border-amber-50" src="src/assets/image/9131478.png" alt="User Avatar" />
                </div>
            )}
            
        </header>
    );
}