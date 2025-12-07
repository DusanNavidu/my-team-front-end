// src/components/Button.tsx

import React, { useState } from 'react';

// Button props definition
interface ButtonProps {
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'submit' | 'button' | 'reset';
    color?: 'blue' | 'green' | 'red'; // Button Color variants
    disabled?: boolean;
    className?: string; // Additional classes
}

// Color styles mapping
const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
};

// Ripple Animation Type Definition
interface Ripple {
    x: number;
    y: number;
    size: number;
    key: number;
}

// Global CSS Animation Definition (for the ripple effect)
const rippleStyles = `
    @keyframes ripple-effect {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        100% {
            opacity: 0;
            transform: scale(2);
        }
    }
`;

if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = rippleStyles;
    document.head.appendChild(style);
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    color = 'blue',
    disabled = false,
    className = '',
}) => {
    
    // State to hold active ripple effects
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();
        
        // 1. Calculate the click position relative to the button
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // 2. Determine the maximum size for the ripple (to cover the button)
        const size = Math.max(button.clientWidth, button.clientHeight);

        // 3. Create the new ripple object
        const newRipple: Ripple = {
            x,
            y,
            size,
            key: Date.now(), // Unique key for rendering
        };

        setRipples(prevRipples => [...prevRipples, newRipple]);

        // 4. Remove the ripple after the animation is complete (e.g., 600ms)
        setTimeout(() => {
            setRipples(prevRipples => prevRipples.filter(r => r.key !== newRipple.key));
        }, 600); // Must match the CSS transition duration

        // 5. Execute the original onClick handler
        if (onClick && !disabled) {
            onClick(event);
        }
    };

    // Combine default classes, color classes, and custom classes
    const combinedClassName = `
        relative overflow-hidden
        text-white font-semibold py-2 px-4 rounded
        focus:outline-none transition duration-200
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
    `;

    return (
        <button
            type={type}
            className={combinedClassName}
            onClick={handleClick}
            disabled={disabled}
        >
            {/* Ripple Elements */}
            {ripples.map(ripple => (
                <span
                    key={ripple.key}
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        top: ripple.y - ripple.size / 2,
                        left: ripple.x - ripple.size / 2,
                        width: ripple.size,
                        height: ripple.size,
                        animation: 'ripple-effect 0.6s linear',
                        background: 'rgba(255,255,255,0.5)',
                        borderRadius: '50%',
                    }}
                />
            ))}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;