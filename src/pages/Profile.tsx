import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/authContext";
import { getOrganizerDetails, updateOrganizerDetails } from "../service/organizer";
import ProfilePost from "../components/post/ProfilePost";
import { fetchOrganizerEvents } from "../service/event";
import type { EventData } from "../service/event"; 
import Button from "../components/Button";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/InputForModal";
import Select from "../components/Modal/SelectForModal";

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
    const [organizerEvents, setOrganizerEvents] = useState<EventData[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventError, setEventError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const isOrganizer = user?.roles?.includes('ORGANIZER') || false;

    const [committeeName, setCommitteeName] = useState("");
    const [contact_no, setContactNo] = useState("");
    const [eventPlace, setEventPlace] = useState("");
    const [committeeLogoImageFile, setCommitteeLogoImageFile] = useState<File | null>(null);
    const [committeeBannerImageFile, setCommitteeBannerImageFile] = useState<File | null>(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
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
    }

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
            alert(`Update Failed: ${err.response?.data?.message || 'Check console for details.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && isOrganizer) {
            const loadOrganizerData = async () => {
                setLoadingDetails(true);
                setError(null);
                try {
                    const res = await getOrganizerDetails();
                    const details: OrganizerProfile = res.data.data || res.data; 
                    setOrganizerDetails(details);
                    
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

    useEffect(() => {
        if (!authLoading && user && isOrganizer) {
            const loadEventsData = async () => {
                setLoadingEvents(true);
                setEventError(null);
                try {
                    const events = await fetchOrganizerEvents();
                    setOrganizerEvents(events);
                } catch (err: any) {
                    console.error("Failed to fetch organizer events:", err);
                    setEventError("Failed to load your events.");
                } finally {
                    setLoadingEvents(false);
                }
            };
            loadEventsData();
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
    
    const districts = [
        { label: "Cover any Place in Sri Lanka", value: "cover_all"},
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
        { label: "Vavuniya", value: "Vavuniya" }
    ];

    return (
        <div className="mt-[150px] pt-[20px] container mx-auto">
            
            <div className=" bg-white rounded-xl shadow-lg">
                <div className="relative">
                    <img
                        src={organizerDetails?.committeeBannerImageURL || 'banner_placeholder.jpg'}
                        alt="Banner"
                        className="w-full rounded-t-xl object-cover h-48 sm:h-56 lg:h-64"
                    />
                    <img
                        src={organizerDetails?.committeeLogoImageURL || 'logo_placeholder.jpg'}
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
                                    {organizerDetails?.committeeName || 'Committee Name'}
                                </h1>
                                <Button color="black" className="rounded-full px-3 py-2 flex items-center gap-2" onClick={handleOpenModal}>
                                    <img src="./src/assets/image/compose (1).png" className="w-4 h-4" alt="Edit" />
                                </Button>
                            </div>
                            <p className="text-gray-600">
                                Contact: {organizerDetails?.contact_no}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your Events</h2>
                
                {loadingEvents ? (
                    <div className="text-center text-gray-500">Loading events...</div>
                ) : eventError ? (
                    <div className="text-center text-red-500">{eventError}</div>
                ) : organizerEvents.length === 0 ? (
                    <div className="text-center text-gray-500 p-8">You have not created any events yet.</div>
                ) : (
                    <div className="mx-auto mt-12 px-4 w-full max-w-[680px]">
                        {organizerEvents.map((event) => (
                            <ProfilePost key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Organizer Profile</h2>

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
                            label={`Committee Logo (Current: ${organizerDetails?.committeeLogoImageURL ? 'Yes' : 'No'})`}
                            type="file"
                            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFileChange(e, setCommitteeLogoImageFile, setLogoPreviewUrl)
                            }
                            accept="image/*"
                        />
                        {(logoPreviewUrl || organizerDetails?.committeeLogoImageURL) && (
                            <div className="mt-2 mb-4">
                                <h4 className="text-sm text-gray-600 mb-1">Logo Preview:</h4>
                                <img
                                    src={logoPreviewUrl || organizerDetails?.committeeLogoImageURL || ''}
                                    alt="Logo Preview"
                                    className="w-24 h-24 object-cover rounded-md border-2 border-blue-400"
                                />
                            </div>
                        )}
                    </div>
        
                    <div className="mt-4">
                        <Input
                            label={`Committee Banner (Current: ${organizerDetails?.committeeBannerImageURL ? 'Yes' : 'No'})`}
                            type="file"
                            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleFileChange(e, setCommitteeBannerImageFile, setBannerPreviewUrl)
                            }
                            accept="image/*"
                        />
                        {(bannerPreviewUrl || organizerDetails?.committeeBannerImageURL) && (
                            <div className="mt-2 mb-4">
                                <h4 className="text-sm text-gray-600 mb-1">Banner Preview:</h4>
                                <img
                                    src={bannerPreviewUrl || organizerDetails?.committeeBannerImageURL || ''}
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
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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