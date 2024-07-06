import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";  // Ensure you link to the correct CSS file

const CustomDropdown = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {value || label}
                <span className="dropdown-icon">&#x25BC;</span>  {/* Downward arrow icon */}
            </div>
            {isOpen && (
                <div className="dropdown-list-container">
                    <ul className="dropdown-list">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="dropdown-item"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
