import React, { useState, useEffect } from "react";
import "./Header.css"; // Ensure the CSS path is correct

const Header = ({ onSelectTerm }) => {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    // Fetch academic years from the backend
    const fetchYearOptions = async () => {
      try {
        const response = await fetch("http://localhost:3001/academicyears");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched year options:", data);
        setYearOptions(data.map((item) => item.yearname));
      } catch (error) {
        console.error("Error fetching academic years:", error);
      }
    };

    fetchYearOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".dropdown") === null) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleTermSelect = (option) => {
    setSelectedTerm(option);
    setIsOpen(false);
    onSelectTerm(option);
  };

  return (
    <div className="headerContainer">
      <div className="logoSection">
        <img src="logo_placeholder.png" alt="Company Logo" className="logo" />
      </div>
      <div className="dropdownSection">
        <span className="selectTermText">Select Term:</span>
        <div className="dropdown" onClick={() => setIsOpen(!isOpen)}>
          <div className="selectedTerm">
            {selectedTerm || "Select Term"}
            <img
              src="https://img.icons8.com/sf-black/64/1A1A1A/expand-arrow.png"
              alt="expand-arrow"
              style={{ width: "23px", marginLeft: "10px" }} // Adjusted for better control
            />
          </div>
          {isOpen && (
            <div className="dropdownContent">
              {yearOptions.length > 0 ? (
                yearOptions.map((option) => (
                  <div
                    key={option}
                    className="dropdownItem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTermSelect(option);
                    }}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className="dropdownItem">No options available</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
