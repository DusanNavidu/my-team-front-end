import api from "./api";

export const applyForEventService = async (eventId: string) => {
    const res = await api.post(`/applications/apply/${eventId}`);
    return res.data;
};

export const checkAppliedStatusService = async (eventId: string) => {
    const res = await api.get(`/applications/check-applied/${eventId}`);
    return res.data;
};

export const getMyApplications = async () => {
    const res = await api.get("/applications/organizer");
    return res.data;
};

export const updateAppStatus = async (id: string, status: string) => {
    const res = await api.patch(`/applications/update-status/${id}`, { status });
    return res.data;
};