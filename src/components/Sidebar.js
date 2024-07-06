import React, { useState } from "react";
import "./Sidebar.css";

function Sidebar({ setActiveModule }) {
  const [active, setActive] = useState("");

  const navOptions = [
    {
      id: "schools",
      label: "Schools",
      icon: (
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/ios-filled/100/FFFFFF/school-locker.png"
          alt="school-locker"
        />
      ),
    },
    {
      id: "departments",
      label: "Departments",
      icon: (
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/ios-filled/50/FFFFFF/department.png"
          alt="department"
        />
      ),
    },
    {
      id: "programs",
      label: "Programs",
      icon: (
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/pastel-glyph/64/FFFFFF/web-apps--v1.png"
          alt="web-apps--v1"
        />
      ),
    },
    {
      id: "program-structure",
      label: "Program Structure",
      icon: (
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/external-yogi-aprelliyanto-glyph-yogi-aprelliyanto/64/FFFFFF/external-structure-coding-and-programming-yogi-aprelliyanto-glyph-yogi-aprelliyanto.png"
          alt="external-structure-coding-and-programming-yogi-aprelliyanto-glyph-yogi-aprelliyanto"
        />
      ),
    },
    {
      id: "employee",
      label: "Employees",
      icon: (
        <img
          width="25"
          height="25"
          src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/96/FFFFFF/external-Teacher-education-tanah-basah-glyph-tanah-basah.png"
          alt="employee"
        />
      ),
    },
    {
      id: "students",
      label: "Students",
      icon: (
        <img width="25" height="25" src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/FFFFFF/external-graduate-job-and-professions-avatars-tanah-basah-glyph-tanah-basah.png" alt="external-graduate-job-and-professions-avatars-tanah-basah-glyph-tanah-basah"/>   ),
    },
    {
      id: "rooms",
      label: "Rooms",
      icon: (
<img width="25" height="25" src="https://img.icons8.com/external-vitaliy-gorbachev-fill-vitaly-gorbachev/60/FFFFFF/external-door-back-to-school-vitaliy-gorbachev-fill-vitaly-gorbachev.png" alt="external-door-back-to-school-vitaliy-gorbachev-fill-vitaly-gorbachev"/>
      ),
    },
    {
      id: "slotassignment",
      label: "Slot Assignment",
      icon: (
<img width="25" height="25" src="https://img.icons8.com/pastel-glyph/64/FFFFFF/restaurant-menu.png" alt="restaurant-menu"/>
      ),
    },
    {
      id: "facultyassignment",
      label: "Faculty Assignment",
      icon: (
        <svg
          viewBox="0 0 442 442"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30,140h382c0.008,0.001,0.014,0,0.02,0c5.523,0,10-4.478,10-10c0-3.746-2.059-7.011-5.107-8.724L226.32,1.532 c-3.254-2.043-7.387-2.043-10.641,0l-191,120c-3.773,2.371-5.522,6.953-4.289,11.236C21.624,137.051,25.543,140,30,140z M221,21.81 L377.286,120H64.714L221,21.81z"
            fill="#ffffff"
          />
          <path
            d="M432,372h-10v-30c0-5.522-4.478-10-10-10h-10V180h10c5.522,0,10-4.478,10-10s-4.478-10-10-10H30c-5.522,0-10,4.478-10,10 s4.478,10,10,10h10v152H30c-5.522,0-10,4.478-10,10v30H10c-5.522,0-10,4.478-10,10v50c0,5.522,4.478,10,10,10h422 c5.522,0,10-4.478,10-10v-50C442,376.478,437.522,372,432,372z M382,332h-20V180h20V332z M302.667,332V180H342v152H302.667z M262.667,332V180h20v152H262.667z M199.333,332V180h43.334v152H199.333z M159.333,332V180h20v152H159.333z M100,332V180h39.333 v152H100z M60,180h20v152H60V180z M422,422H20v-30h80.611c5.522,0,10-4.478,10-10s-4.478-10-10-10H40v-20h362v20H134.723 c-5.522,0-10,4.478-10,10s4.478,10,10,10H422V422z"
            fill="#ffffff"
          />
        </svg>
      ),
    },
    {
      id: "batchallotment",
      label: "Batch Allotment",
      icon: (
        <svg
          viewBox="0 0 442 442"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30,140h382c0.008,0.001,0.014,0,0.02,0c5.523,0,10-4.478,10-10c0-3.746-2.059-7.011-5.107-8.724L226.32,1.532 c-3.254-2.043-7.387-2.043-10.641,0l-191,120c-3.773,2.371-5.522,6.953-4.289,11.236C21.624,137.051,25.543,140,30,140z M221,21.81 L377.286,120H64.714L221,21.81z"
            fill="#ffffff"
          />
          <path
            d="M432,372h-10v-30c0-5.522-4.478-10-10-10h-10V180h10c5.522,0,10-4.478,10-10s-4.478-10-10-10H30c-5.522,0-10,4.478-10,10 s4.478,10,10,10h10v152H30c-5.522,0-10,4.478-10,10v30H10c-5.522,0-10,4.478-10,10v50c0,5.522,4.478,10,10,10h422 c5.522,0,10-4.478,10-10v-50C442,376.478,437.522,372,432,372z M382,332h-20V180h20V332z M302.667,332V180H342v152H302.667z M262.667,332V180h20v152H262.667z M199.333,332V180h43.334v152H199.333z M159.333,332V180h20v152H159.333z M100,332V180h39.333 v152H100z M60,180h20v152H60V180z M422,422H20v-30h80.611c5.522,0,10-4.478,10-10s-4.478-10-10-10H40v-20h362v20H134.723 c-5.522,0-10,4.478-10,10s4.478,10,10,10H422V422z"
            fill="#ffffff"
          />
        </svg>
      ),
    },
    {
      id: "timetable",
      label: "Timetable",
      icon: (
        <svg
          viewBox="0 0 930.337 930.337"
          fill="#ffffff"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60,757.867h398.998c-9.753-27.547-14.707-56.405-14.707-86.012c0-34.819,6.826-68.613,20.289-100.442 c12.997-30.729,31.597-58.32,55.284-82.006c23.687-23.688,51.277-42.287,82.006-55.284 c31.83-13.463,65.624-20.289,100.442-20.289c34.819,0,68.613,6.826,100.442,20.289c3.116,1.317,6.192,2.709,9.242,4.142V338.2 V170.916c0-33.137-26.863-60-60-60h-62.354V70.458c0-22.091-17.908-40-40-40H595.3c-22.091,0-40,17.909-40,40v40.457h-82.127 V70.458c0-22.091-17.909-40-40-40h-54.345c-22.091,0-40,17.909-40,40v40.457h-82.127V70.458c0-22.091-17.909-40-40-40h-54.345 c-22.092,0-40,17.909-40,40v40.457H60c-33.137,0-60,26.863-60,60v167.285v359.667C0,731.003,26.863,757.867,60,757.867z M45,170.916c0-8.271,6.729-15,15-15h62.355v24.357c0,22.091,17.908,40,40,40H216.7c22.091,0,40-17.909,40-40v-24.357h82.127 v24.357c0,22.091,17.909,40,40,40h54.345c22.091,0,40-17.909,40-40v-24.357h82.127v24.357c0,22.091,17.909,40,40,40h54.346 c22.092,0,40-17.909,40-40v-24.357h62.354c8.271,0,15,6.729,15,15v122.285h-722L45,170.916L45,170.916z"
            fill="#ffffff"
          />
          <path
            d="M930.337,671.855c0-86.173-47.806-161.171-118.337-199.944c-32.545-17.893-69.924-28.078-109.686-28.078 c-125.935,0-228.023,102.089-228.023,228.022c0,30.435,5.978,59.467,16.797,86.012 c33.953,83.295,115.728,142.012,211.228,142.012C828.248,899.878,930.337,797.789,930.337,671.855z M812,691.855h-82.577 c-6.112,8.34-15.976,13.758-27.107,13.758c-18.556,0-33.598-15.041-33.598-33.597c0-11.061,5.349-20.87,13.598-26.992V510.753 c0-11.046,8.953-20,20-20c11.046,0,20,8.954,20,20v134.271c2.604,1.935,4.923,4.235,6.872,6.829H812h51.415 c11.046,0,20,8.954,20,20c0,11.047-8.954,20-20,20L812,691.855L812,691.855z"
            fill="#ffffff"
          />
        </svg>
      ),
    },
  ];

  const handleNavClick = (id) => {
    setActive(id);
    setActiveModule(id);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img
          src="https://cdn.freebiesupply.com/images/large/2x/google-logo-transparent.png"
          alt="Company Logo"
        />
      </div>
      <ul className="nav-list">
        {navOptions.map((option) => (
          <li
            key={option.id}
            className={option.id === active ? "nav-item active" : "nav-item"}
            onClick={() => handleNavClick(option.id)}
          >
            <span className="nav-icon">{option.icon}</span>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
