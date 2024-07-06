import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Schools from "../modules/Schools";
import Departments from "../modules/Departments";
import Programs from "../modules/Programs";
import ProgramStructure from "../modules/ProgramStructure";
import Employee from "../modules/Employee";
import Students from "../modules/Students";
import Rooms from "../modules/Rooms";
import SlotAssignments from "../modules/SlotAssignments";
import BatchAllotment from "../modules/BatchAllotment";
import FacultyAssignment from "../modules/FacultyAssignment";  // Importing the new module
import Header from "./Header";
import "../App.css";
import Home from "../modules/Home";

function AdminDashboard() {
  const [activeModule, setActiveModule] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");

  return (
    <div className="app-container">
      <Sidebar setActiveModule={setActiveModule} />
      <div className="content-container">
        <Header onSelectTerm={setSelectedTerm} />
        <div className="main-container">
          {activeModule === "schools" ? (
            <Schools selectedTerm={selectedTerm} />
          ) : activeModule === "departments" ? (
            <Departments selectedTerm={selectedTerm} />
          ) : activeModule === "programs" ? (
            <Programs selectedTerm={selectedTerm} />
          ) : activeModule === "program-structure" ? (
            <ProgramStructure selectedTerm={selectedTerm} />
          ) : activeModule === "employee" ? (
            <Employee selectedTerm={selectedTerm} />
          ) : activeModule === "students" ? (
            <Students selectedTerm={selectedTerm} />
          ) : activeModule === "rooms" ? (
            <Rooms selectedTerm={selectedTerm} />
          ) : activeModule === "slotassignment" ? (
            <SlotAssignments selectedTerm={selectedTerm} />
          ) : activeModule === "batchallotment" ? (
            <BatchAllotment selectedTerm={selectedTerm} />
          ) : activeModule === "facultyassignment" ? (  // Adding condition for the new module
            <FacultyAssignment selectedTerm={selectedTerm} />
          ) : (
            <Home />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
