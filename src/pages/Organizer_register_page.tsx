import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
import { OrganizerRegister } from "../service/organizer";
import Input from "../components/Input";
import Select from "../components/Select";
import { showAlert } from "../components/Swail";

export default function OrganizerRegisterPage() {
    const [committeeName, setCommitteeName] = useState("")
    const [contact_no, setContactNo] = useState("")
    const [eventPlace, setEventPlace] = useState("");

    const [committeeLogoImageURL, setCommitteeLogoImageURL] = useState<File | null>(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
    
    const [committeeBannerImageURL, setCommitteeBannerImageURL] = useState<File | null>(null);
    const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<File | null>>, setPreviewState: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            setFileState(file);
            
            const url = URL.createObjectURL(file);
            setPreviewState(url);
        } else {
            setFileState(null);
            setPreviewState(null);
        }
    };

    const resetForm = () => {
        setCommitteeName("");
        setContactNo("");
        setEventPlace("");
        setCommitteeLogoImageURL(null);
        setLogoPreviewUrl(null);
        setCommitteeBannerImageURL(null);
        setBannerPreviewUrl(null);
    };

    const handleOrganizerRegister = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!committeeName.trim() || !contact_no.trim() || !eventPlace.trim() || !committeeLogoImageURL || !committeeBannerImageURL) {
            showAlert({
                icon: "warning",
                title: "All fields are required",
                text: "Please fill in all the fields before submitting the form.",
            });
            return;
        }

        try {
            const registerData = await OrganizerRegister(
                committeeName,
                contact_no,
                eventPlace
            );
            
            console.log("Organizer Register Data:", registerData);
            resetForm();
            showAlert({
                icon: "success",
                title: "Success!",
                text: "Organizer registered successfully",
            });

        } catch (error: any) {

            // 🌟 Axios error response capture
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Something went wrong. Please try again.";

            showAlert({
                icon: "error",
                title: "Registration Failed",
                text: errorMessage,
            });

            console.error("Organizer Register Error:", error);
        }
    };

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
        <div className="relative w-screen h-screen overflow-hidden">
            <img
                src="src/assets/image/american-football-players-wearing-equipment.jpg"
                alt=""
                className="fixed inset-0 w-full h-full object-cover"/>

            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-1 flex flex-col mt-[100px] items-center h-[900px] overflow-auto px-4 py-8">
                
                <form className="bg-white/20 mt-[50px] backdrop-blur-md p-8 rounded-xl lg:w-[800px] border border-white/40 shadow-xl max-h-[80vh] overflow-auto">
                    
                    <h2 className="text-2xl text-white font-bold mb-6 text-center">Organizer Registration</h2>

                    <Input
                        type="text"
                        label="Committee Name"
                        placeholder="Enter committee name"
                        value={committeeName}
                        maxLength={50}
                        onChange={setCommitteeName}
                    />

                    <Input
                        type="text"
                        label="Contact Number"
                        placeholder="07XX-XXXXXX"
                        value={contact_no}
                        maxLength={10}
                        onChange={setContactNo}
                    />

                    <Select
                        label="Event Place"
                        value={eventPlace}
                        onChange={setEventPlace}
                        options={districts}
                    />

                    <Input
                        label="Committee logo"
                        type="file"
                        onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setCommitteeLogoImageURL, setLogoPreviewUrl)}
                        accept="image/*"
                    />
                    {logoPreviewUrl && (
                        <div className="mt-[-15px] mb-4">
                            <h4 className="text-white text-sm mb-1">Logo Preview:</h4>
                            <img src={logoPreviewUrl} alt="Logo Preview" className="w-24 h-24 object-cover rounded-md border-2 border-blue-400" />
                        </div>
                    )}
                    
                    <Input
                        label="Committee Banner"
                        type="file"
                        onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setCommitteeBannerImageURL, setBannerPreviewUrl)}
                        accept="image/*"
                    />
                    {bannerPreviewUrl && (
                        <div className="mt-[-15px] mb-4">
                            <h4 className="text-white text-sm mb-1">Banner Preview:</h4>
                            <img src={bannerPreviewUrl} alt="Banner Preview" className="w-full h-32 object-cover rounded-md border-2 border-blue-400" />
                        </div>
                    )}

                    <div>
                        <button onClick={resetForm} type="reset" className="w-full border-2 border-gray-500 text-[20px] hover:bg-gray-500 text-gray-500 hover:text-white font-semibold py-3 px-4 rounded mt-4 mr-2 transition-colors duration-300">
                            Resert Form
                        </button>
                        <button
                            onClick={handleOrganizerRegister} className="w-full border-2 border-blue-500 text-[20px] hover:bg-blue-500 text-blue-500 hover:text-white font-semibold py-3 px-4 rounded mt-4 transition-colors duration-300">
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}