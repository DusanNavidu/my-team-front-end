import React from "react";

type InputProps = {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (val: string) => void;
    onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string;
    type?: string; 
    maxLength?: number;
    className?: string;
};

export default function Input({
    label = "",
    placeholder = "",
    value,
    onChange,
    onFileChange,
    type = "text",
    maxLength = Number.MAX_SAFE_INTEGER,
    accept, 
    className = ""
}: InputProps) {

    if (type === "file") {
        return (
            <div className="flex flex-col w-full mb-4">
                {label && (
                    <label className="text-white font-semibold mb-1">
                        {label}
                    </label>
                )}
                
                <input
                    type="file"
                    placeholder={placeholder}
                    onChange={onFileChange} 
                    maxLength={maxLength}
                    accept={accept}
                    className={
                        `p-3 bg-white/20 text-white placeholder-gray-300 
                        border border-white/40 rounded focus:outline-none 
                        focus:border-blue-300 backdrop-blur-sm ` + className
                    }
                />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col w-full mb-4">
            {label && (
                <label className="text-white font-semibold mb-1">
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)} 
                maxLength={maxLength}
                className={
                    `p-3 bg-white/20 text-white placeholder-gray-300 
                    border border-white/40 rounded focus:outline-none 
                    focus:border-blue-300 backdrop-blur-sm ` + className
                }
            />
        </div>
    );
}