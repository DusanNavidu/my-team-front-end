import { useState, useEffect } from "react";
import VisitStory from "./post/home/HomeStoty";
import PlayerCard from "./post/home/PlayerCard";
import HomePosts from "./post/home/HomePost"; 
import { getAllPostsService, type PostData } from "../service/post";

export default function HomeTemplate() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPostsService();
        setPosts(data || []);
      } catch (err) {
        console.error("Error fetching posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const firstThreePosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  return (
    <div className="max-w-[700px] mx-auto px-0 sm:px-4 mt-10">
      
      <div className="w-full mb-8">
        <VisitStory />
      </div>

      <div className="w-full">
        {loading ? (
            <div className="w-full h-64 bg-gray-100 animate-pulse rounded-[2.5rem] mb-8" />
        ) : (
            firstThreePosts.map((post) => (
                <HomePosts key={post._id} initialPost={post} /> 
            ))
        )}
      </div>

      <section className="w-full bg-gray-50/50 py-6 px-2 rounded-[2.5rem] border border-gray-100 mb-8">
        <PlayerCard />
      </section>

      <div className="w-full pb-20">
        {!loading && remainingPosts.map((post) => (
          <HomePosts key={post._id} initialPost={post} />
        ))}
        
        {!loading && posts.length === 0 && (
            <div className="text-center py-20 text-gray-400 font-bold uppercase italic">
                No updates available.
            </div>
        )}
      </div>
    </div>
  );
}