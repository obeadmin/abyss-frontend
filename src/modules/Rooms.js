import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../common/Table";
import "./Schools.css";

function Rooms({ selectedTerm }) {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const entityName = "Room";

  const columns = [
    { header: "Room ID", accessor: "room_id", defaultVisible: false },
    { header: "Academic Year ID", accessor: "academicyearid", defaultVisible: false },
    { header: "School ID", accessor: "school_id", defaultVisible: false },
    { header: "Department ID", accessor: "department_id", defaultVisible: false },
    { header: "School Code", accessor: "school_code", defaultVisible: false },
    { header: "School Abbreviation", accessor: "school_abbreviation", defaultVisible: false },
    { header: "School Name", accessor: "school_name", defaultVisible: true },
    { header: "Department Name", accessor: "dept_name", defaultVisible: true },
    { header: "Semester", accessor: "semester", defaultVisible: true },
    { header: "Room", accessor: "room", defaultVisible: true },
    { header: "Block", accessor: "block", defaultVisible: true },
    { header: "Room Type", accessor: "room_type", defaultVisible: true },
    { header: "Capacity", accessor: "capacity", defaultVisible: true },
    { header: "Status", accessor: "status", defaultVisible: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/rooms?year=${selectedTerm}`);
        setRooms(result.data);
        setFilteredRooms(result.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    if (selectedTerm) {
      fetchData();
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = rooms.filter((room) =>
        columns.some((column) =>
          String(room[column.accessor])
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
      setFilteredRooms(filteredData);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchTerm, rooms]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDisplayName = (item) => {
    return `${item.room} (${item.block})`;
  };

  const handleAddSubmit = (newData) => {
    setRooms(prevRooms => [...prevRooms, {...newData}]);
    setFilteredRooms(prevRooms => [...prevRooms, {...newData}]);
  };
  
  const handleBulkUploadComplete = (newData) => {
    setRooms((prevRooms) => [...prevRooms, ...newData]);
    setFilteredRooms((prevRooms) => [...prevRooms, ...newData]);
  };

  return (
    <div className="rooms-container">
      <h1>&nbsp; &nbsp;&nbsp; Rooms</h1>
      <Table
        key={Date.now()}
        data={filteredRooms}
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

export default Rooms;
