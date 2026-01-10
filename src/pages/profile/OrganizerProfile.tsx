import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/authContext";
import {
  getOrganizerDetails,
  updateOrganizerDetails,
} from "../../service/organizer";
import { getAllUserFullnames } from "../../service/auth";
import ProfileEvent from "../../components/post/organizer/ProfilePostOrganizer";
import { createEvent, fetchOrganizerEvents } from "../../service/event";
import type { EventData } from "../../service/event";
import Button from "../../components/Button";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/Modal/InputForModal";
import Select from "../../components/Modal/SelectForModal";
import {
  Camera,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  X,
  Plus,
  Calendar,
  Newspaper,
} from "lucide-react";
import { createPostService } from "../../service/post";
import { getMyPosts, type PostData } from "../../service/post";
import PlayerPost from "../../components/post/ProfilePost";
import { showAlert } from "../../components/Swail";
import Story from "../../components/post/Story";
import { getMyApplications, updateAppStatus } from "../../service/application"
import ApplicationCard from "../../components/ApplicationCard";

interface OrganizerProfile {
  committeeName: string;
  contact_no: string;
  eventPlace: string;
  committeeLogoImageURL: string;
  committeeBannerImageURL: string;
  status: string;
}

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Profile() {
  // General States
  const { user, loading: authLoading } = useAuth();
  const [storyKey, setStoryKey] = useState(0);
  const [organizerDetails, setOrganizerDetails] =
    useState<OrganizerProfile | null>(null);
  const [organizerEvents, setOrganizerEvents] = useState<EventData[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const isOrganizer = user?.roles?.includes("ORGANIZER") || false;

  // "events" | "posts" | "news" ලෙස Tabs 3ක් සඳහා
  const [activeTab, setActiveTab] = useState<"events" | "posts" | "news" | "apply">(
    "events"
  );

  // Organizer profile states
  const [committeeName, setCommitteeName] = useState("");
  const [contact_no, setContactNo] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [committeeLogoImageFile, setCommitteeLogoImageFile] =
    useState<File | null>(null);
  const [committeeBannerImageFile, setCommitteeBannerImageFile] =
    useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Post states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feeling, setFeeling] = useState("");
  const [mention, setMention] = useState("");
  const [tagInputText, setTagInputText] = useState("");
  const [postFile, setPostFile] = useState<File | null>(null);
  const [postPreview, setPostPreview] = useState<string | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [postsList, setPostsList] = useState<PostData[]>([]);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [postTags] = useState<string[]>([]);

  // Event Creation States
  const [openModalEvent, setOpenModalEvent] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartingTime, setEventStartingTime] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventImageFile, setEventImageURL] = useState<File | null>(null);
  const [eventImagePreviewUrl, setEventImagePreviewUrl] = useState<
    string | null
  >(null);
  const todayDate = getTodayDate();
  const [postTypeChoice, setPostTypeChoice] = useState("post"); // post, story, both

  const [isApplicationLoading, setApplicationsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const [allUsers, setAllUsers] = useState<{fullname: string, _id: string}[]>([]);
  const [selectedMentions, setSelectedMentions] = useState<{fullname: string, _id: string}[]>([]);
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentionResults, setShowMentionResults] = useState(false);

  const handleShowMore = () => {
      setVisibleCount(prev => prev + 10);
  };

  const toggleMention = (userObj: {fullname: string, _id: string}) => {
    if (selectedMentions.find(m => m._id === userObj._id)) {
        setSelectedMentions(selectedMentions.filter(m => m._id !== userObj._id));
    } else {
        setSelectedMentions([...selectedMentions, userObj]);
    }
    setMentionSearch("");
    setShowMentionResults(false);
  };

  const resetForm = useCallback(() => {
    if (organizerDetails) {
      setCommitteeName(organizerDetails.committeeName);
      setContactNo(organizerDetails.contact_no);
      setEventPlace(organizerDetails.eventPlace);
      setLogoPreviewUrl(organizerDetails.committeeLogoImageURL || null);
      setBannerPreviewUrl(organizerDetails.committeeBannerImageURL || null);
      setCommitteeLogoImageFile(null);
      setCommitteeBannerImageFile(null);
    } else {
      setCommitteeName("");
      setContactNo("");
      setEventPlace("");
      setLogoPreviewUrl(null);
      setBannerPreviewUrl(null);
      setCommitteeLogoImageFile(null);
      setCommitteeBannerImageFile(null);
    }
  }, [organizerDetails]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setFile(null);
      setPreview(
        setPreview === setLogoPreviewUrl
          ? organizerDetails?.committeeLogoImageURL || null
          : organizerDetails?.committeeBannerImageURL || null
      );
    }
  };

  const handleOpenModal = () => {
    resetForm();
    setOpenModal(true);
  };

  const handleOrganizerUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedResponse = await updateOrganizerDetails(
        committeeName,
        contact_no,
        eventPlace,
        committeeLogoImageFile,
        committeeBannerImageFile
      );

      setOrganizerDetails(updatedResponse.data);
      setLogoPreviewUrl(updatedResponse.data.committeeLogoImageURL || null);
      setBannerPreviewUrl(updatedResponse.data.committeeBannerImageURL || null);
      setCommitteeLogoImageFile(null);
      setCommitteeBannerImageFile(null);

      setOpenModal(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update failed:", err);
      alert(
        `Update Failed: ${
          err.response?.data?.message || "Check console for details."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    setIsPostLoading(true);
    try {
      const data = await getMyPosts();
      setPostsList(data || []);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setIsPostLoading(false);
    }
  };

  const loadEventsData = async () => {
    setLoadingEvents(true);
    setEventError(null);
    try {
      const events = await fetchOrganizerEvents();
      setOrganizerEvents(events || []);
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      setEventError("Could not load your events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const res = await getAllUserFullnames();
              console.log("Fetched Users:", res.data); // මෙතැනට දත්ත එනවාදැයි පරීක්ෂා කරන්න
              setAllUsers(res.data || []);
          } catch (err) {
              console.error("Error fetching users:", err);
          }
      };
      fetchUsers();
    }, []);

  const fetchApps = useCallback(async () => {
    setApplicationsLoading(true);
    try {
        const res = await getMyApplications();
        setApplications(res.data || []);
        console.log("Applications fetched:", res.data);
    } catch (err) { 
        console.error("Failed to fetch applications:", err); 
    } finally { 
        setApplicationsLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user && isOrganizer) {
      const loadAllDashboardData = async () => {
        setLoadingDetails(true);
        setError(null);

        try {
          const res = await getOrganizerDetails();
          const details: OrganizerProfile = res.data.data || res.data;
          setOrganizerDetails(details);

          await Promise.all([loadEventsData(), fetchPosts(), fetchApps()]);
        } catch (err: any) {
          console.error("Failed to fetch organizer data:", err);
          setError(
            err.response?.data?.message || "Could not load dashboard data."
          );
        } finally {
          setLoadingDetails(false);
        }
      };

      loadAllDashboardData();
    } else if (!authLoading && !user) {
      setLoadingDetails(false);
    }
  }, [user, authLoading, isOrganizer]);

  if (authLoading || loadingDetails) {
    return (
      <div className="mt-[150px] container mx-auto p-4 text-center text-lg text-blue-500">
        Loading Profile...
      </div>
    );
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
        await updateAppStatus(id, newStatus);
        setApplications(prev => prev.map(app => app._id === id ? { ...app, status: newStatus } : app));
        showAlert({ icon: "success", title: "Updated", text: `Application ${newStatus}!` });
    } catch (err) { alert("Failed to update status"); }
  };

  if (!isOrganizer || error) {
    return (
      <div className="mt-[150px] container mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Profile Access Denied
        </h2>
        {isOrganizer && error ? (
          <p className="text-gray-700">{error}</p>
        ) : (
          <p className="text-gray-700">
            You must register as an organizer to view this profile dashboard.
          </p>
        )}
      </div>
    );
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "post"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "post") {
        setPostFile(file);
        setPostPreview(URL.createObjectURL(file));
      }
    } else {
      if (type === "post") {
        setPostFile(null);
        setPostPreview(null);
      }
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
    fd.append("postingType", postTypeChoice);
    fd.append(
      "mention",
      JSON.stringify(mention.split(" ").map((m) => m.trim()))
    );
    fd.append("tagInput", JSON.stringify(postTags));
    fd.append("postImage", postFile);
    fd.append("userRole", "ORGANIZER");

    try {
      await createPostService(fd);
      alert("Post shared successfully!");
      setOpenPostModal(false);
      setTitle("");
      setDescription("");
      setFeeling("");
      setMention("");
      setTagInputText("");
      setPostPreview(null);
      setPostFile(null);
      await fetchPosts();

      if (postTypeChoice === "story" || postTypeChoice === "both") {
        setStoryKey((prev) => prev + 1);
      }

      fetchPosts();
    } catch (err) {
      alert("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  // Event Creation Handlers
  const handleEventModalResert = () => {
    setEventName("");
    setEventDescription("");
    setCategory("");
    setEventDate("");
    setEventStartingTime("");
    setEventCity("");
    setEventLocation("");
    setEventImageURL(null);
    setEventImagePreviewUrl(null);
  };

  const handleFileChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
      console.log("File deselected.");
    }
  };

  const handleEventCreate = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (
      !eventName ||
      !eventDescription ||
      !category ||
      !eventDate ||
      !eventStartingTime ||
      !eventCity ||
      !eventLocation ||
      !eventImageFile
    ) {
      showAlert({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const currentTime = getCurrentTime();

    if (eventDate === todayDate) {
      if (eventStartingTime <= currentTime) {
        showAlert({
          icon: "error",
          title: "Invalid Time",
          text: "Event starting time must be in the future.",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log("Event Created: Attempting to send data...");

      const eventData = await createEvent(
        eventName,
        eventDescription,
        category,
        new Date(eventDate),
        eventStartingTime,
        eventCity,
        eventLocation,
        eventImageFile
      );
      console.log("Event Data:", eventData);
      showAlert({
        icon: "success",
        title: "Event Created",
        text: "The event has been created successfully.",
      });
      setOpenModal(false);
      window.location.reload();
      handleEventModalResert();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "There was an error creating the event. Please try again.";
      console.error("Error creating event:", error);
      showAlert({
        icon: "error",
        title: "Creation Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };


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

  const districts = [
    { label: "Cover any Place in Sri Lanka", value: "cover_all" },
    { label: "Ampara", value: "Ampara" },
    { label: "Anuradhapura", value: "Anuradhapura" },
    { label: "Badulla", value: "Badulla" },
    { label: "Batticaloa", value: "Batticaloa" },
    { label: "Colombo", value: "Colombo" },
    { label: "Galle", value: "Galle" },
    { label: "Gampaha", value: "Gampaha" },
    { label: "Hambantota", value: "Hambantota" },
    { label: "Jaffna", value: "Jaffna" },
    { label: "Kalutara", value: "Kalutara" },
    { label: "Kandy", value: "Kandy" },
    { label: "Kegalle", value: "Kegalle" },
    { label: "Kilinochchi", value: "Kilinochchi" },
    { label: "Kurunegala", value: "Kurunegala" },
    { label: "Mannar", value: "Mannar" },
    { label: "Matale", value: "Matale" },
    { label: "Matara", value: "Matara" },
    { label: "Monaragala", value: "Monaragala" },
    { label: "Mullaitivu", value: "Mullaitivu" },
    { label: "Nuwara Eliya", value: "Nuwara Eliya" },
    { label: "Polonnaruwa", value: "Polonnaruwa" },
    { label: "Puttalam", value: "Puttalam" },
    { label: "Ratnapura", value: "Ratnapura" },
    { label: "Trincomalee", value: "Trincomalee" },
    { label: "Vavuniya", value: "Vavuniya" },
  ];

  const categoryOptions = [
    { label: "Cricket", value: "cricket" },
    { label: "football", value: "football" },
    { label: "Rugby", value: "rugby" },
    { label: "Volleyball", value: "volleyball" },
    { label: "Badminton", value: "badminton" },
    { label: "Tennis", value: "tennis" },
    { label: "Hockey", value: "hockey" },
    { label: "Table Tennis", value: "table_tennis" },
    { label: "Online Gaming", value: "online_gaming" },
    { label: "Swimming", value: "swimming" },
    { label: "Athletics", value: "athletics" },
    { label: "Cycling", value: "cycling" },
    { label: "Martial Arts", value: "martial_arts" },
    { label: "Other", value: "other" },
  ];

  const cityOptions = [
    { label: "Any City", value: "Any City" },
    { label: "Ampara", value: "Ampara" },
    { label: "Anuradhapura", value: "Anuradhapura" },
    { label: "Badulla", value: "Badulla" },
    { label: "Batticaloa", value: "Batticaloa" },
    { label: "Colombo", value: "Colombo" },
    { label: "Galle", value: "Galle" },
    { label: "Gampaha", value: "Gampaha" },
    { label: "Hambantota", value: "Hambantota" },
    { label: "Jaffna", value: "Jaffna" },
    { label: "Kalutara", value: "Kalutara" },
    { label: "Kandy", value: "Kandy" },
    { label: "Kegalle", value: "Kegalle" },
    { label: "Kilinochchi", value: "Kilinochchi" },
    { label: "Kurunegala", value: "Kurunegala" },
    { label: "Mannar", value: "Mannar" },
    { label: "Matale", value: "Matale" },
    { label: "Matara", value: "Matara" },
    { label: "Monaragala", value: "Monaragala" },
    { label: "Mullaitivu", value: "Mullaitivu" },
    { label: "Nuwara Eliya", value: "Nuwara Eliya" },
    { label: "Polonnaruwa", value: "Polonnaruwa" },
    { label: "Puttalam", value: "Puttalam" },
    { label: "Ratnapura", value: "Ratnapura" },
    { label: "Trincomalee", value: "Trincomalee" },
    { label: "Vavuniya", value: "Vavuniya" },
  ];

  return (
    <div className="mt-40 container mx-auto px-0 sm:px-4 pb-12">
      <div className="bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
        <div className="relative h-64 md:h-[28rem] lg:h-[32rem] bg-slate-900">
          <img
            src={
              organizerDetails?.committeeBannerImageURL ||
              "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80"
            }
            className="w-full h-full object-cover opacity-70 md:opacity-60"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden md:block" />
        </div>

        <div className="relative px-6 py-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-24 md:-mt-32 lg:-mt-40">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 w-full md:w-auto text-center md:text-left">
              <div className="relative">
                <img
                  src={
                    organizerDetails?.committeeLogoImageURL ||
                    "https://ui-avatars.com/api/?name=Organizer"
                  }
                  className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full md:rounded-[2.5rem] border-[4px] md:border-[8px] border-white object-cover bg-white shadow-2xl"
                  alt="Logo"
                />
              </div>

              <div className="space-y-1 md:space-y-2 mb-2">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none [text-shadow:-2px_-2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff,2px_2px_0_#fff]">
                    {organizerDetails?.committeeName || "Committee Name"}
                  </h1>
                  <ShieldCheck className="text-blue-500 shrink-0" size={32} />
                  <Button color="black" onClick={handleOpenModal}>
                    <img
                      className="w-4"
                      src={"https://i.ibb.co/svfktKvj/compose-1.png"}
                      alt=""
                    />
                  </Button>
                </div>
                <p className="text-blue-600 font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs">
                  Verified Event Organizer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 border-t border-gray-50">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <h3 className="flex items-center gap-2 font-black text-blue-600 uppercase text-[10px] tracking-[0.2em]">
              <Info size={16} /> About Organizer
            </h3>
            <div className="bg-gray-50/50 md:bg-transparent rounded-3xl p-6 md:p-0">
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl lg:text-2xl font-medium italic">
                {"Supporting local sports and community events."}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-6 md:p-8 space-y-6 h-fit">
            <h3 className="font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">
              Official Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Phone size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Contact
                  </p>
                  <p className="font-bold text-gray-800">
                    {organizerDetails?.contact_no || "N/A"}
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
                  <p className="font-bold text-gray-800 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                  <MapPin size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase">
                    Venue
                  </p>
                  <p className="font-bold text-gray-800 truncate">
                    {organizerDetails?.eventPlace || "Sri Lanka"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 z-0">
        <Button
          onClick={() => setOpenPostModal(true)}
          color="white"
          className="rounded-2xl shadow-2xl gap-2 px-6 py-3 border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-blue-600" />
            <p className="text-black font-bold">+ Add News</p>
          </div>
        </Button>

        <Button
          onClick={() => setOpenModalEvent(true)}
          color="white"
          className="rounded-2xl shadow-2xl gap-2 px-6 py-3 border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            <p className="text-black font-bold">+ Add Event</p>
          </div>
        </Button>

        <Button
          onClick={() => setOpenPostModal(true)}
          color="white"
          className="rounded-2xl shadow-2xl gap-2 px-6 py-3 border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-blue-600" />
            <p className="text-black font-bold">+ Add Post</p>
          </div>
        </Button>
      </div>

      <div className="max-w-[700px] mx-auto mb-10">
        <Story key={storyKey} onOpenModal={() => setOpenPostModal(true)} />
      </div>

      {/* navigate tabs */}
      <div className="max-w-[700px] mx-auto mt-12 px-4">
        <div className="flex items-center justify-around border-b-2 border-gray-100 mb-8">
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "events"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "posts"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "news"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            News
          </button>
          <button 
            onClick={() => setActiveTab('apply')}
            className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${
              activeTab === "apply"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Applications
          </button>
        </div>

        <div className="mt-6">
          {/* --- EVENTS TAB --- */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-l-4 border-blue-600 pl-4 mb-6">
                <h2 className="text-xl font-black uppercase text-gray-800 tracking-tighter">
                  My Events
                </h2>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  Total: {organizerEvents.length}
                </span>
              </div>

              {loadingEvents ? (
                <div className="text-center py-20 text-gray-400 font-bold animate-pulse uppercase">
                  Loading events...
                </div>
              ) : eventError ? (
                <div className="text-center py-20 text-red-500 font-bold uppercase">
                  {eventError}
                </div>
              ) : organizerEvents.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
                  You have not created any events yet.
                </div>
              ) : (
                <div className="space-y-10">
                  {organizerEvents.map((event) => (
                    <ProfileEvent key={event._id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- POSTS (TIMELINE) TAB --- */}
          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-l-4 border-blue-600 pl-4 mb-6">
                <h3 className="text-xl font-black uppercase text-gray-800 tracking-tighter flex items-center gap-2">
                  <Camera size={20} className="text-blue-600" /> My Timeline
                </h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  Recent Updates
                </span>
              </div>
              
              {isPostLoading ? (
                <div className="text-center py-20 text-gray-400 font-bold animate-pulse uppercase">
                  Refreshing Feed...
                </div>
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
          )}

          {/* --- NEWS TAB --- */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-4 mb-6">
                <h3 className="text-xl font-black uppercase text-gray-800 tracking-tighter">
                  Organizer News
                </h3>
              </div>

              <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
                🚀 Community News Coming Soon...
              </div>
            </div>
          )}

          {/* --- APPLY TAB --- */}
          {activeTab === "apply" && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. Header Section */}
                <div className="flex items-center justify-between border-l-4 border-blue-600 pl-4 mb-8">
                    <h3 className="text-2xl font-black uppercase text-gray-800 tracking-tighter">
                        Pending <span className="text-blue-600">Requests</span>
                    </h3>
                </div>

                {isApplicationLoading ? (
                    <div className="text-center py-20 animate-pulse font-black text-gray-400 tracking-widest uppercase">Syncing Applications...</div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100 italic text-gray-400 font-bold">
                        No applications received yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 2. පෙන්විය යුතු ප්‍රමාණයට පමණක් Slice කිරීම */}
                        {applications.slice(0, visibleCount).map((app) => (
                            <ApplicationCard 
                                key={app._id} 
                                app={app} 
                                handleStatusChange={handleStatusChange} 
                            />
                        ))}

                        {/* 3. Show More Button - තවත් දත්ත ඇත්නම් පමණක් පෙන්වයි */}
                        {applications.length > visibleCount && (
                            <div className="flex justify-center mt-12 mb-8">
                                <button 
                                    onClick={handleShowMore}
                                    className="px-10 py-4 bg-white border-2 border-gray-100 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                                >
                                    Show More Applications (+{applications.length - visibleCount})
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}
        </div>
      </div>

      <Modal isOpen={openModalEvent} onClose={() => setOpenModalEvent(false)}>
        <div className="max-w-3xl mx-auto p-2">
          <h2 className="text-2xl font-black uppercase mb-4">
            Create New Event
          </h2>

          <form className="flex flex-col overflow-auto max-h-[70vh]">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1">
                Event Media Content
              </label>

              <div className="relative group w-full bg-gray-50 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-gray-200 transition-all hover:border-blue-500 hover:bg-blue-50/30">
                <div className="aspect-square sm:aspect-square md:max-h-[500px] flex items-center justify-center relative">
                  {eventImagePreviewUrl ? (
                    <img
                      src={eventImagePreviewUrl}
                      className="w-full h-full object-cover"
                      alt="Post Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="p-6 bg-white rounded-full shadow-sm">
                        <Camera
                          size={40}
                          strokeWidth={1.2}
                          className="text-gray-300"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                          Select Media
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 italic">
                          Square (1:1) Recommended
                        </p>
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleFileChangeEvent(
                          e,
                          setEventImageURL,
                          setEventImagePreviewUrl
                        )
                      }
                    />
                  </label>
                </div>

                {eventImagePreviewUrl && (
                  <button
                    type="button"
                    onClick={() => setEventImagePreviewUrl(null)}
                    className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2 rounded-full hover:bg-red-500 transition-colors backdrop-blur-md"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <Input
              label="Event Name"
              required
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />

            <label
              htmlFor="eventDescription"
              className="block text-gray-800 font-medium mb-1"
            >
              Event Descriptions <span className="text-red-600">*</span>
            </label>

            <textarea
              id="eventDescription"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200 resize-none"
              placeholder="Enter event description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              style={{ minHeight: "150px" }}
            ></textarea>

            <Select
              label="Event Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
            />

            <Input
              label="Event Date"
              required
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={todayDate}
            />

            <Input
              label="Event Starting Time"
              required
              type="time"
              value={eventStartingTime}
              onChange={(e) => setEventStartingTime(e.target.value)}
            />

            <Select
              label="Event City"
              required
              value={eventCity}
              onChange={(e) => setEventCity(e.target.value)}
              options={cityOptions}
            />

            <Input
              label="Event Place/Location Name"
              required
              placeholder="Enter event location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />

            <div className="flex flex-col gap-3 justify-end space-x-4 mt-4">
              <Button
                type="button"
                className="w-full bg-gray-600 text-white font-black py-4 rounded-2xl"
                color="gray"
                onClick={handleEventModalResert}
                disabled={isLoading}
              >
                Resert Form
              </Button>
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
                color="blue"
                onClick={handleEventCreate}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={openPostModal} onClose={() => setOpenPostModal(false)}>
        <div className="max-w-3xl mx-auto p-2">
          <h2 className="text-2xl font-black uppercase mb-4">
            Create New Post
          </h2>
          <form className="flex flex-col overflow-auto max-h-[70vh]">
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
                        <Camera
                          size={40}
                          strokeWidth={1.2}
                          className="text-gray-300"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                          Select Media
                        </p>
                        <p className="text-[10px] font-medium text-gray-400 mt-1 italic">
                          Square (1:1) Recommended
                        </p>
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

            <Input
              label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <Select
              label="How are you feeling?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              options={feelingOptions}
            />

            {/* <Input
              label="Mentions (comma separated)"
              value={mention}
              onChange={(e) => setMention(e.target.value)}
              placeholder="@mention"
            /> */}            

            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-blue-500 font-bold text-sm"
                    placeholder="Search friends to mention..."
                    value={mentionSearch}
                    onChange={(e) => {
                        setMentionSearch(e.target.value);
                        setShowMentionResults(true);
                    }}
                    onFocus={() => setShowMentionResults(true)}
                />

                {/* Dropdown Results */}
                {showMentionResults && mentionSearch && (
                    <div className="absolute z-[150] w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-48 overflow-y-auto no-scrollbar">
                        {allUsers
                            .filter(u => u.fullname.toLowerCase().includes(mentionSearch.toLowerCase()))
                            .map(u => (
                                <div 
                                    key={u._id}
                                    onClick={() => toggleMention(u)}
                                    className="p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors"
                                >
                                    <span className="font-black text-xs uppercase tracking-widest text-gray-700">{u.fullname}</span>
                                    <Plus size={14} className="text-blue-600" />
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
                {selectedMentions.map(m => (
                    <span key={m._id} className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                        @{m.fullname}
                        <X size={12} className="cursor-pointer" onClick={() => toggleMention(m)} />
                    </span>
                ))}
            </div>

            <label
              htmlFor="description"
              className="text-black font-semibold mb-1"
            >
              Description
            </label>
            <textarea
              className="w-full p-4 rounded-2xl border border-gray-300 rounded focus:outline-none focus:border-blue-300 backdrop-blur-sm"
              placeholder="What's on your mind?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ minHeight: "150px" }}
            />

            <Input
              label="Tags (e.g. Winner, Goal)"
              value={tagInputText}
              onChange={(e) => setTagInputText(e.target.value)}
              placeholder="#tags..."
            />

            <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 my-4">
              <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-3 block ml-1">
                Where to post?
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["post", "story", "both"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostTypeChoice(type)}
                    className={`py-3 px-2 rounded-2xl text-[10px] font-black uppercase transition-all border-2 
                          ${
                            postTypeChoice === type
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                              : "bg-white border-gray-100 text-gray-400 hover:border-blue-200"
                          }`}
                  >
                    {type === "both" ? "Feed & Story" : type}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-gray-400 mt-3 ml-1 italic italic">
                * Stories will disappear after 24 hours.
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <Button
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
                onClick={handlePostCreate}
              >
                {isLoading ? "Posting..." : "Post Now"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Update Organizer Profile
        </h2>

        <form onSubmit={handleOrganizerUpdate} onReset={resetForm}>
          <Input
            type="text"
            label="Committee Name"
            placeholder="Enter committee name"
            value={committeeName}
            maxLength={50}
            onChange={(e) => setCommitteeName(e.target.value)}
            required
          />

          <Input
            type="text"
            label="Contact Number"
            placeholder="07XX-XXXXXX"
            value={contact_no}
            maxLength={10}
            onChange={(e) => setContactNo(e.target.value)}
          />

          <Select
            label="Event Place (Main Operating District)"
            value={eventPlace}
            onChange={(e) => setEventPlace(e.target.value)}
            options={districts}
          />

          <div className="mt-4">
            <Input
              label={`Committee Logo (Current: ${
                organizerDetails?.committeeLogoImageURL ? "Yes" : "No"
              })`}
              type="file"
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(
                  e,
                  setCommitteeLogoImageFile,
                  setLogoPreviewUrl
                )
              }
              accept="image/*"
            />
            {(logoPreviewUrl || organizerDetails?.committeeLogoImageURL) && (
              <div className="mt-2 mb-4">
                <h4 className="text-sm text-gray-600 mb-1">Logo Preview:</h4>
                <img
                  src={
                    logoPreviewUrl ||
                    organizerDetails?.committeeLogoImageURL ||
                    ""
                  }
                  alt="Logo Preview"
                  className="w-24 h-24 object-cover rounded-md border-2 border-blue-400"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Input
              label={`Committee Banner (Current: ${
                organizerDetails?.committeeBannerImageURL ? "Yes" : "No"
              })`}
              type="file"
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(
                  e,
                  setCommitteeBannerImageFile,
                  setBannerPreviewUrl
                )
              }
              accept="image/*"
            />
            {(bannerPreviewUrl ||
              organizerDetails?.committeeBannerImageURL) && (
              <div className="mt-2 mb-4">
                <h4 className="text-sm text-gray-600 mb-1">Banner Preview:</h4>
                <img
                  src={
                    bannerPreviewUrl ||
                    organizerDetails?.committeeBannerImageURL ||
                    ""
                  }
                  alt="Banner Preview"
                  className="w-full h-32 object-cover rounded-md border-2 border-blue-400"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="reset"
              disabled={isLoading}
              className="flex-1 border-2 border-gray-500 text-[18px] hover:bg-gray-500 text-gray-500 hover:text-white font-semibold py-3 px-4 rounded transition-colors duration-300"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 border-2 text-[18px] font-semibold py-3 px-4 rounded transition-colors duration-300 ${
                isLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}