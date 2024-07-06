import React from 'react';
import * as MdIcons from 'react-icons/md';
import './Home.css';

const features = [
  { name: "Schools", icon: "MdGroup" },
  { name: "Departments", icon: "MdSchool" },
  { name: "Courses", icon: "MdAttachMoney" },
  { name: "Faculty", icon: "MdEmojiEvents" },
  { name: "Academic Year", icon: "MdBook" },
  { name: "Programs", icon: "MdDashboard" },
  { name: "Program Structure", icon: "MdSchedule" },
  { name: "Students", icon: "MdCheckCircle" },
  { name: "Course Student Mapping", icon: "MdEdit" },
  { name: "Time Slots", icon: "MdBusinessCenter" },
  { name: "Academic Calendar", icon: "MdLibraryBooks" },
  { name: "Rooms", icon: "MdInventory" },
  { name: "Timetable Preparation", icon: "MdHotel" },
  { name: "Admissions Management", icon: "MdDirectionsBus" },
  { name: "Student Enrollment", icon: "MdGroup" },
  { name: "Assessment", icon: "MdEvent" },
  { name: "Examination Management", icon: "MdBarChart" },
  { name: "Student Performance Monitoring", icon: "MdWork" },
  { name: "Attendance", icon: "MdLocalHospital" },
  { name: "Grading", icon: "MdSecurity" },
  { name: "Student Feedback", icon: "MdGavel" },
  { name: "Reports and Analytics", icon: "MdNotifications" },
  { name: "Manage Roles", icon: "MdDashboardCustomize" }
];

function Home() {
  const columns = [[], [], []]; // Create three columns
  features.forEach((item, index) => {
    columns[index % 3].push(item); // Distribute items into columns
  });

  return (
    <>
    <h1>Manage Services</h1>
    <div className="container">
      {columns.map((column, index) => (
        <ul key={index} className="feature-column">
          {column.map((item, idx) => {
            const IconComponent = MdIcons[item.icon];
            return (
              <li key={idx} className="feature-item">
                <IconComponent style={{ verticalAlign: 'middle' }} />&nbsp;{item.name}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
    </>
  );
}

export default Home;
