import React from "react";

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    label?: string;
    value?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    className?: string;
    options: Option[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({
    label,
    value,
    name,
    required = false,
    disabled = false,
    placeholder = "Select an option",
    error,
    className = "",
    options,
    onChange,
}) => {
    return (
        <div className="w-full mt-4 mb-4">
            {/* Label */}
            {label && (
                <label className="block text-gray-800 font-medium mb-1">
                    {label} {required && <span className="text-red-600">*</span>}
                </label>
            )}

            {/* Select */}
            <select
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
                className={`
                    w-full px-4 py-2 rounded-lg border 
                    border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300
                    outline-none transition-all duration-200 bg-white
                    ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
                    ${error ? "border-red-500" : ""}
                    ${className}
                `}
            >
                {/* Placeholder */}
                <option value="" disabled hidden>
                    {placeholder}
                </option>

                {/* Options */}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default Select;