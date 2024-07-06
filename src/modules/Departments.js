import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is installed with npm install axios
import Table from "../common/Table";
import "./Schools.css";

function Departments({ selectedTerm }) {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Department";
  const columns = [
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "Department Abbreviation", accessor: "dept_abbreviation", defaultVisible: true },
    { header: "Department Code", accessor: "dept_code", defaultVisible: true },
    { header: "Department Tags", accessor: "dept_tags", defaultVisible: false },
    { header: "Established Year", accessor: "established_year", defaultVisible: false },
    { header: "Department Type", accessor: "dept_type", defaultVisible: false },
    { header: "Number of UG Programs", accessor: "number_of_ug_programs", defaultVisible: true },
    { header: "Number of PG Programs", accessor: "number_of_pg_programs", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/departments?year=${selectedTerm}`);
        setDepartments(result.data);
        setFilteredDepartments(result.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = departments.filter((dept) =>
        columns.some((column) =>
          String(dept[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredDepartments(filteredData);
    } else {
      setFilteredDepartments(departments);
    }
  }, [searchTerm, departments]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddSubmit = (newData) => {
    setDepartments((prevDepartments) => [...prevDepartments, newData]);
    setFilteredDepartments((prevDepartments) => [...prevDepartments, newData]);
  };

  const handleBulkUploadComplete = (newData) => {
    setDepartments((prevDepartments) => [...prevDepartments, ...newData]);
    setFilteredDepartments((prevDepartments) => [...prevDepartments, ...newData]);
  };

  const formatDisplayName = (item) => {
    return `${item.dept_name} (${item.dept_abbreviation})`;
  };

  return (
    <div className="departments-container">
      <h1>&nbsp; &nbsp;&nbsp; Departments</h1>
      <Table
        data={filteredDepartments}
        columns={columns}
        initialPageSize={5}
        onEdit={() => alert("Edit functionality here")}
        onDelete={() => alert("Delete functionality here")}
        displayName={formatDisplayName}
        entityName={entityName}
        onAddSubmit={handleAddSubmit} // Pass the function to handle form submission
        onBulkUploadComplete={handleBulkUploadComplete} // Pass the function to handle bulk upload completion
        selectedTerm={selectedTerm}
      />
    </div>
  );
}

export default Departments;
