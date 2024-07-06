import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function SlotAssignments({ selectedTerm }) {
  const [slotAssignments, setSlotAssignments] = useState([]);
  const [filteredSlotAssignments, setFilteredSlotAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Slot_Assignment";

  const columns = [
    { header: "Assignment ID", accessor: "assignment_id", defaultVisible: false },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Program ID", accessor: "program_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Program Name", accessor: "program_name", defaultVisible: true },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "Semester", accessor: "semester", defaultVisible: true },
    { header: "Course Code", accessor: "course_code", defaultVisible: true },
    { header: "Section No", accessor: "section_no", defaultVisible: true },
    { header: "Slot", accessor: "slot", defaultVisible: true },
    { header: "Room", accessor: "room", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/slot_assignments?year=${selectedTerm}`);
        setSlotAssignments(result.data);
        setFilteredSlotAssignments(result.data);
      } catch (error) {
        console.error("Failed to fetch slot assignments:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = slotAssignments.filter((assignment) =>
        columns.some((column) =>
          String(assignment[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredSlotAssignments(filteredData);
    } else {
      setFilteredSlotAssignments(slotAssignments);
    }
  }, [searchTerm, slotAssignments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.course_code} - ${item.section_no}`;
  };

  const handleAddSubmit = (newData) => {
    setSlotAssignments(prevAssignments => [...prevAssignments, {...newData}]);
    setFilteredSlotAssignments(prevAssignments => [...prevAssignments, {...newData}]);
  };
  
  const handleBulkUploadComplete = (newData) => {
    setSlotAssignments((prevAssignments) => [...prevAssignments, ...newData]);
    setFilteredSlotAssignments((prevAssignments) => [...prevAssignments, ...newData]);
  };

  return (
    <div className="slot-assignments-container">
      <h1>&nbsp; &nbsp;&nbsp; Slot Assignments</h1>
      <Table
        key={Date.now()}
        data={filteredSlotAssignments}
        columns={columns}
        initialPageSize={5}
        onEdit={() => alert("Edit functionality here")}
        onDelete={() => alert("Delete functionality here")}
        displayName={formatDisplayName}
        entityName={entityName}
        onAddSubmit={handleAddSubmit}
        selectedTerm={selectedTerm}
        onBulkUploadComplete={handleBulkUploadComplete}
      />
    </div>
  );
}

export default SlotAssignments;
