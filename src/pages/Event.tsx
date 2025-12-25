import { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/InputForModal";
import Select from "../components/Modal/SelectForModal";
import { showAlert } from "../components/Swail";
import { createEvent } from "../service/event";
import EventBox from "../components/post/Post";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function Event() {
  const [openModal, setOpenModal] = useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [category, setCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartingTime, setEventStartingTime] = useState("");
  const [eventCity, setEventCity] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventImageFile, setEventImageURL] = useState<File | null>(null);
  const [eventImagePreviewUrl, setEventImagePreviewUrl] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const todayDate = getTodayDate();

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      setFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
      console.log("File deselected.");
    }
  };

  const handleOpenModal = () => {
    handleEventModalResert();
    setOpenModal(true);
  };

  const handleEventCreate = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (
      !eventName ||
      !eventDescription ||
      !category ||
      !eventDate ||
      !eventStartingTime ||
      !eventCity ||
      !eventLocation ||
      !eventImageFile
    ) {
      showAlert({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all required fields.",
      });
      return;
    }

    const currentTime = getCurrentTime();

    if (eventDate === todayDate) {
      if (eventStartingTime <= currentTime) {
        showAlert({
          icon: "error",
          title: "Invalid Time",
          text: "Event starting time must be in the future.",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      console.log("Event Created: Attempting to send data...");

      const eventData = await createEvent(
        eventName,
        eventDescription,
        category,
        new Date(eventDate),
        eventStartingTime,
        eventCity,
        eventLocation,
        eventImageFile
      );
      console.log("Event Data:", eventData);
      showAlert({
        icon: "success",
        title: "Event Created",
        text: "The event has been created successfully.",
      });
      setOpenModal(false);
      window.location.reload();
      handleEventModalResert();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "There was an error creating the event. Please try again.";
      console.error("Error creating event:", error);
      showAlert({
        icon: "error",
        title: "Creation Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventModalResert = () => {
    setEventName("");
    setEventDescription("");
    setCategory("");
    setEventDate("");
    setEventStartingTime("");
    setEventCity("");
    setEventLocation("");
    setEventImageURL(null);
    setEventImagePreviewUrl(null);
  };

  const categoryOptions = [
    { label: "Cricket", value: "cricket" },
    { label: "football", value: "football" },
    { label: "Rugby", value: "rugby" },
    { label: "Volleyball", value: "volleyball" },
    { label: "Badminton", value: "badminton" },
    { label: "Tennis", value: "tennis" },
    { label: "Hockey", value: "hockey" },
    { label: "Table Tennis", value: "table_tennis" },
    { label: "Online Gaming", value: "online_gaming" },
    { label: "Swimming", value: "swimming" },
    { label: "Athletics", value: "athletics" },
    { label: "Cycling", value: "cycling" },
    { label: "Martial Arts", value: "martial_arts" },
    { label: "Other", value: "other" },
  ];

  const cityOptions = [
    { label: "Any City", value: "Any City" },
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
    { label: "Vavuniya", value: "Vavuniya" },
  ];

  return (
    <div className="w-full mt-[150px] container mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button color="blue" className="mt-5" onClick={handleOpenModal}>
          Create Event +
        </Button>
      </div>

      <div>
        <EventBox />
      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

        <form className="flex flex-col overflow-auto max-h-[70vh]">
          <Input
            label="Event Name"
            required
            placeholder="Enter event name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />

          <label
            htmlFor="eventDescription"
            className="block text-gray-800 font-medium mb-1"
          >
            Event Descriptions <span className="text-red-600">*</span>
          </label>

          <textarea
            id="eventDescription"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200 resize-none"
            placeholder="Enter event description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            style={{ minHeight: "150px" }}
          ></textarea>

          <Select
            label="Event Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />

          <Input
            label="Event Date"
            required
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            min={todayDate}
          />

          <Input
            label="Event Starting Time"
            required
            type="time"
            value={eventStartingTime}
            onChange={(e) => setEventStartingTime(e.target.value)}
          />

          <Select
            label="Event City"
            required
            value={eventCity}
            onChange={(e) => setEventCity(e.target.value)}
            options={cityOptions}
          />

          <Input
            label="Event Place/Location Name"
            required
            placeholder="Enter event location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />

          <Input
            label="Event Image"
            type="file"
            required
            onFileChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileChange(e, setEventImageURL, setEventImagePreviewUrl)
            }
            accept="image/*"
          />
          {eventImagePreviewUrl && (
            <img
              src={eventImagePreviewUrl}
              alt="Event Preview"
              className="w-48 h-48 object-cover rounded-md border-2 border-green-400 mb-4"
            />
          )}

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              type="button"
              className="px-4 py-2 mt-5"
              color="red"
              onClick={handleEventModalResert}
              disabled={isLoading}
            >
              Resert Form
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 mt-5"
              color="green"
              onClick={handleEventCreate}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
