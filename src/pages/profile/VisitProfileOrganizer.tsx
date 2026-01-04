import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisitProfilePost from "../../components/post/organizer/VisitProfilePostOrganizer";
import type { EventData } from "../../service/event";
import { fetchEventsByOrganizerId } from "../../service/event";
import {
  CalendarDays,
  Phone,
  Mail,
  ShieldCheck,
  MapPin,
  Info,
} from "lucide-react";

export default function VisitProfileOrganizer () {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const organizer =
    events.length > 0 ? events[0].userId?.organizerProfile : null;
  const userDetails = events.length > 0 ? events[0].userId : null;

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchEventsByOrganizerId(id);
        setEvents(data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setError("Failed to load organizer profile.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="mt-40 text-center font-black text-blue-600 animate-pulse uppercase tracking-widest">
        Synchronizing Profile...
      </div>
    );

  if (error)
    return (
      <div className="mt-40 text-center text-red-500 font-black uppercase">
        {error}
      </div>
    );

  return (
    <div className="mt-2 container mx-auto px-0 sm:px-4 pb-12">
      <div className="bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative">
        <div className="relative h-64 md:h-[28rem] lg:h-[32rem] bg-slate-900">
          <img
            src={
              organizer?.committeeBannerImageURL ||
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
                    organizer?.committeeLogoImageURL ||
                    "https://ui-avatars.com/api/?name=Organizer"
                  }
                  className="w-36 h-36 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full md:rounded-[2.5rem] border-[4px] md:border-[8px] border-white object-cover bg-white shadow-2xl"
                  alt="Logo"
                />
              </div>

              <div className="space-y-1 md:space-y-2 mb-2">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none [text-shadow:-2px_-2px_0_#fff,2px_-2px_0_#fff,-2px_2px_0_#fff,2px_2px_0_#fff]">
                    {organizer?.committeeName || "Committee Name"}
                  </h1>
                  <ShieldCheck className="text-blue-500 shrink-0" size={32} />
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
              Official Channels
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
                    {organizer?.contact_no || "N/A"}
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
                    {userDetails?.email}
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
                    {organizer?.eventPlace || "Sri Lanka"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 px-4 w-full max-w-[750px]">
        <div className="flex items-center justify-between mb-10 border-b-4 border-gray-900 pb-4">
          <h2 className="text-3xl font-black text-gray-900 uppercase flex items-center gap-3 tracking-tighter">
            <CalendarDays className="text-blue-600" size={32} /> Recent Events
          </h2>
          <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-bold">
            {events.length} TOTAL
          </span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center shadow-2xl border border-gray-100 italic text-gray-400 font-bold text-xl">
            No Events Posted Yet.
          </div>
        ) : (
          <div className="space-y-16">
            {events.map((event) => (
              <VisitProfilePost key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
