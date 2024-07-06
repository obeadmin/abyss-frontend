import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function Students({ selectedTerm }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Student";

  const columns = [
    { header: "Student ID", accessor: "student_id", defaultVisible: true },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Program ID", accessor: "program_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "Program Name", accessor: "program_name", defaultVisible: true },
    { header: "Student Code", accessor: "student_code", defaultVisible: true },
    { header: "Student Name", accessor: "student_name", defaultVisible: true },
    { header: "Email ID", accessor: "email_id", defaultVisible: true },
    { header: "Contact Number", accessor: "contact_number", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/students?year=${selectedTerm}`);
        setStudents(result.data);
        setFilteredStudents(result.data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = students.filter((student) =>
        columns.some((column) =>
          String(student[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredStudents(filteredData);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.student_name} (${item.student_code})`;
  };

  const handleAddSubmit = (newData) => {
    setStudents(prevStudents => [...prevStudents, {...newData}]);
    setFilteredStudents(prevStudents => [...prevStudents, {...newData}]);
  };
  
  const handleBulkUploadComplete = (newData) => {
    setStudents((prevStudents) => [...prevStudents, ...newData]);
    setFilteredStudents((prevStudents) => [...prevStudents, ...newData]);
  };

  return (
    <div className="students-container">
      <h1>&nbsp; &nbsp;&nbsp; Students</h1>
      <Table
        key={Date.now()}
        data={filteredStudents}
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

export default Students;
