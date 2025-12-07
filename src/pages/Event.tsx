import { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal/Modal";
import Input from "../components/Modal/InputForModal";
import Select from "../components/Modal/SelectForModal";

export default function Event() {

    const [openModal, setOpenModal] = useState(false);

    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [category, setCategory] = useState("");

    const handleEventCreate = () => {
        setOpenModal(true);
    };

    return (
      <div className="w-full mt-[150px] container mx-auto">
            <div className="flex justify-end">
                <Button color="blue" className="mt-5" onClick={handleEventCreate}>
                    Create Event +
                </Button>
            </div>

        <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
            <h2 className="text-2xl font-bold mb-4">Create New Event</h2>

            <div className="flex flex-col">
                <Input
                    label="Event Name"
                    required
                    placeholder="Enter event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />

                <label
                    htmlFor="eventDescription"
                    className="block text-gray-800 font-medium mb-1">
                    Event Descriptions <span className="text-red-600">*</span>
                </label>
                <textarea
                    id="eventDescription"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200"
                    placeholder="Enter event description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                ></textarea>

                <Select
                    label="Event Category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={[
                        { label: "Cricket", value: "cricket" },
                        { label: "football", value: "football" },
                        { label: "Rugby", value: "rugby" },
                        { label: "Volleyball", value: "volleyball" },
                        { label: "Badminton", value: "badminton" },
                        { label: "Tennis", value: "tennis" },
                        { label: "Hockey", value: "hockey" },
                        { label: "Swimming", value: "swimming" },
                    ]}
                />

                <Button className="px-4 py-2" color="green" onClick={() => setOpenModal(false)}>
                    Save Event
                </Button>
            </div>
        </Modal>
      </div>
    );
}
