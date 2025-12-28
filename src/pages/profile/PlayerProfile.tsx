import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import {
  getPlayerProfile,
  updatePlayerDetails,
} from "../../service/playerDetails";
import { createPostService } from "../../service/post";
import Button from "../../components/Button";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Modal/InputForModal";
import Select from "../../components/Modal/SelectForModal";
import { X, Plus, Phone, Info, Mail, ShieldCheck, Camera } from "lucide-react";
import { getMyPosts, type PostData } from "../../service/post";
import PlayerPost from "../../components/post/PlayerProfilePost";

export default function PlayerProfile() {
    const { user } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [openPostModal, setOpenPostModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [postsList, setPostsList] = useState<PostData[]>([]);
    const [isPostLoading, setIsPostLoading] = useState(false);

    // Form states
    const [contactNo, setContactNo] = useState("");
    const [about, setAbout] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    // Image states
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    // Post states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [feeling, setFeeling] = useState("");
    const [mention, setMention] = useState("");
    const [tagInputText, setTagInputText] = useState("");
    const [postFile, setPostFile] = useState<File | null>(null);
    const [postPreview, setPostPreview] = useState<string | null>(null);

    const feelingOptions = [
        { value: "", label: "Select Feeling" },
        { value: "match-ready", label: "⚽ Match Ready" },
        { value: "winning", label: "🏅 Winning Mood" },
        { value: "losing", label: "😞 Losing Streak" },
        { value: "training-mode", label: "🏋️ Training Mode" },
        { value: "injured", label: "🤕 Injured" },
        { value: "celebrating", label: "🎉 Celebrating" },
        { value: "birthday", label: "🎂 Birthday Vibes" },
        { value: "party-vibe", label: "🎉 Party Vibe" },
        { value: "teamwork", label: "🤝 Teamwork" },
        { value: "team-player", label: "🤜🤛 Team Player" },
        { value: "team-spirit", label: "🤝 Team Spirit" },
        { value: "training", label: "🏋️ Training Hard" },
        { value: "focused-game", label: "🎮 Game Focused" },
        { value: "happy", label: "😊 Happy" },
        { value: "excited", label: "🤩 Excited" },
        { value: "motivated", label: "💪 Motivated" },
        { value: "grateful", label: "🙏 Grateful" },
        { value: "proud", label: "🏆 Proud" },
        { value: "determined", label: "🔥 Determined" },
        { value: "optimistic", label: "🌈 Optimistic" },
        { value: "confident", label: "😎 Confident" },
        { value: "inspired", label: "✨ Inspired" },
        { value: "focused", label: "🎯 Focused" },
        { value: "energized", label: "⚡ Energized" },
        { value: "blessed", label: "😇 Blessed" },
        { value: "thankful", label: "🙌 Thankful" },
        { value: "relaxed", label: "😌 Relaxed" },
        { value: "hopeful", label: "🤞 Hopeful" },
        { value: "victorious", label: "🥇 Victorious" },
        { value: "strong", label: "🦾 Strong" },
        { value: "calm", label: "🧘 Calm" },
    ];


    const DEFAULT_BANNER =
        "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop";
    const DEFAULT_LOGO = `https://ui-avatars.com/api/?name=${
        user?.fullname || "Player"
    }&background=random&size=128`;

    const loadData = async () => {
        try {
            const res = await getPlayerProfile();
            if (res.data) {
                setProfile(res.data);
                setContactNo(res.data.contactNumber || "");
                setAbout(res.data.playerAbout || "");
                setTags(res.data.playerTagsSports || []);
            }
            fetchPosts();
        } catch (err) { console.log("Error loading profile"); }
    };

    const fetchPosts = async () => {
        setIsPostLoading(true);
        try {
            const data = await getMyPosts();
            setPostsList(data || []);
        } catch (err) { console.log("Error loading posts"); }
        finally { setIsPostLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner" | "post") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        if (type === "logo") {
            setLogoFile(file);
            setLogoPreview(previewUrl);
        } else if (type === "banner") {
            setBannerFile(file);
            setBannerPreview(previewUrl);
        } else if (type === "post") {
            setPostFile(file);
            setPostPreview(previewUrl);
        }
    };

    const handlePostCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!postFile) return alert("Please select an image for your post");

        setIsLoading(true);
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("feeling", feeling);
        fd.append("mention", JSON.stringify(mention.split(",").map(m => m.trim())));
        fd.append("tagInput", JSON.stringify(tagInputText.split(",").map(t => t.trim())));
        fd.append("postImage", postFile);

        try {
            await createPostService(fd);
            alert("Post shared successfully!");
            setOpenPostModal(false);
            setTitle(""); setDescription(""); setFeeling(""); setMention(""); setTagInputText(""); setPostPreview(null); setPostFile(null);
            fetchPosts();
        } catch (err) {
            alert("Failed to create post");
        } finally {
            setIsLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (about.length > 500) {
        alert(`Biography is too long! Current: ${about.length} characters.`);
        return;
    }

        setIsLoading(true);
        const fd = new FormData();
        fd.append("contactNumber", contactNo);
        fd.append("playerAbout", about);
        fd.append("playerTagsSports", JSON.stringify(tags));
        if (logoFile) fd.append("playerLogoImage", logoFile);
        if (bannerFile) fd.append("playerBannerImage", bannerFile);

        try {
        await updatePlayerDetails(fd);
        setOpenModal(false);
        setLogoPreview(null);
        setBannerPreview(null);
        await loadData();
        } catch (err) {
        alert("Error updating profile");
        } finally {
        setIsLoading(false);
        }
    };

    const handlePostOpenModal = () => {
        setOpenPostModal(true);
    }

    return (
        <div className="mt-[150px] md:mt-40 container mx-auto px-0 sm:px-4 pb-12">
            <div className="bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
                <div className="relative h-64 md:h-[28rem] lg:h-[32rem] bg-slate-900">
                    <img
                        src={profile?.playerBannerImageFileURL || DEFAULT_BANNER}
                        className="w-full h-full object-cover opacity-70 md:opacity-60"
                        alt="Banner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden md:block" />
                </div>

                <div className="relative px-6 py-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-24 md:-mt-32 lg:-mt-40">
                        <div className="flex flex-col md:mt-10 md:flex-row items-center md:items-end gap-4 md:gap-8 w-full md:w-auto text-center md:text-left">
                            <div className="relative group">
                                <img
                                    src={profile?.playerLogoImageFileURL || DEFAULT_LOGO}
                                    className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full md:rounded-[2.5rem] border-[4px] md:border-[8px] border-white object-cover bg-white shadow-2xl transition-transform hover:scale-105"
                                    alt="Logo"
                                />
                            </div>

                            <div className="space-y-1 md:space-y-2 mb-2">
                                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none text-gray-900 [text-shadow:-2px_-2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff,2px_2px_0_#fff]">
                                        {user?.fullname}
                                    </h1>
                                    <ShieldCheck className="text-blue-500 shrink-0" size={32} />
                                </div>
                                <p className="text-blue-600 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                                    Official Player Identity
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                    {profile?.playerTagsSports?.map((t: string) => (
                                        <span
                                            key={t}
                                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase border border-blue-100"
                                        >
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto z-0">
                            <Button
                                color="black"
                                className="w-full md:w-auto px-10 py-4 rounded-2xl bg-black shadow-xl hover:bg-gray-800 transition-all active:scale-95"
                                onClick={() => setOpenModal(true)}
                            >
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 border-t border-gray-50">
                    <div className="lg:col-span-2 space-y-4 md:space-y-6">
                        <h4 className="flex items-center gap-2 font-black text-blue-600 uppercase text-[10px] tracking-[0.2em]">
                            <Info size={16} /> Player Biography
                        </h4>
                        <div className="bg-gray-50/50 md:bg-transparent rounded-3xl p-6 md:p-0">
                            <p className="text-gray-600 max-h-[400px] overflow-y-auto pr-2 leading-relaxed text-lg md:text-xl  font-medium italic custom-scrollbar">
                                {profile?.playerAbout
                                    ? `"${profile.playerAbout}"`
                                    : "This athlete hasn't added a biography yet."}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 space-y-6 h-fit">
                        <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">
                            Communication
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Phone size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">
                                        Hotline
                                    </p>
                                    <p className="font-bold text-gray-800 text-sm md:text-base">
                                        {profile?.contactNumber || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                                    <Mail size={20} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">
                                        Email
                                    </p>
                                    <p className="font-bold text-gray-800 text-sm md:text-base truncate">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-10 z-0">
                <Button onClick={() => setOpenPostModal(true)} color="white" className="rounded-2xl shadow-2xl gap-2 px-6 py-3 border border-gray-200">
                    <div className="flex items-center gap-2">
                        <Camera size={18} className="text-blue-600" />
                        <p className="text-black font-bold">+ Add Post</p>
                    </div>
                </Button>
            </div>

            <div className="max-w-[700px] mx-auto px-4 mt-10">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                    <Camera size={20} className="text-blue-600"/> My Timeline
                </h3>
                
                {isPostLoading ? (
                    <div className="text-center py-10 font-bold text-gray-400 animate-pulse">Refreshing Feed...</div>
                ) : postsList.length > 0 ? (
                    postsList.map((post: any) => (
                        <PlayerPost key={post._id} post={post} />
                    ))
                ) : (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
                        No posts shared yet. Start your journey!
                    </div>
                )}
            </div>

            <Modal isOpen={openPostModal} onClose={() => setOpenPostModal(false)}>
                <div className="max-w-3xl mx-auto p-2">
                    <h2 className="text-2xl font-black uppercase mb-4">Create New Post</h2>
                    <form className="space-y-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                                Post Media Content
                            </label>
                            
                            <div className="relative group w-full bg-gray-50 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-200 transition-all hover:border-blue-500 hover:bg-blue-50/30">
                                
                                <div className="aspect-square sm:aspect-square md:max-h-[500px] flex items-center justify-center relative">
                                
                                {postPreview ? (
                                    <img 
                                    src={postPreview} 
                                    className="w-full h-full object-cover" 
                                    alt="Post Preview" 
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-gray-400">
                                    <div className="p-6 bg-white rounded-full shadow-sm">
                                        <Camera size={40} strokeWidth={1.2} className="text-gray-300" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Select Media</p>
                                        <p className="text-[10px] font-medium text-gray-400 mt-1 italic">Square (1:1) Recommended</p>
                                    </div>
                                    </div>
                                )}

                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                                    <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-md">
                                        <Plus size={32} className="text-white" />
                                    </div>
                                    <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                                        {postPreview ? "Replace Media" : "Upload Image"}
                                    </span>
                                    </div>
                                    <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageChange(e, "post")} 
                                    />
                                </label>
                                </div>

                                {postPreview && (
                                <button 
                                    type="button"
                                    onClick={() => setPostPreview(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
                                >
                                    <X size={18} />
                                </button>
                                )}
                            </div>
                        </div>

                        <Input label="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        
                        
                        <Select label="How are you feeling?" value={feeling} onChange={(e) => setFeeling(e.target.value)} options={feelingOptions} />
                        
                        <Input label="Mentions (comma separated)" value={mention} onChange={(e) => setMention(e.target.value)} placeholder="@mention" />
                        
                        <label htmlFor="description" className="text-black font-semibold mb-1">Description</label>
                        <textarea 
                            className="w-full p-4 rounded-2xl h-32 border border-gray-300 rounded focus:outline-none focus:border-blue-300 backdrop-blur-sm"
                            placeholder="What's on your mind?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />

                        <Input label="Tags (e.g. Winner, Goal)" value={tagInputText} onChange={(e) => setTagInputText(e.target.value)} placeholder="#tags..." />

                        <Button disabled={isLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
                            onClick={handlePostCreate}>
                            {isLoading ? "Posting..." : "Post Now"}
                        </Button>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <div className="max-w-3xl mx-auto p-2">
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                            Profile Settings
                        </h2>
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                            Update your visual identity
                        </p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                    Logo
                                </label>
                                <div className="relative group h-32 md:h-40 bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200">
                                    <img
                                        src={
                                            logoPreview ||
                                            profile?.playerLogoImageFileURL ||
                                            DEFAULT_LOGO
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Logo"
                                    />
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, "logo")}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400">
                                    Banner
                                </label>
                                <div className="relative group h-32 md:h-40 bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200">
                                    <img
                                        src={
                                            bannerPreview ||
                                            profile?.playerBannerImageFileURL ||
                                            DEFAULT_BANNER
                                        }
                                        className="w-full h-full object-cover"
                                        alt="Banner"
                                    />
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(e, "banner")}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <Input
                            label="Contact Hotline"
                            placeholder="07XXXXXXXX"
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-700">
                                Expertise
                            </label>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border-2 border-gray-100 p-3 md:p-4 rounded-2xl font-bold text-sm"
                                    placeholder="e.g. Cricket"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && (e.preventDefault(), addTag())
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="bg-blue-600 text-white px-4 md:px-5 rounded-2xl"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                {tags.map((t) => (
                                    <span
                                        key={t}
                                        className="bg-blue-50 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black text-blue-700 uppercase"
                                    >
                                        {t}{" "}
                                        <X
                                            size={12}
                                            className="cursor-pointer text-red-500"
                                            onClick={() => removeTag(t)}
                                        />
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-700 flex justify-between">
                                Biography <span>{about.length}/500</span>
                            </label>
                            <textarea
                                className={`w-full border-2 p-4 md:p-5 rounded-3xl h-32 focus:border-blue-500 outline-none transition-all italic text-sm md:text-base ${about.length > 500 ? "border-red-500" : "border-gray-100"
                                    }`}
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            disabled={isLoading || about.length > 500}
                            className="w-full bg-blue-600 text-white font-black uppercase py-4 md:py-5 rounded-2xl shadow-xl hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {isLoading ? "Saving..." : "Apply Changes"}
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
