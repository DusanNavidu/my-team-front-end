import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganizerDetailsForVisitUsers } from "../service/organizer";
import VisitProfilePost from "../components/post/VisitProfilePost";
import type { EventData } from "../service/event"; 
import { fetchEventsByOrganizerId } from "../service/event";
import { CalendarDays } from "lucide-react";

interface OrganizerProfile {
    _id: string;
    committeeName: string;
    contact_no: string;
    eventPlace: string;
    committeeLogoImageURL: string;
    committeeBannerImageURL: string;
    status: string;
    }

export default function VisitProfile() {
    const { id } = useParams<{ id: string }>();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const organizer = events.length > 0 ? events[0].userId?.organizerProfile : null;
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
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="mt-40 text-center font-bold text-blue-600 animate-pulse">Loading Profile...</div>;
    if (error) return <div className="mt-40 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="container mx-auto mt-2">
            <div className=" bg-white rounded-xl shadow-lg rounded-t-none
">
                <div className="relative">
                    <img
                        src={organizer?.committeeBannerImageURL || 'banner_placeholder.jpg'}
                        alt="Banner"
                        className="w-full object-cover h-48 sm:h-56 lg:h-64"
                    />
                    <img
                        src={organizer?.committeeLogoImageURL || 'logo_placeholder.jpg'}
                        alt="Logo"
                        className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-cover rounded-full border-4 border-white absolute bottom-0 left-4 sm:left-6 lg:left-8 transform translate-y-1/2"
                    />
                </div>

                <div className="p-4 sm:p-6 lg:p-8 lg:-mt-20 md:-mt-18">
                    <div className="flex flex-col sm:flex-row items-start pt-2 mt-10 sm:mt-12 lg:mt-16">
                        <div className="hidden sm:block w-36 lg:w-44 h-auto mr-4"></div>
                        <div>
                            <div className="flex items-center space-x-4 mb-2">
                                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                                    {organizer?.committeeName || 'Committee Name'}
                                </h1>
                            </div>
                            <p className="text-gray-600">
                                Contact: {organizer?.contact_no}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-12 px-4 w-full max-w-[680px]">
                <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-black text-gray-800 uppercase flex items-center gap-2">
                        <CalendarDays className="text-blue-600" /> Recent Events
                    </h2>
                </div>

                {events.length === 0 ? (
                    <div className="bg-white p-20 rounded-3xl text-center shadow-sm border border-gray-100 italic text-gray-400">
                        No Events Posted Yet.
                    </div>
                ) : (
                    <div className="space-y-12">
                        {events.map((event) => (
                            <VisitProfilePost key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}