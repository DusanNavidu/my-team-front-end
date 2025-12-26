import api from "./api";

export const getPlayerProfile = async () => {
  return await api.get("/player/player-profile");
};

export const updatePlayerDetails = async (formData: FormData) => {
  return await api.put("/player/player-profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};