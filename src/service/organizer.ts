// src/service/organizer.ts (FINAL FIX - CRITICAL)

import api from "./api";

// 💡 Role Update Service: Endpoint එක /auth/roleupdate ලෙස සකසා ඇත.
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
        // --- 🎯 STEP 1: Update Role to ORGANIZER (Set only ORGANIZER role) ---
        console.log("STEP 1: Attempting to update user role to ORGANIZER...");
        
        const roleResponse = await updateRole("ORGANIZER"); 
        
        console.log("STEP 1 Success: Role updated. New Token:", roleResponse.data.accessToken);
        
        // --- FIX: AXIOS HEADER UPDATE (CRITICAL) ---
        const newAccessToken = roleResponse.data.accessToken; 
        
        // Axios instance එකේ Headers වල Authorization token එක යාවත්කාලීන කරයි.
        // මෙය TypeScript environment එකකදී ආරක්ෂිතව සිදු කිරීම.
        (api.defaults.headers as any).common['Authorization'] = `Bearer ${newAccessToken}`; 
        
        console.log("Axios Header Updated with new ORGANIZER Token."); 
        // ---------------------------------
        
        roleUpdateSuccess = true;
        
        // --- 🎯 STEP 2: Create Organizer Profile (This request now uses the ORGANIZER Token) ---
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
        
        // --- 🚨 CRITICAL FAILURE HANDLER (Revert) ---
        if (roleUpdateSuccess) {
            console.error("Critical: Organizer Profile creation failed. Reverting role to USER...");
            
            try {
                const revertResponse = await updateRole("USER"); 
                console.log("Role Reversion Success: Role reverted to USER.");
                
                // 💡 Reversion සාර්ථක නම්, Token එක නැවතත් නව USER Token එකෙන් update කරන්න.
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