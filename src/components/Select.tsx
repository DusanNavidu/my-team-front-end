import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  className?: string;
}

export default function Select({
  label = "",
  value,
  onChange,
  options,
  className = "",
}: SelectProps) {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label className="text-white font-semibold mb-2">{label}</label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`appearance-none w-full p-3 bg-white/20 text-white 
          border border-white/40 rounded focus:outline-none 
          focus:border-blue-400 focus:ring-2 focus:ring-blue-300 
          backdrop-blur-md transition-all duration-300 
          hover:bg-white/30 ${className}`}
        >
          <option value="" disabled>
            -- Select an option --
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black bg-white/90" // Make option text visible
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
