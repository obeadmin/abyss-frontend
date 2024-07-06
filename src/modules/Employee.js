import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function Employee({ selectedTerm }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Employee";

  const columns = [
    { header: "Employee ID", accessor: "employee_id", defaultVisible: false },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Employee Code", accessor: "employee_code", defaultVisible: true },
    { header: "Employee Name", accessor: "employee_name", defaultVisible: true },
    { header: "Email ID", accessor: "email_id", defaultVisible: true },
    { header: "Contact Number", accessor: "contact_number", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/employees?year=${selectedTerm}`);
        setEmployees(result.data);
        setFilteredEmployees(result.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = employees.filter((employee) =>
        columns.some((column) =>
          String(employee[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredEmployees(filteredData);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.employee_name} (${item.employee_code})`;
  };

  const handleAddSubmit = (newData) => {
    setEmployees((prevEmployees) => [...prevEmployees, { ...newData }]);
    setFilteredEmployees((prevEmployees) => [...prevEmployees, { ...newData }]);
  };

  const handleBulkUploadComplete = (newData) => {
    setEmployees((prevEmployees) => [...prevEmployees, ...newData]);
    setFilteredEmployees((prevEmployees) => [...prevEmployees, ...newData]);
  };

  return (
    <div className="employees-container">
      <h1>&nbsp; &nbsp;&nbsp; Employees</h1>
      <Table
        key={Date.now()}
        data={filteredEmployees}
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

export default Employee;
