import api from "./api";

export const createEvent = async (
    eventName: string,
    eventDescription: string,
    category: string,
    eventDate: string,
    eventStartingTime: string,
    eventCity: string,
    eventLocation: string,
    eventImageFile: File
) => {
    try {
        const formData = new FormData();
        formData.append("eventName", eventName);
        formData.append("eventDescription", eventDescription);
        formData.append("category", category);
        formData.append("eventDate", eventDate);
        formData.append("eventStartingTime", eventStartingTime);
        formData.append("eventCity", eventCity);
        formData.append("eventLocation", eventLocation);
        formData.append("eventImage", eventImageFile);

        const response = await api.post("/event/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export interface EventData {
    _id: string;
    eventName: string;
    eventDescription: string;
    category: string;
    eventDate: string; 
    eventStartingTime: string; 
    eventCity: string;
    eventLocation: string;
    eventImageURL: string;
    EventStatus: string; 
}

export const fetchAllEvents = async (): Promise<EventData[]> => {
    try {
        const response = await api.get("/event/getAll");
        return response.data.events;
    } catch (error) {
        console.error("Error fetching events in service:", error);
        throw error;
    }
};

export const fetchOrganizerEvents = async (): Promise<EventData[]> => {
    try {
        const response = await api.get("/event/my-events"); // New route
        return response.data.events;
    } catch (error) {
        console.error("Error fetching organizer events in service:", error);
        throw error;
    }
};