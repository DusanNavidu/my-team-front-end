import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayerProfileById } from "../../service/auth"; 
import { getPlayerPostsById } from "../../service/post";
import HomePosts from "../../components/post/home/HomePost"; 
import {
  Phone,
  Mail,
  ShieldCheck,
  Info,
  LayoutGrid
} from "lucide-react";

export default function VisitProfilePlayer() {
  const { id } = useParams<{ id: string }>();
  const [playerData, setPlayerData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.all([
            getPlayerProfileById(id),
            getPlayerPostsById(id)
        ]);
        
        setPlayerData(profileRes.data);
        setPosts(postsRes.data || []);
      } catch (err) {
        setError("Failed to load athlete profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [id]);

  if (loading) return (
    <div className="mt-40 text-center font-black text-blue-600 animate-pulse uppercase tracking-widest">
      Synchronizing Athlete Data...
    </div>
  );

  if (error || !playerData) return (
    <div className="mt-40 text-center text-red-500 font-black uppercase">{error}</div>
  );

  const profileInfo = playerData.profileInfo;

  console.log("Player Data:", playerData);
  console.log("player info:", profileInfo);

  return (
    <div className="mt-2 container mx-auto px-0 sm:px-4 pb-12">
      {/* Banner */}
      <div className="bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
        <div className="relative h-64 md:h-[28rem] lg:h-[32rem] bg-slate-900">
          <img
            src={profileInfo?.playerBannerImageFileURL || "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80"}
            className="w-full h-full object-cover opacity-60" alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Profile Header */}
        <div className="relative px-6 py-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-24 md:-mt-32 lg:-mt-40">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left">
              <img
                src={profileInfo?.playerLogoImageFileURL || `https://ui-avatars.com/api/?name=${playerData.fullname}&background=random`}
                className="w-36 h-36 md:w-48 md:h-48 rounded-full md:rounded-[2.5rem] border-[8px] border-white object-cover bg-white shadow-2xl"
                alt="Profile"
              />
              <div className="mb-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                    {playerData.fullname}
                  </h1>
                  <ShieldCheck className="text-blue-500" size={32} />
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                    {profileInfo?.playerTagsSports?.map((tag: any, i: number) => (
                        <span key={i} className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{tag}</span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-gray-50">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="flex items-center gap-2 font-black text-blue-600 uppercase text-[10px] tracking-[0.2em]"><Info size={16} /> Bio</h3>
            <p className="text-gray-600 text-lg md:text-xl font-medium italic bg-gray-50 p-6 rounded-3xl">
              {profileInfo?.playerAbout || "This athlete prefers to keep their story private."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <Phone className="text-blue-600" size={20} />
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">Mobile</p>
                    <p className="font-bold text-gray-800">{profileInfo?.contactNumber || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <Mail className="text-red-600" size={20} />
                <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Email</p>
                    <p className="font-bold text-gray-800 truncate">{playerData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-auto mt-20 px-4 w-full max-w-[700px]">
        <h2 className="text-3xl font-black text-gray-900 uppercase flex items-center gap-3 tracking-tighter mb-10 border-b-4 border-gray-900 pb-4">
          <LayoutGrid className="text-blue-600" size={32} /> Athlete Timeline
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center shadow-xl text-gray-400 font-bold italic">No posts shared yet.</div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <HomePosts key={post._id} initialPost={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}