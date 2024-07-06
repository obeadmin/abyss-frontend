import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function Programs({ selectedTerm }) {
  const [programs, setPrograms] = useState([]);
  const [filteredPrograms, setFilteredPrograms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Program";

  const columns = [
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "Program ID", accessor: "program_id", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "Program Code", accessor: "program_code", defaultVisible: true },
    { header: "Program Abbreviation", accessor: "program_abbreviation", defaultVisible: true },
    { header: "Program Name", accessor: "program_name", defaultVisible: true },
    { header: "Program Credits", accessor: "program_credits", defaultVisible: true },
    { header: "Year of Launch", accessor: "year_of_launch", defaultVisible: true },
    { header: "Duration", accessor: "duration", defaultVisible: true },
    { header: "Intake", accessor: "intake", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/programs?year=${selectedTerm}`);
        setPrograms(result.data);
        setFilteredPrograms(result.data);
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = programs.filter((program) =>
        columns.some((column) =>
          String(program[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredPrograms(filteredData);
    } else {
      setFilteredPrograms(programs);
    }
  }, [searchTerm, programs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.program_name} (${item.program_abbreviation})`;
  };

  const handleAddSubmit = (newData) => {
    setPrograms(prevPrograms => [...prevPrograms, {...newData}]);
    setFilteredPrograms(prevPrograms => [...prevPrograms, {...newData}]);
  };
  
  const handleBulkUploadComplete = (newData) => {
    setPrograms((prevPrograms) => [...prevPrograms, ...newData]);
    setFilteredPrograms((prevPrograms) => [...prevPrograms, ...newData]);
  };

  return (
    <div className="programs-container">
      <h1>&nbsp; &nbsp;&nbsp; Programs</h1>
      <Table
        key={Date.now()}
        data={filteredPrograms}
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

export default Programs;
