import React, { useState, useEffect } from "react";
import { getTenLatestStories, type PostData } from "../../../service/post";
import { Heart, X } from "lucide-react";
import moment from "moment";

export default function VisitStory() {
  const [stories, setStories] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<PostData | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchLatestStories = async () => {
      try {
        const data = await getTenLatestStories();
        setStories(data || []);
      } catch (err) {
        console.error("Error loading stories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestStories();
  }, []);

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
          return prev + 100 / (15 * 10);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [selectedStory]);

  if (stories.length === 0 && !loading) return null;

  return (
    <div className="w-full py-4 px-2">
      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-4 ml-4">
        Trending Stories
      </h3>

      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
        {loading
          ? [1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="min-w-[110px] h-[190px] rounded-2xl bg-gray-200 animate-pulse shrink-0"
              />
            ))
          : stories.map((story) => (
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
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-2 border-blue-600 p-0.5 bg-white overflow-hidden shadow-xl z-10">
                  <img
                    src={`https://ui-avatars.com/api/?name=${story.title}&background=random`}
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                </div>
                <div className="absolute bottom-2 left-2 right-2 z-10">
                  <p className="text-white max-h-10 text-[9px] font-black uppercase tracking-tighter truncate leading-tight drop-shadow-lg">
                    {story.title}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {selectedStory && (
        <div className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={selectedStory.playerPostImageFileURL}
              className="w-full h-full object-cover blur-3xl opacity-30"
              alt=""
            />
          </div>

          <div className="relative z-10 w-full h-full mt-[150px] flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-[420px] h-full max-h-[85vh] bg-black rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10">
              <div className="absolute top-3 left-4 right-4 flex gap-1 z-[120]">
                <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-[120]">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${selectedStory.title}&background=random`}
                    className="w-10 h-10 rounded-full border border-white/50"
                    alt=""
                  />
                  <div>
                    <p className="text-white text-xs font-black uppercase tracking-widest">
                      {selectedStory.title}
                    </p>
                    <p className="text-white/60 text-[9px]">
                      {moment(selectedStory.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 w-full bg-zinc-900 flex items-center justify-center">
                <img
                  src={selectedStory.playerPostImageFileURL}
                  className="w-full h-full object-contain"
                  alt="Story Content"
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center gap-4">
                <Heart className="text-white hover:text-red-500 transition-colors duration-300" />
                <p className="text-white max-h-8 overflow-hidden text-ellipsis">
                  {selectedStory.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
