import React, { useState, useEffect } from "react";
import axios from "axios"; // make sure to install axios with npm install axios
import Table from "../common/Table";
import "./Schools.css";

function Schools({ selectedTerm }) {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "School";

  const columns = [
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: true },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    {
      header: "School Abbreviation",
      accessor: "school_abbreviation",
      defaultVisible: true,
    },
    {
      header: "Year of Establishment",
      accessor: "year_of_establishment",
      defaultVisible: true,
    },
    {
      header: "Number of Departments",
      accessor: "number_of_departments",
      defaultVisible: true,
    },
    { header: "Status", accessor: "status", defaultVisible: true },
    { header: "School Tags", accessor: "school_tags", defaultVisible: false },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/schools?year=${selectedTerm}`);
        const mappedSchools = result.data.map((school, index) => ({
          ...school,
          id: index,
        }));
        setSchools(mappedSchools);
        setFilteredSchools(mappedSchools); // Initially, filteredSchools is the same as all schools
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = schools.filter((school) =>
        columns.some((column) =>
          String(school[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredSchools(filteredData);
    } else {
      setFilteredSchools(schools);
    }
  }, [searchTerm, schools]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.school_name} (${item.school_abbreviation})`;
  };

  const handleAddSubmit = (newData) => {
    setSchools(prevSchools => [...prevSchools, {...newData}]);
    setFilteredSchools(prevSchools => [...prevSchools, {...newData}]);
  };
  
  const handleBulkUploadComplete = (newData) => {
    setSchools((prevDepartments) => [...prevDepartments, ...newData]);
    setFilteredSchools((prevDepartments) => [...prevDepartments, ...newData]);
  };


  return (
    <div className="schools-container">
      <h1>&nbsp; &nbsp;&nbsp; Schools</h1>

      <Table
      key={Date.now()}
        data={filteredSchools}
        columns={columns}
        initialPageSize={5}
        onEdit={() => alert("Edit functionality here")}
        onDelete={() => alert("Delete functionality here")}
        displayName={formatDisplayName}
        entityName={entityName}
        onAddSubmit={handleAddSubmit} // Pass the add submit handler
        selectedTerm={selectedTerm}
        onBulkUploadComplete={handleBulkUploadComplete}
      />
    </div>
  );
}

export default Schools;
