import api from "./api";

export const OrganizerRegister = async (
    committeeName: string,
    contact_no: string,
    eventPlace: string,
    committeeLogoImageURL?: File | null,
    committeeBannerImageURL?: File | null
) => {

    const formData = new FormData();
    formData.append("committeeName", committeeName);
    formData.append("contact_no", contact_no);
    formData.append("eventPlace", eventPlace);

    if (committeeLogoImageURL !== null && committeeLogoImageURL !== undefined) {
        formData.append("committeeLogoImageURL", committeeLogoImageURL);
    }

    if (committeeBannerImageURL !== null && committeeBannerImageURL !== undefined) {
        formData.append("committeeBannerImageURL", committeeBannerImageURL);
    }

    const response = await api.post("/organizer/create", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
