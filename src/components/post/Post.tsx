import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllEvents } from "../../service/event";
import type { EventData } from "../../service/event";
import Button from "../Button";
import { Heart, MessageCircle, UserPlus, Share2 } from "lucide-react";
import { useAuth } from "../../context/authContext";

interface EventCardProps {
  event: EventData;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  let statusColor = "";
  if (event.EventStatus === "UPCOMING") {
    statusColor = "bg-green-500";
  } else if (event.EventStatus === "PAST") {
    statusColor = "bg-gray-500";
  } else {
    statusColor = "bg-red-500";
  }

  const { user } = useAuth();
  const isOrganizer = user?.roles?.includes("ORGANIZER") || false;
  const isUser = user?.roles?.includes("USER") || false;

  const organizer = event.userId?.organizerProfile;
  const committeeName = organizer?.committeeName || "Official Organizer";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] border border-gray-200">
      <div className="relative h-48">
        <img
          src={event.eventImageURL || "placeholder.jpg"}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-3 py-1 rounded-full text-white ${statusColor}`}
        >
          {event.EventStatus}
        </span>
      </div>
    
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
          {event.category} - {event.eventName}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {event.eventCity}, {event.eventLocation}
        </p>
        <Link to={`/organizer/${organizer?._id}`}>
          <p className="text-sm mb-3 text-blue-500 italic">
            Organized by: {committeeName}
          </p>
        </Link>

        <div className="flex justify-between text-sm mb-4">
          <span className="font-medium text-blue-600">📅 {formattedDate}</span>
          <span className="font-medium text-gray-700">
            🕒 {event.eventStartingTime}
          </span>
        </div>

        <div
          id="social"
          className="flex justify-between items-center space-x-4 pt-2 border-t border-gray-100"
        >
          <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200">
            <Heart className="w-5 h-5 mr-1" strokeWidth={1.5} />
            <span className="text-sm">Like</span>
          </button>

          <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-200">
            <MessageCircle className="w-5 h-5 mr-1" strokeWidth={1.5} />
            <span className="text-sm">Comment</span>
          </button>

          {event.EventStatus === "UPCOMING" && !isOrganizer && !isUser && (
            <Button color="green" className="py-1 px-3 text-xs font-semibold">
              <span className="flex items-center">
                <UserPlus className="w-4 h-4 mr-1" strokeWidth={2} />
                Apply
              </span>
            </Button>
          )}

          <button className="text-gray-500 hover:text-gray-900 transition-colors duration-200">
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err: any) {
        console.error("Failed to load events:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch events from server.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  let content;

  if (isLoading) {
    content = <p className="text-lg text-blue-500 mt-8">Loading events...</p>;
  } else if (error) {
    content = (
      <p className="text-lg text-red-500 mt-8">Error loading events: {error}</p>
    );
  } else if (events.length === 0) {
    content = <p className="text-lg text-gray-500 mt-8">No events found.</p>;
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    );
  }

  return <div className="w-full container mx-auto p-4">{content}</div>;
}
