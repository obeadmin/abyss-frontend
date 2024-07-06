import React, { useState } from "react";
import Sidebar from "./StudentSidebar";
import Header from "./Header";
import "../App.css";
import Home from "../modules/Home";
import CourseList from "../modules/CourseList";
import CourseRegistration from "../modules/CourseRegistration";
import RegisteredCourses from "../modules/RegisteredCourses"; // Import the new component
import { useAuth } from "../AuthContext";

function StudentDashboard() {
  const { auth } = useAuth();
  const [activeModule, setActiveModule] = useState("");

  console.log('Rendering StudentDashboard with auth:', auth);

  return (
    <div className="app-container">
      <Sidebar setActiveModule={setActiveModule} />
      <div className="content-container">
        <Header />
        <div className="main-container">
          {activeModule === "courselist" ? (
            <CourseList username={auth.username} userId={auth.user_id} />
          ) : activeModule === "courseregistration" ? (
            <CourseRegistration username={auth.username} userId={auth.user_id} />
          ) : activeModule === "registeredcourses" ? ( // Add the new condition
            <RegisteredCourses username={auth.username} userId={auth.user_id} />
          ) : (
            <Home />
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
