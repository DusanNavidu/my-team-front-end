import React from "react";

interface InputProps {
    label?: string;
    type?: string;
    value?: string;
    placeholder?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
    accept?: string;
    min?: string;
    maxLength?: number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // NEW → file input handler
    onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
    label,
    type = "text",
    value,
    placeholder,
    name,
    required = false,
    disabled = false,
    error,
    className = "",
    accept,
    min,
    onChange,
    onFileChange,
}) => {
    return (
        <div className="w-full mb-4">
            {label && (
                <label className="block text-gray-800 font-medium mb-1">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}

            <input
                type={type}
                name={name}
                value={type === "file" ? undefined : value}  
                placeholder={placeholder}
                disabled={disabled}
                accept={accept}
                min={min}
                onChange={(e) => {
                    if (type === "file" && onFileChange) {
                        onFileChange(e); // handle files
                    } else if (onChange) {
                        onChange(e); // normal text input
                    }
                }}
                className={`w-full px-4 py-2 rounded-lg border 
                    border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300
                    outline-none transition-all duration-200
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${error ? "border-red-500" : ""}
                    ${className}
                `}
            />

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Input;
