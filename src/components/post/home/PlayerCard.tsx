import React, { useState, useEffect } from 'react';
import { getPlayerProfiles } from '../../../service/auth'; 
import { ShieldCheck, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // 👈 Link එකතු කරන්න

export default function PlayerCard() {
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const res = await getPlayerProfiles();
                setPlayers(res.data || []);
            } catch (err) {
                console.error("Error loading players", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayers();
    }, []);

    if (loading) return (
        <div className="flex gap-4 overflow-hidden py-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[170px] h-[250px] bg-gray-100 animate-pulse rounded-[2rem]"></div>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.2em]">Suggested Players</h3>
                <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">See All</button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2 snap-x">
                {players.map((player) => (
                    /* ✅ මුළු කාඩ් එකම Link එකක් බවට පත් කිරීම */
                    <Link 
                        to={`/player-profile/${player._id}`} 
                        key={player._id} 
                        className="min-w-[170px] max-w-[170px] bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col items-center p-5 relative snap-start cursor-pointer"
                    >
                        {/* Close button (Propagation නැවැත්වීමට e.preventDefault භාවිතා කළ හැක) */}
                        <button 
                            onClick={(e) => {
                                e.preventDefault(); // Profile එකට යන එක නවත්වයි
                                // මකන logic එක මෙතැනට
                            }}
                            className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 z-10"
                        >
                            <X size={14} />
                        </button>

                        {/* Player Image */}
                        <div className="relative mb-3">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-50 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                <img 
                                    src={player.profileInfo?.playerLogoImageFileURL || `https://ui-avatars.com/api/?name=${player.fullname}&background=random&size=128`} 
                                    className="w-full h-full object-cover" 
                                    alt={player.fullname} 
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        {/* Player Info */}
                        <div className="text-center space-y-1 w-full px-1 mb-4">
                            <h4 className="font-black text-gray-900 uppercase tracking-tighter text-[13px] truncate">
                                {player.fullname}
                            </h4>
                            <p className="text-[9px] font-bold text-gray-400 truncate uppercase">
                                {player.profileInfo?.playerTagsSports?.[0] || "Athlete"}
                            </p>
                        </div>

                        {/* Action Button */}
                        <button 
                            className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95 font-black text-[10px] uppercase tracking-widest"
                            onClick={(e) => e.preventDefault()} // Button එක එබූ විට Profile එකට යාම වැළැක්වීමට
                        >
                            <UserPlus size={14} strokeWidth={3} />
                            Follow
                        </button>
                    </Link>
                ))}
            </div>
        </div>
    );
}