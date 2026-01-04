import React, { useState } from "react";
import type { EventData } from "../../../service/event";
import Button from "../../Button";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  Calendar,
  MapPin,
  Clock,
  MoreVertical,
} from "lucide-react";
import moment from "moment";
import { useAuth } from "../../../context/authContext";

interface EventCardProps {
  event: EventData;
}

const VisitProfilePostOrganizer: React.FC<EventCardProps> = ({ event }) => {
  const [showFull, setShowFull] = useState(false);
  const organizer = event.userId?.organizerProfile;

  const formatDate = (dateString: string) => {
    return moment(dateString).format("MMMM Do, YYYY");
  };
  const { user } = useAuth();
  const isOrganizer =
    user?.roles?.includes("ORGANIZER") || user?.roles?.includes("USER");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-green-100 text-green-800";
      case "PAST":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "BANNED":
        return "bg-black text-white";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const calculateTimeAgo = (dateString: string) => {
    const now = moment();
    const createdAt = moment(dateString);
    const diff = moment.duration(now.diff(createdAt));

    const minutes = diff.asMinutes();
    const hours = diff.asHours();
    const days = diff.asDays();
    const weeks = diff.asWeeks();
    const months = diff.asMonths();
    const years = diff.asYears();

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    if (days < 7) return `${Math.floor(days)} days ago`;
    if (weeks < 4) return `${Math.floor(weeks)} weeks ago`;
    if (months < 12) return `${Math.floor(months)} months ago`;

    return `${Math.floor(years)} years ago`;
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className='className="w-12 h-12 rounded-full'>
            <img
              src={
                organizer?.committeeLogoImageURL ||
                "https://cdn-icons-png.flaticon.com/512/147/147144.png"
              }
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>

          <div>
            <h4 className="">
              <span className="font-bold">
                {event.eventName || "Untitled Post"}
              </span>
              {" - "}
              <span className="text-blue-500 font-bold uppercase">
                {event.category}{" "}
              </span>

              <span>
                {" "}
                tournament is organized by{" "}
                <span className="text-blue-500">
                  {organizer?.committeeName || "Official Organizer"}
                </span>
              </span>
            </h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {new Date(event.createdAt).toLocaleDateString()} •{" "}
              {event.EventStatus}
            </p>
          </div>
        </div>
        <MoreVertical className="text-gray-400 cursor-pointer" />
      </div>

      <div className="px-6 pb-4 text-gray-700 text-sm mb-4">
        {" "}
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-indigo-500" />{" "}
          <span>
            {formatDate(event.eventDate)} at {event.eventStartingTime}{" "}
          </span>{" "}
        </div>{" "}
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />{" "}
          <span>
            {event.eventLocation}, {event.eventCity}{" "}
          </span>
        </div>
      </div>

      <div className="px-6 pb-4">
        <p className="text-gray-600 mb-4 transition-all duration-300">
          <span className={showFull ? "" : "line-clamp-2"}>
            {event.eventDescription}
          </span>

          {event.eventDescription?.length > 120 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="ml-2 text-black font-semibold hover:underline"
            >
              {showFull ? "See less" : "See more"}
            </button>
          )}
        </p>

        {/* <div className="flex flex-wrap gap-2">
              {post.tagInput.map(tag => (
                  <span key={tag} className="text-blue-500 text-xs font-bold italic">{tag}</span>
              ))}
          </div> */}
      </div>

      {event.eventImageURL && (
        <div className="w-full">
          <img
            src={event.eventImageURL}
            className="w-full max-h-250 object-cover"
            alt="Post"
          />
        </div>
      )}

      <div className="p-6 flex items-center justify-between border-t border-gray-50">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={20} />{" "}
            <span className="text-xs font-bold">
              {event.likes?.length || 0}
            </span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
            <MessageCircle size={20} />{" "}
            <span className="text-xs font-bold">
              {event.comments?.length || 0}
            </span>
          </button>
        </div>
        <Share2
          size={20}
          className="text-gray-400 cursor-pointer hover:text-green-500"
        />
      </div>
    </div>
    //   <div>
    //     <div className="flex justify-between">
    //       <p className="text-sm text-gray-500 mb-2">
    //         {moment(event.createdAt).format("MMMM Do, YYYY")}
    //       </p>
    //       <p className="text-sm text-gray-500 mb-2">
    //         {calculateTimeAgo(event.createdAt.toString())}
    //       </p>
    //     </div>
    //     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    //       <div className="relative">
    //         <img
    //           src={event.eventImageURL || "event_placeholder.jpg"}
    //           alt={event.eventName}
    //           className="w-full max-h-210 object-cover"
    //         />
    //         <span
    //           className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded ${getStatusBadge(
    //             event.EventStatus
    //           )}`}
    //         >
    //           {event.EventStatus}
    //         </span>
    //       </div>

    //       <div className="p-4">
    //         <h3
    //           className="text-xl font-bold text-gray-900 truncate mb-1"
    //           title={event.eventName}
    //         >
    //           {event.eventName}
    //         </h3>
    //         <p className="text-sm text-blue-600 font-medium mb-3">
    //           {event.category}
    //         </p>

    //         <div className="space-y-2 text-gray-700 text-sm mb-4">
    //           <div className="flex items-center">
    //             <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
    //             <span>
    //               {formatDate(event.eventDate)} at {event.eventStartingTime}
    //             </span>
    //           </div>
    //           <div className="flex items-center">
    //             <MapPin className="w-4 h-4 mr-2 text-red-500" />
    //             <span>
    //               {event.eventLocation}, {event.eventCity}
    //             </span>
    //           </div>
    //         </div>

    //         <div className="mb-4 flex flex-col">
    //           <p
    //             className={`text-gray-600 mb-4 transition-all duration-300 ${
    //               showFull ? "" : "line-clamp-2"
    //             }`}
    //           >
    //             {event.eventDescription}
    //           </p>

    //           <button
    //             onClick={() => setShowFull(!showFull)}
    //             className="self-start border px-3 py-1 rounded-full text-sm w-full
    //                       hover:bg-black hover:text-white transition duration-300"
    //           >
    //             {showFull ? "Show Less" : "Read More"}
    //           </button>
    //         </div>

    //         <div
    //           id="social"
    //           className="flex justify-between items-center space-x-4 pt-2 border-t border-gray-100"
    //         >
    //           <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200">
    //             <Heart className="w-5 h-5 mr-1" strokeWidth={1.5} />
    //             <span className="text-sm">Like</span>
    //           </button>

    //           <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-200">
    //             <MessageCircle className="w-5 h-5 mr-1" strokeWidth={1.5} />
    //             <span className="text-sm">Comment</span>
    //           </button>

    //           {!isOrganizer && (
    //             <Button color="green" className="py-1 px-3 text-xs font-semibold">
    //               <span className="flex items-center">
    //                 <UserPlus className="w-4 h-4 mr-1" strokeWidth={2} />
    //                 Apply
    //               </span>
    //             </Button>
    //           )}

    //           <button className="text-gray-500 hover:text-gray-900 transition-colors duration-200">
    //             <Share2 className="w-5 h-5" strokeWidth={1.5} />
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
  );
};

export default VisitProfilePostOrganizer;
