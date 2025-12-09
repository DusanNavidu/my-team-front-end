import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { getOrganizerDetails } from "../service/organizer";

interface OrganizerProfile {
    committeeName: string;
    contact_no: string;
    eventPlace: string;
    committeeLogoImageURL: string;
    committeeBannerImageURL: string;
    status: string;
}

export default function Profile() {
    const { user, loading: authLoading } = useAuth();
    const [organizerDetails, setOrganizerDetails] = useState<OrganizerProfile | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isOrganizer = user?.roles?.includes('ORGANIZER') || false;

    useEffect(() => {
        if (!authLoading && user && isOrganizer) {
            const loadOrganizerData = async () => {
                setLoadingDetails(true);
                setError(null);
                try {
                    const res = await getOrganizerDetails();
                    setOrganizerDetails(res.data);
                    console.log("Organizer Details Loaded:", res.data);
                } catch (err: any) {
                    console.error("Failed to fetch organizer details:", err);
                    setError(err.response?.data?.message || "Could not load organizer data.");
                } finally {
                    setLoadingDetails(false);
                }
            };
            loadOrganizerData();
        } else if (!authLoading) {
            setLoadingDetails(false);
        }
    }, [user, authLoading, isOrganizer]);

    if (authLoading || loadingDetails) {
        return <div className="mt-[150px] container mx-auto p-4 text-center text-lg text-blue-500">Loading Profile...</div>;
    }
    
    if (!isOrganizer || error) {
        return (
            <div className="mt-[150px] container mx-auto p-8 bg-white shadow-lg rounded-xl">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Profile Access Denied</h2>
                {isOrganizer && error ? (
                    <p className="text-gray-700">{error}</p>
                ) : (
                    <p className="text-gray-700">You must register as an organizer to view this profile dashboard.</p>
                )}
            </div>
        );
    }
    
    return (
        <div className="mt-[150px] pt-[20px] container mx-auto sm:ms-5 md:ms-10 lg:ms-20 p-4 sm:p-6 lg:p-8">
            <div className=" bg-white rounded-xl shadow-lg">
            
                <div className="relative">
                    
                    <img 
                        src={organizerDetails?.committeeBannerImageURL || 'banner_placeholder.jpg'} 
                        alt="Banner" 
                        className="w-full rounded-t-xl object-cover 
                                h-48 sm:h-56 lg:h-64"
                    />
                    
                    <img 
                        src={organizerDetails?.committeeLogoImageURL || 'logo_placeholder.jpg'} 
                        alt="Logo" 
                        className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 
                                object-cover rounded-full border-4 border-white 
                                
                                absolute bottom-0 left-4 
                                sm:left-6 lg:left-8 
                                
                                transform translate-y-1/2" 
                    />
                </div>
                
                <div className="p-4 sm:p-6 lg:p-8">
                    
                    <div className="flex flex-col sm:flex-row items-start pt-2 mt-10 sm:mt-12 lg:mt-16">
                        
                        <div className="hidden sm:block w-36 lg:w-44 h-auto mr-4"></div> 
                        
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                                {organizerDetails?.committeeName || 'Committee Name'}
                            </h1>
                            <p className="text-gray-600">
                                Contact: {organizerDetails?.contact_no}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}