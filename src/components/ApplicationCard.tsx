import React from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ExternalLink, UserPlus, Mail, Calendar, Clock } from 'lucide-react';
import moment from 'moment';

interface Props {
    app: any;
    handleStatusChange: (id: string, status: string) => void;
}

export default function ApplicationCard({ app, handleStatusChange }: Props) {
    const status = app.status;
    const isPending = status === "PENDING";
    const isAccepted = status === "ACCEPTED";
    const isRejected = status === "REJECTED";

    return (
        <div className="relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col md:flex-row group mb-4">
            
            {/* 🎞️ Left: Event Brief */}
            <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden shrink-0">
                <img 
                    src={app.eventId?.eventImageURL || "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Event"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <p className="text-white text-[10px] font-black uppercase leading-tight line-clamp-2 drop-shadow-lg">
                        {app.eventId?.eventName}
                    </p>
                </div>
            </div>

            {/* 👤 Right: Player Details & Actions */}
            <div className="p-5 flex-1 flex-col lg:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 w-full">
                    <div className="relative shrink-0">
                        <div className={`p-1 rounded-full border-2 transition-all duration-500 
                            ${isAccepted ? 'border-green-500 shadow-lg' : isRejected ? 'border-red-500' : 'border-blue-600'}`}>
                            <img 
                                src={app.playerId?.playerProfile?.playerLogoImageFileURL || `https://ui-avatars.com/api/?name=${app.playerId?.fullname}&background=random`} 
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover bg-white shadow-inner"
                                alt="Player"
                            />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white
                            ${isAccepted ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-orange-500'}`} 
                        />
                    </div>

                    <div className="overflow-hidden flex-1">
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter text-lg leading-none truncate">
                            {app.playerId?.fullname}
                        </h3>
                        
                        <div className="flex flex-col gap-1 mt-1.5">
                            <p className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 lowercase truncate italic">
                                <Mail size={12} className="text-blue-500 shrink-0" /> {app.playerId?.email}
                            </p>
                            <p className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                <Clock size={11} /> {moment(app.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🏷️ Right Side Actions & Status */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                    <div className="hidden xl:block mr-2">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2
                            ${isAccepted ? 'bg-green-50 text-green-600 border-green-100' : 
                              isRejected ? 'bg-red-50 text-red-600 border-red-100' : 
                              'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            {status}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link 
                            to={`/player-profile/${app.playerId?._id}`} 
                            className="p-3 bg-gray-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-md"
                        >
                            <ExternalLink size={18} />
                        </Link>

                        <button className="px-5 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95">
                            <UserPlus size={14} strokeWidth={3} /> Follow
                        </button>

                        {isPending && (
                            <div className="flex gap-2 border-l pl-2 border-gray-100">
                                <button onClick={() => handleStatusChange(app._id, "ACCEPTED")} className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all active:scale-90 shadow-md shadow-green-100">
                                    <Check size={20} strokeWidth={3} />
                                </button>
                                <button onClick={() => handleStatusChange(app._id, "REJECTED")} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all active:scale-90 shadow-md shadow-red-100">
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}