// src/pages/Organizer_register_page.tsx (FINAL FIX)

import { useEffect, useState } from "react";
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

    const [isLoading, setIsLoading] = useState(false); // Loading state
    
    console.log("Selected Logo File (State):", committeeLogoImageURL);
    console.log("Selected Banner File (State):", committeeBannerImageURL);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<File | null>>, setPreviewState: React.Dispatch<React.SetStateAction<string | null>>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            setFileState(file);
            const url = URL.createObjectURL(file);
            setPreviewState(url);
            console.log(`File selected: ${file.name}, Size: ${file.size} bytes`);
        } else {
            setFileState(null);
            setPreviewState(null);
            console.log("File deselected.");
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

        if (isLoading) return;

        if (!committeeName.trim() || !contact_no.trim() || !eventPlace.trim() || !committeeLogoImageURL || !committeeBannerImageURL) {
            showAlert({ icon: "warning", title: "All fields are required", text: "Please fill in all the fields before submitting the form." });
            return;
        }

        setIsLoading(true);

        try {
            console.log("Attempting OrganizerRegister with files...");
            
            const registerData = await OrganizerRegister(
                committeeName,
                contact_no,
                eventPlace,
                committeeLogoImageURL,
                committeeBannerImageURL
            );
            
            console.log("Organizer Register Success Data:", registerData);
            resetForm();
            showAlert({ icon: "success", title: "Success!", text: "Organizer registered successfully" });

        } catch (error: any) {

            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Something went wrong. Please try again.";

            showAlert({ icon: "error", title: "Registration Failed", text: errorMessage });

            console.error("Organizer Register Error:", error);
        } finally {
            setIsLoading(false);
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
          className="fixed inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-1 flex flex-col mt-[100px] items-center h-[900px] overflow-auto px-4 py-8">
          <form className="bg-white/20 mt-[50px] backdrop-blur-md p-8 rounded-xl lg:w-[800px] border border-white/40 shadow-xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl text-white font-bold mb-6 text-center">
              Organizer Registration
            </h2>

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
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(e, setCommitteeLogoImageURL, setLogoPreviewUrl)
              }
              accept="image/*"
            />
            {logoPreviewUrl && (
              <div className="mt-[-15px] mb-4">
                <h4 className="text-white text-sm mb-1">Logo Preview:</h4>
                <img
                  src={logoPreviewUrl}
                  alt="Logo Preview"
                  className="w-24 h-24 object-cover rounded-md border-2 border-blue-400"
                />
              </div>
            )}

            <Input
              label="Committee Banner"
              type="file"
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(
                  e,
                  setCommitteeBannerImageURL,
                  setBannerPreviewUrl
                )
              }
              accept="image/*"
            />
            {bannerPreviewUrl && (
              <div className="mt-[-15px] mb-4">
                <h4 className="text-white text-sm mb-1">Banner Preview:</h4>
                <img
                  src={bannerPreviewUrl}
                  alt="Banner Preview"
                  className="w-full h-32 object-cover rounded-md border-2 border-blue-400"
                />
              </div>
            )}

            <div>
              <button
                onClick={resetForm}
                type="reset"
                disabled={isLoading}
                className="w-full border-2 border-gray-500 text-[20px] hover:bg-gray-500 text-gray-500 hover:text-white font-semibold py-3 px-4 rounded mt-4 mr-2 transition-colors duration-300"
              >
                Resert Form
              </button>
              <button
                onClick={handleOrganizerRegister}
                disabled={isLoading}
                className={`w-full border-2 text-[20px] font-semibold py-3 px-4 rounded mt-4 transition-colors duration-300 ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-white"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}