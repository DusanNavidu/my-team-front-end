import api from "./api";

export const updateRole = async (newRole: string) => {
    console.log(`[Service] Calling /auth/roleupdate to set role: ${newRole}`);
    const response = await api.post("/auth/roleupdate", { role: newRole });
    return response.data;
};

export const OrganizerRegister = async (
    committeeName: string,
    contact_no: string,
    eventPlace: string,
    committeeLogoImageFile: File,
    committeeBannerImageFile: File
) => {
    let roleUpdateSuccess = false; 

    try {
        console.log("STEP 1: Attempting to update user role to ORGANIZER...");
        
        const roleResponse = await updateRole("ORGANIZER"); 
        
        console.log("STEP 1 Success: Role updated. New Token:", roleResponse.data.accessToken);
        
        const newAccessToken = roleResponse.data.accessToken; 

        (api.defaults.headers as any).common['Authorization'] = `Bearer ${newAccessToken}`; 
        
        console.log("Axios Header Updated with new ORGANIZER Token."); 
        
        roleUpdateSuccess = true;
        
        const formData = new FormData();
        formData.append("committeeName", committeeName);
        formData.append("contact_no", contact_no);
        formData.append("eventPlace", eventPlace);

        formData.append("committeeLogoImage", committeeLogoImageFile);
        formData.append("committeeBannerImage", committeeBannerImageFile);
        console.log("STEP 2: Submitting Organizer Profile with files (using new Token)...");

        const response = await api.post("/organizer/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        
        console.log("STEP 2 Success: Organizer Profile Created.");
        return response.data;

    } catch (error: any) {
        
        if (roleUpdateSuccess) {
            console.error("Critical: Organizer Profile creation failed. Reverting role to USER...");
            
            try {
                const revertResponse = await updateRole("USER"); 
                console.log("Role Reversion Success: Role reverted to USER.");
                
                const newUserAccessToken = revertResponse.data.accessToken;
                (api.defaults.headers as any).common['Authorization'] = `Bearer ${newUserAccessToken}`;
                console.log("Axios Header updated with new USER Token after reversion.");
            } catch (revertError) {
                console.error("Role Reversion Failed! User is stuck with ORGANIZER role.", revertError);
            }
        }
        throw error;
    }
};

export const getOrganizerDetails = async () => {
    const res = await api.get("/organizer/me");
    return res.data;
}