import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, MapPin, Calendar, Clock, UserPlus, Eye, Info, CheckCircle } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/authContext";
import type { EventData } from "../../service/event";
import { } from "../../service/event";
import { applyForEventService, checkAppliedStatusService } from "../../service/application";
import { fetchAllEvents } from "../../service/event";
import Modal from "../Modal/Modal";
import { showAlert } from "../Swail";

const EventCard: React.FC<{ event: EventData }> = ({ event }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const isPlayer = user?.roles?.includes("PLAYER");
  const isPast = moment().isAfter(moment(event.eventDate).endOf('day'));
  // Modal එක විවෘත කළ විට දැනටමත් Apply කර ඇත්දැයි බලමු
  useEffect(() => {
    if (isModalOpen && isPlayer) {
      checkStatus();
    }
  }, [isModalOpen]);

  const checkStatus = async () => {
    try {
      const res = await checkAppliedStatusService(event._id);
      setHasApplied(res.applied);
    } catch (err) { console.error(err); }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await applyForEventService(event._id);
      setHasApplied(true);
      showAlert({ icon: "success", title: "Applied!", text: "Your application sent to organizer." });
    } catch (err: any) {
      showAlert({ icon: "error", title: "Failed", text: err.response?.data?.message || "Error applying." });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8 transition-all hover:shadow-md">
        {/* Header - Organizer Info */}
        <div className="p-6 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                 <img src={event.userId?.organizerProfile?.committeeLogoImageURL || `https://ui-avatars.com/api/?name=O&background=random`} className="w-full h-full object-cover" alt="Logo" />
              </div>
              <div className="overflow-hidden">
                  <Link to={`/organizer/${event.userId?.organizerProfile?._id}`}>
                    <p className="font-black text-gray-800 text-sm leading-none truncate hover:underline">
                      Organized by: {event.userId?.organizerProfile?.committeeName}
                    </p>
                  </Link>
                 <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{moment(event.createdAt).fromNow()}</p>
              </div>
           </div>
           <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">{event.EventStatus}</div>
        </div>

        {/* Content Title */}
        <div className="px-6 pb-4">
           <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight line-clamp-1">{event.eventName}</h3>
           <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase mt-1">
              <MapPin size={12} className="text-red-500" /> {event.eventCity}
           </div>
        </div>

        {/* Image - 220px Fixed */}
        <div className="w-full max-h-220 bg-gray-50 overflow-hidden relative border-y border-gray-50">
           <img src={event.eventImageURL} className="w-full h-full object-cover" alt="Event" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-8 flex items-center justify-between bg-white">
           <div className="flex gap-6">
              <Heart size={20} className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
              <MessageCircle size={20} className="text-gray-300 hover:text-blue-500 cursor-pointer transition-colors" />
           </div>
           
           {/* VIEW BUTTON */}
           <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-zinc-200"
           >
              <Eye size={14} strokeWidth={3} /> View Details
           </button>
        </div>
      </div>

      {/* 🚀 MODAL - VIEW FULL DETAILS */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
         <div className="max-w-2xl mx-auto p-2 overflow-y-auto max-h-[90vh] no-scrollbar">
            {/* Modal Cover */}
            <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-xl mb-6">
               <img src={event.eventImageURL} className="w-full h-full object-cover" alt="Event Cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <div className="absolute bottom-6 left-8">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block shadow-lg">{event.category}</span>
                  <h2 className="text-white text-3xl font-black uppercase tracking-tighter leading-none">{event.eventName}</h2>
               </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 px-2">
               <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Event Date</p>
                     <p className="font-bold text-gray-800 text-xs">{moment(event.eventDate).format("MMMM Do YYYY")}</p>
                  </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Starting Time</p>
                     <p className="font-bold text-gray-800 text-xs">{event.eventStartingTime}</p>
                  </div>
               </div>
               <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 col-span-2 flex items-center gap-3">
                  <MapPin className="text-red-500" size={20} />
                  <div>
                     <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Full Location</p>
                     <p className="font-bold text-gray-800 text-xs">{event.eventLocation}, {event.eventCity}</p>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="mt-6 px-2">
               <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2"><Info size={14}/> About this Event</h4>
               <div className="bg-white border border-gray-100 p-5 rounded-3xl min-h-[120px] shadow-inner">
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{event.eventDescription}"</p>
               </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="p-4 mt-4">
               {isPlayer ? (
                  isPast ? (
                    <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase text-xs border-2 border-gray-200 cursor-not-allowed">
                      <Clock size={18} /> Event Finished
                    </div>
                  ) : hasApplied ? (
                    <div className="w-full bg-green-50 text-green-600 py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black uppercase text-xs border-2 border-green-200">
                      <CheckCircle size={18} /> You have Applied
                    </div>
                  ) : (
                    <button 
                      onClick={handleApply}
                      disabled={isApplying}
                      className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95"
                    >
                      {isApplying ? "Processing..." : <><UserPlus size={18} strokeWidth={3} /> Apply Now</>}
                    </button>
                  )
                ) : (
                  <p className="text-center text-gray-400 text-[10px] font-black uppercase italic tracking-widest">
                    Only Verified Players can apply for this event
                  </p>
                )}
            </div>
         </div>
      </Modal>
    </>
  );
};

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-8 ml-4">Trending Community Events</h3>
      {loading ? (
        <div className="animate-pulse space-y-8">
           {[1,2].map(i => <div key={i} className="w-full h-80 bg-gray-100 rounded-[2.5rem]" />)}
        </div>
      ) : (
        events.map(ev => <EventCard key={ev._id} event={ev} />)
      )}
    </div>
  );
}