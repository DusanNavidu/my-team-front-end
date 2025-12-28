import React, { useState, useEffect } from 'react';
import { type PostData } from '../../service/post';
import { Heart, MessageCircle, Share2, MoreHorizontal, MoreVertical } from 'lucide-react';
import { getPlayerProfile } from '../../service/playerDetails';

export default function PlayerProfilePost({ post }: { post: PostData }) {

    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await getPlayerProfile();
                if (res.data) {
                    setProfile(res.data);
                }
            } catch (err) {
                console.log("Error loading profile", err);
            }
        };
        loadData();
    }, []);

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className='className="w-12 h-12 rounded-full'>
                        <img
                            src={profile?.playerLogoImageFileURL || "https://cdn-icons-png.flaticon.com/512/147/147144.png"}
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="">
                            <span className="font-bold">
                            {post.title || "Untitled Post"}
                            </span>
                            
                            <span>
                                {" "}is feeling{" "}
                                <span className="text-blue-500">
                                    {post.feeling ? post.feeling.split(" ")[0] : "⚽"}
                                </span>
                            </span>
                            

                            {" "}
                            <span className="text-black">
                            {post.mention && post.mention.length > 0 ? (
                                <>
                                {post.mention.slice(0, 3).join(", ")}

                                {post.mention.length > 3 && (
                                    <span className="text-gray-500">
                                    {" "}
                                    +{post.mention.length - 3} more others
                                    </span>
                                )}
                                </>
                            ) : (
                                " "
                            )}
                            </span>
                        </h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(post.createdAt).toLocaleDateString()} • {post.status}
                        </p>
                    </div>
                </div>
                <MoreVertical className="text-gray-400 cursor-pointer"/>
            </div>

            <div className="px-6 pb-4">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                    {post.tagInput.map(tag => (
                        <span key={tag} className="text-blue-500 text-xs font-bold italic">{tag}</span>
                    ))}
                </div>
            </div>

            {post.playerPostImageFileURL && (
                <div className="w-full">
                    <img src={post.playerPostImageFileURL} className="w-full max-h-250 object-cover" alt="Post" />
                </div>
            )}

            <div className="p-6 flex items-center justify-between border-t border-gray-50">
                <div className="flex gap-6">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Heart size={20} /> <span className="text-xs font-bold">{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} /> <span className="text-xs font-bold">{post.comments?.length || 0}</span>
                    </button>
                </div>
                <Share2 size={20} className="text-gray-400 cursor-pointer hover:text-green-500" />
            </div>
        </div>
    );
}