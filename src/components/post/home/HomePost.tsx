import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import moment from 'moment';
import { useAuth } from '../../../context/authContext';
import { likePostService } from '../../../service/post';
import { Link } from 'react-router-dom';

interface HomePostsProps {
    initialPost: any; 
}

export default function HomePosts({ initialPost }: HomePostsProps) {
    const { user } = useAuth();
    
    // Local states to handle like interactions instantly
    const [likes, setLikes] = useState<string[]>(initialPost?.likes || []);
    const [isLiked, setIsLiked] = useState(false);

    // පෝස්ට් එක ලෝඩ් වන විට ලොග් වී සිටින යූසර් දැනටමත් ලයික් කර ඇත්දැයි පරීක්ෂා කිරීම
    useEffect(() => {
        if (user && initialPost?.likes) {
            setIsLiked(initialPost.likes.includes(user.id));
        }
    }, [user, initialPost.likes]);

    const handleLike = async () => {
        if (!user) return alert("Please login to like posts");

        try {
            // Backend එකට දත්ත යැවීම
            const res = await likePostService(initialPost._id);
            
            if (res.isLiked) {
                // UI එකේ ලයික් එකක් එකතු කිරීම
                setIsLiked(true);
                setLikes(prev => [...prev, user.id]);
            } else {
                // UI එකෙන් ලයික් එක අයින් කිරීම
                setIsLiked(false);
                setLikes(prev => prev.filter(id => id !== user.id));
            }
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    if (!initialPost) return null;

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md mb-8">
            {/* 👤 Header Section */}
            <div className="p-6 flex items-center justify-between">
                <Link to={`/player-profile/${initialPost.userId?._id}`} className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-50 bg-gray-100 shrink-0">
                            <img 
                                src={initialPost.userId?.playerProfile?.playerLogoImageFileURL || 
                                    `https://ui-avatars.com/api/?name=${initialPost.userId?.fullname}&background=random`} 
                                className="w-full h-full object-cover" 
                                alt="User" 
                            />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-tight truncate">
                                {initialPost.userId?.fullname || "User"}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                {moment(initialPost.createdAt).fromNow()}
                            </p>
                        </div>
                    </div>
                </Link>
                <MoreHorizontal className="text-gray-300 cursor-pointer hover:text-gray-600 transition-colors shrink-0" />
            </div>

            {/* 📝 Content Text */}
            <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {initialPost.description}
                </p>
            </div>

            {/* 🖼️ Post Image */}
            {initialPost.playerPostImageFileURL && (
                <div className="w-full max-h-220 bg-gray-50 border-y border-gray-50 overflow-hidden">
                    <img 
                        src={initialPost.playerPostImageFileURL} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                        alt="Post Content" 
                    />
                </div>
            )}

            {/* ⚡ Interaction Bar */}
            <div className="p-4 px-8 flex items-center justify-between bg-white/50 border-t border-gray-50">
                <div className="flex gap-8">
                    {/* ❤️ Like Button */}
                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-2 transition-all active:scale-125 duration-200 
                            ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Heart 
                            size={22} 
                            fill={isLiked ? "currentColor" : "none"} 
                            strokeWidth={2.5} 
                        />
                        <span className="text-xs font-black">{likes.length}</span>
                    </button>

                    {/* 💬 Comment Button */}
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-all active:scale-90 duration-200">
                        <MessageCircle size={22} strokeWidth={2.5} />
                        <span className="text-xs font-black">{initialPost.comments?.length || 0}</span>
                    </button>
                </div>

                {/* 🔗 Share Button */}
                <button className="text-gray-400 hover:text-green-500 transition-all active:scale-90 duration-200">
                    <Share2 size={22} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}