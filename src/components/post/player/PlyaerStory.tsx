import React from 'react';
import { type PostData } from '../../../service/post';

export default function PlayerStoryCard({ story, onClick }: { story: PostData, onClick: () => void }) {
    return (
        <div 
            onClick={onClick}
            className="min-w-[110px] h-[190px] rounded-[1.8rem] overflow-hidden relative group cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all shrink-0 shadow-lg"
        >
            {/* Story Image */}
            <img 
                src={story.playerPostImageFileURL} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt="Story"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            {/* Avatar on Story */}
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full border-2 border-blue-600 overflow-hidden shadow-md">
                <img 
                    src={`https://ui-avatars.com/api/?name=${story.title}&background=random`} 
                    className="w-full h-full object-cover" 
                    alt="User"
                />
            </div>

            {/* Story Title */}
            <p className="absolute bottom-3 left-3 right-3 text-white text-[9px] font-black uppercase leading-tight drop-shadow-lg truncate">
                {story.title || "My Day"}
            </p>
        </div>
    );
}