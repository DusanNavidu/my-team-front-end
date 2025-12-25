import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl shadow-xl relative overflow-auto max-h-[90vh]">
                
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
                >
                    ×
                </button>

                {children}
            </div>
        </div>
    );
};

export default Modal;