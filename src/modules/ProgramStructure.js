import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function ProgramStructure({ selectedTerm }) {
  const [programStructures, setProgramStructures] = useState([]);
  const [filteredProgramStructures, setFilteredProgramStructures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Program_Structure";

  const columns = [
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Department Name", accessor: "dept_name", defaultVisible: false },
    { header: "Program Name", accessor: "program_name", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Program ID", accessor: "program_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "Program Structure ID", accessor: "structure_id", defaultVisible: false },
    { header: "Semester", accessor: "semester_name", defaultVisible: true },
    { header: "Course Code", accessor: "course_code", defaultVisible: true },
    { header: "Course Title", accessor: "course_title", defaultVisible: true },
    { header: "Lecture Hours", accessor: "lecture_hours", defaultVisible: true },
    { header: "Tutorial Hours", accessor: "tutorial_hours", defaultVisible: true },
    { header: "Practical Hours", accessor: "practical_hours", defaultVisible: true },
    { header: "Total Hours", accessor: "total_hours", defaultVisible: true },
    { header: "Credits", accessor: "credits", defaultVisible: true },
    { header: "Marks", accessor: "marks", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/programstructures?year=${selectedTerm}`);
        setProgramStructures(result.data);
        setFilteredProgramStructures(result.data);
      } catch (error) {
        console.error("Failed to fetch program structures:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = programStructures.filter((structure) =>
        columns.some((column) =>
          String(structure[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredProgramStructures(filteredData);
    } else {
      setFilteredProgramStructures(programStructures);
    }
  }, [searchTerm, programStructures]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.course_title} (${item.course_code})`;
  };

  const handleAddSubmit = (newData) => {
    setProgramStructures(prevStructures => [...prevStructures, { ...newData }]);
    setFilteredProgramStructures(prevStructures => [...prevStructures, { ...newData }]);
  };

  const handleBulkUploadComplete = (newData) => {
    setProgramStructures((prevStructures) => [...prevStructures, ...newData]);
    setFilteredProgramStructures((prevStructures) => [...prevStructures, ...newData]);
  };

  return (
    <div className="program-structures-container">
      <h1>&nbsp; &nbsp;&nbsp; Program Structures</h1>
      <Table
        key={Date.now()}
        data={filteredProgramStructures}
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

export default ProgramStructure;
