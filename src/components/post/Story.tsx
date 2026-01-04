import React, { useState, useEffect } from 'react';
import { getMyStoryService, type PostData } from '../../service/post';
import { Plus, X, Heart } from 'lucide-react';
import { getOrganizerDetails } from "../../service/organizer";
import { getPlayerProfile } from '../../service/playerDetails';
import moment from 'moment';

export default function Story({ onOpenModal }: { onOpenModal: () => void }) {
    const [stories, setStories] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStory, setSelectedStory] = useState<PostData | null>(null);
    const [progress, setProgress] = useState(0);
    const [organizerLogo, setOrganizerLogo] = useState<string | null>(null);
    const [playerProfile, setPlayerProfile] = useState<any>(null);

    // 1. Fetch My Stories
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const data = await getMyStoryService();
                setStories(data || []);
            } catch (err) {
                console.error("Story loading error");
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    // 2. Story Progress Timer Logic
    useEffect(() => {
        let interval: any;
        if (selectedStory) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setSelectedStory(null);
                        return 100;
                    }
                    return prev + (100 / (15 * 10)); // 15 Seconds duration
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [selectedStory]);

    // 3. Load Profile Logos
    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const [orgRes, playRes] = await Promise.all([
                    getOrganizerDetails().catch(() => null),
                    getPlayerProfile().catch(() => null)
                ]);
                if (orgRes?.data) setOrganizerLogo(orgRes.data.committeeLogoImageURL);
                if (playRes?.data) setPlayerProfile(playRes.data);
            } catch (err) { console.log(err); }
        };
        loadProfiles();
    }, []);

    const myProfileLogo = playerProfile?.playerLogoImageFileURL || organizerLogo || `https://ui-avatars.com/api/?name=Me&background=random`;

    return (
        <div className="w-full py-4 px-2">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 ml-4">
                My Highlights
            </h3>

            <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
                
                {/* ➕ 1. Create Story Card (FB Style) */}
                <div 
                    onClick={onOpenModal}
                    className="relative min-w-[110px] h-[190px] rounded-2xl bg-white border border-gray-100 overflow-hidden cursor-pointer group shrink-0 shadow-md hover:shadow-lg transition-all"
                >
                    <div className="h-[70%] bg-gray-50 overflow-hidden">
                        <img 
                            src={myProfileLogo} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90" 
                            alt="Me" 
                        />
                    </div>
                    <div className="absolute bottom-0 w-full h-[30%] bg-white flex flex-col items-center justify-center">
                        <div className="absolute -top-4 p-1 bg-white rounded-full shadow-lg">
                            <div className="bg-blue-600 p-1.5 rounded-full text-white shadow-xl group-active:scale-90 transition-transform">
                                <Plus size={18} strokeWidth={4} />
                            </div>
                        </div>
                        <span className="text-[9px] font-black uppercase text-gray-800 tracking-tighter mt-2">Create</span>
                    </div>
                </div>

                {/* 📱 2. Active Stories List */}
                {loading ? (
                    [1, 2].map((i) => (
                        <div key={i} className="min-w-[110px] h-[190px] rounded-2xl bg-gray-100 animate-pulse shrink-0" />
                    ))
                ) : (
                    stories.map((story) => (
                        <div 
                            key={story._id} 
                            onClick={() => setSelectedStory(story)}
                            className="relative min-w-[110px] h-[190px] rounded-2xl overflow-hidden cursor-pointer shrink-0 border-2 border-transparent hover:border-blue-500 transition-all shadow-md group"
                        >
                            <img 
                                src={story.playerPostImageFileURL} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt="Story" 
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                            
                            {/* Profile Ring on Story Card */}
                            <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-2 border-blue-600 p-0.5 bg-white overflow-hidden shadow-xl z-10">
                                 <img src={myProfileLogo} className="w-full h-full rounded-full object-cover" alt="User" />
                            </div>

                            <div className="absolute bottom-2 left-2 right-2 z-10">
                                <p className="text-white text-[9px] font-black uppercase tracking-tighter truncate leading-tight drop-shadow-lg">
                                    {story.title || "Recent Story"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 📺 3. FULLSCREEN STORY VIEWER (Modern Backdrop Blur Style) */}
            {selectedStory && (
                <div className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col overflow-hidden animate-in fade-in duration-300">
                    
                    {/* Blurred Background */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={selectedStory.playerPostImageFileURL} 
                            className="w-full h-full object-cover blur-3xl opacity-30 scale-110" 
                            alt="" 
                        />
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
                        <div className="relative w-full max-w-[420px] h-full max-h-[85vh] bg-black rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
                            
                            {/* Top Progress Bar Wrapper */}
                            <div className="absolute top-3 left-4 right-4 flex gap-1 z-[120]">
                                <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-white transition-all duration-100 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Viewer Header Info */}
                            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-[120]">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={myProfileLogo} 
                                        className="w-10 h-10 rounded-full border border-white/50 shadow-lg" 
                                        alt="Avatar" 
                                    />
                                    <div>
                                        <p className="text-white text-xs font-black uppercase tracking-widest drop-shadow-md">
                                            {selectedStory.title || "My Story"}
                                        </p>
                                        <p className="text-white/60 text-[9px] font-bold">
                                            {moment(selectedStory.createdAt).fromNow()}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedStory(null)} 
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white backdrop-blur-md"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Main Story Content Image */}
                            <div className="flex-1 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                                <img 
                                    src={selectedStory.playerPostImageFileURL} 
                                    className="w-full h-full object-contain" 
                                    alt="Story Media" 
                                />
                            </div>

                            {/* Bottom Caption Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center gap-4">
                                <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                                    <Heart className="text-white hover:text-red-500 transition-colors cursor-pointer" size={20} />
                                </div>
                                <p className="text-white text-xs font-medium italic leading-relaxed line-clamp-2 drop-shadow-md">
                                    {selectedStory.description || "No caption provided for this highlight."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}