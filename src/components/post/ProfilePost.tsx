import { useState, useEffect } from 'react';
import { type PostData, likePostService } from '../../service/post';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { getPlayerProfile } from '../../service/playerDetails';
import { getOrganizerDetails } from "../../service/organizer";
import { useAuth } from "../../context/authContext";

export default function PlayerProfilePost({ post: initialPost }: { post: PostData }) {
    const { user } = useAuth();
    
    // 💡 වැදගත්: initialPost එක state එකකට දාන්න. එවිටයි ලයික් කළාම UI එක update වෙන්නේ.
    const [post, setPost] = useState(initialPost);
    const [playerProfile, setPlayerProfile] = useState<any>(null);
    const [organizerLogo, setOrganizerLogo] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    // යූසර් දැනටමත් ලයික් කර ඇත්දැයි පරීක්ෂා කිරීම
    useEffect(() => {
        if (user && post.likes) {
            setIsLiked(post.likes.includes(user.id));
        }
    }, [user, post.likes]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getPlayerProfile();
                if (res.data) setPlayerProfile(res.data);
            } catch (err) {
                console.log("Error loading profile", err);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadOrganizerData = async () => {
            try {
                const res = await getOrganizerDetails();
                const logo = res.data?.committeeLogoImageURL || res.data?.data?.committeeLogoImageURL;
                if (logo) setOrganizerLogo(logo);
            } catch (err) {
                console.log("Error loading organizer profile", err);
            }
        };
        loadOrganizerData();
    }, []);

    // ❤️ Like Handle Function
    const handleLike = async () => {
        if (!user) return alert("Please login to like posts");
        
        try {
            const res = await likePostService(post._id); // Backend API එකට ලයික් එක යැවීම
            
            // 💡 Backend එකෙන් සාර්ථකව message එක ලැබුණොත් පමණක් UI update කරන්න
            if (res.message === "Liked" || res.message === "Unliked") {
                const updatedIsLiked = !isLiked;
                setIsLiked(updatedIsLiked);

                // 💡 Post state එක update කිරීම මගින් count එක සහ heart color එක වෙනස් වේ
                setPost((prev: any) => ({
                    ...prev,
                    likes: updatedIsLiked 
                        ? [...prev.likes, user.id] 
                        : prev.likes.filter((id: string) => id !== user.id)
                }));
            }
        } catch (err) {
            console.error("Error toggling like", err);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
            {/* Header Area */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-50 shrink-0 bg-gray-50">
                        <img
                            src={playerProfile?.playerLogoImageFileURL || organizerLogo || `https://ui-avatars.com/api/?name=${user?.fullname}&background=random`}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-tight">
                            <span className="font-bold">{post.title || "Untitled Post"}</span>
                            {post.feeling && (
                                <span className="font-normal text-gray-500 lowercase italic">
                                    {" "}is feeling <span className="text-blue-500 font-bold not-italic">{post.feeling}</span>
                                </span>
                            )}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                            {new Date(post.createdAt).toLocaleDateString()} • {post.status}
                        </p>
                    </div>
                </div>
                <MoreVertical className="text-gray-400 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"/>
            </div>

            {/* Description & Tags */}
            <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                    {post.tagInput?.map(tag => (
                        <span key={tag} className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase italic tracking-wider">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Post Image */}
            {post.playerPostImageFileURL && (
                <div className="w-full bg-gray-50 border-y border-gray-50 overflow-hidden">
                    <img 
                        src={post.playerPostImageFileURL} 
                        className="w-full max-h-220 object-cover transition-transform hover:scale-[1.02] duration-500" 
                        alt="Post" 
                    />
                </div>
            )}

            {/* Interaction Bar */}
            <div className="p-4 px-8 flex items-center justify-between border-t border-gray-50 bg-white/50">
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
                        <span className="text-xs font-black">{post.likes?.length || 0}</span>
                    </button>

                    {/* 💬 Comment Button */}
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors active:scale-90">
                        <MessageCircle size={22} strokeWidth={2.5} /> 
                        <span className="text-xs font-black">{post.comments?.length || 0}</span>
                    </button>
                </div>
                
                {/* 🔗 Share Button */}
                <button className="text-gray-400 hover:text-green-500 transition-all active:scale-90">
                    <Share2 size={22} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}