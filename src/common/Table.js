import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import BulkModal from "./BulkModal";
import AddModal from "./AddModal";
import "./Common.css";

function Table({
  data,
  columns,
  initialPageSize,
  onEdit,
  onDelete,
  displayName,
  entityName,
  onAddSubmit,
  onBulkUploadComplete,
  selectedTerm,
}) {
  const [items, setItems] = useState(data);
  const [filteredItems, setFilteredItems] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(initialPageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce(
      (acc, column) => ({
        ...acc,
        [column.accessor]: column.defaultVisible,
      }),
      {},
    ),
  );
  const dropdownRef = useRef(null);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const addDropdownRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ name: "", abbreviation: "" });
  const [deleteItems, setDeleteItems] = useState([]);
  const [bulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addDropdownRef.current &&
        !addDropdownRef.current.contains(event.target)
      ) {
        setAddDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setFilteredItems(
      data.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(filterText.toLowerCase()),
        ),
      ),
    );
  }, [filterText, data]);

  useEffect(() => {
    const searchFilter = data.filter((item) =>
      columns.some((column) =>
        String(item[column.accessor])
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
    setFilteredItems(searchFilter);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, data, columns]);

  useEffect(() => {
    console.log("Force update triggered");
  }, [forceUpdate]);

  const handleBulkUploadComplete = (newData) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems, ...newData];
      return updatedItems;
    });
    setFilteredItems((prevFilteredItems) => [...prevFilteredItems, ...newData]);
    onBulkUploadComplete(newData);
  };

  const handleBulkUploadSubmit = (newData) => {
    setItems((prevItems) => [...prevItems, ...newData]);
    setFilteredItems((prevFilteredItems) => [...prevFilteredItems, ...newData]);
    setBulkUploadModalOpen(false);
  };

  const handleBulkUpload = async (mappedData) => {
    try {
      const response = await axios.post("http://localhost:3001/bulk-upload", {
        entity: entityName,
        data: mappedData,
      });
      handleBulkUploadComplete(response.data);
      setBulkUploadModalOpen(false); // Close modal after successful upload
    } catch (error) {
      console.error(
        "Error during bulk upload:",
        error.response || error.message || error,
      );
      alert(
        `Bulk upload failed, please try again. Error: ${error.response ? error.response.data : error.message}`,
      );
    }
  };

  const getKey = (entityName) => {
    switch (entityName) {
      case "School":
        return "school_id";
      case "Department":
        return "department_id";
      case "Program":
        return "program_id";
      case "Program_Structure":
        return "structure_id";
      case "Employee":
        return "employee_id";
      case "Student":
        return "student_id";
      case "Room": // Add this case for Room
        return "room_id";
      case "Slot_Assignment": // Add this case for Slot_Assignment
        return "assignment_id";
      default:
        return "id";
    }
  };

  const handleSubmitEdit = async (updatedData) => {
    setEditModalOpen(false);
    const key = getKey(entityName);

    try {
      // Log the data being sent to the backend
      console.log("Updated data being sent:", updatedData);

      const response = await axios.put(`http://localhost:3001/update-entity`, {
        entity: entityName,
        id: updatedData[key], // Ensure the correct key is included
        ...updatedData,
      });

      if (response.status === 200) {
        const updatedRecord = response.data;
        console.log("Updated record from backend:", updatedRecord);

        setItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item[key] === updatedRecord[key] ? updatedRecord : item,
          );
          return updatedItems;
        });

        setFilteredItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item[key] === updatedRecord[key] ? updatedRecord : item,
          );
          return updatedItems;
        });
      } else {
        console.error("Failed to update the record in the backend.");
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const toggleColumnVisibility = (accessor) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [accessor]: !prevState[accessor],
    }));
  };

  const handleEdit = () => {
    const key = getKey(entityName);
    const selectedData = data.find((item) => selectedIds.has(item[key]));
    if (selectedData) {
      const modalData = columns.map((column) => ({
        label: column.header,
        accessor: column.accessor,
        value: selectedData[column.accessor],
      }));
      setEditData(modalData);
      setEditModalOpen(true);
      console.log("Edit Modal Data:", modalData);
    } else {
      console.error("No row selected or row not found.");
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  };

  const convertToCSV = (objArray) => {
    const array = objArray instanceof Array ? objArray : [objArray];
    let csv = "";

    const headers = columns
      .filter((col) => columnVisibility[col.accessor])
      .map((col) => col.header);
    csv += headers.join(",") + "\r\n";

    for (const obj of array) {
      const row = columns
        .filter((col) => columnVisibility[col.accessor])
        .map((col) => {
          const escaped = ("" + obj[col.accessor]).replace(/"/g, '""');
          return `"${escaped}"`;
        });
      csv += row.join(",") + "\r\n";
    }

    return csv;
  };

  const handleRefresh = () => {
    setIsLoading(true);

    setTimeout(() => {
      setItems([...data]);
      setFilteredItems([...data]);
      setFilterText("");
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    if (selectedIds.size === 0) {
      alert("No records selected for export.");
      return;
    }

    const exportData = data.filter((item) =>
      selectedIds.has(item[getKey(entityName)]),
    );

    const csvString = convertToCSV(exportData);

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageSizeChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleDelete = () => {
    const key = getKey(entityName);
    const selectedItems = data.filter((item) => selectedIds.has(item[key]));
    if (selectedItems.length > 0) {
      setDeleteItems(selectedItems);
      setDeleteModalOpen(true);
    } else {
      console.error("No items selected for deletion.");
    }
  };

  const confirmDelete = () => {
    onDelete(deleteItems);
    setDeleteModalOpen(false);
  };

  const openBulkUploadModal = () => {
    setBulkUploadModalOpen(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredItems.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(
    startRecord + recordsPerPage - 1,
    filteredItems.length,
  );

  return (
    <div className="crud-table">
      {isLoading && (
        <div className="loading-spinner">
          <img src="https://i.imgur.com/llF5iyg.gif" alt="Loading..." />
        </div>
      )}
      <div className="toolbar">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Column
          <img
            src="https://img.icons8.com/sf-black/64/1A1A1A/expand-arrow.png"
            alt="expand-arrow"
            style={{ width: "16px", marginLeft: "5px" }}
          />
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
          >
            {columns.map((column, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={columnVisibility[column.accessor]}
                  onChange={() => toggleColumnVisibility(column.accessor)}
                />
                &nbsp; {column.header}
              </div>
            ))}
          </div>
        )}

        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleEdit}
          disabled={selectedIds.size !== 1}
        >
          <img
            src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/1A1A1A/external-edit-customer-reviews-tanah-basah-basic-outline-tanah-basah.png"
            alt="Edit"
            style={{ marginRight: "5px" }}
          />
          Edit
        </button>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={selectedIds.size === 0}
          onClick={handleDelete}
        >
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/material-sharp/24/FA5252/delete-trash.png"
            alt="delete-trash"
          />
          &nbsp;Delete
        </button>

        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleRefresh}
        >
          <img
            width="23"
            height="23"
            src="https://img.icons8.com/office/30/available-updates.png"
            alt="available-updates"
          />{" "}
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleExport}
        >
          {" "}
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/external-Export-arrows-tanah-basah-basic-outline-tanah-basah.png"
            alt="external-Export-arrows-tanah-basah-basic-outline-tanah-basah"
          />
          &nbsp; Export
        </button>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setAdvancedSearchOpen(!advancedSearchOpen)}
        >
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/sf-regular/48/sorting-options.png"
            alt="sorting-options"
          />
          &nbsp; Advanced filters
        </button>
        <button
          className="addButton"
          onClick={() => setAddDropdownOpen(!addDropdownOpen)}
        >
          <img
            src="https://img.icons8.com/external-creatype-glyph-colourcreatype/64/FFFFFF/external-add-essential-ui-v4-creatype-glyph-colourcreatype.png"
            alt="add"
            style={{ width: "20px", marginRight: "5px" }}
          />
          Add
        </button>

        {addDropdownOpen && (
          <div ref={addDropdownRef} className="add-dropdown">
            <div onClick={openBulkUploadModal}>&nbsp; &nbsp; Bulk Upload</div>
            <div onClick={() => setAddModalOpen(true)}>
              {" "}
              &nbsp; Add an entry
            </div>
          </div>
        )}
      </div>
      <div key={Date.now()}>
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const newSelectedIds = new Set();

                    if (isChecked) {
                      filteredItems.forEach((item) => {
                        newSelectedIds.add(item[getKey(entityName)]);
                      });
                    }
                    setSelectedIds(newSelectedIds);
                    console.log(
                      "Select All - Checked:",
                      isChecked,
                      "New Selected IDs:",
                      Array.from(newSelectedIds),
                    );
                  }}
                  checked={
                    selectedIds.size > 0 &&
                    selectedIds.size === filteredItems.length
                  }
                />
              </th>
              {columns.map(
                (column, index) =>
                  columnVisibility[column.accessor] && (
                    <th key={index}>{column.header}</th>
                  ),
              )}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item) => (
              <tr key={item[getKey(entityName)]}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item[getKey(entityName)])}
                    onChange={() => toggleSelect(item[getKey(entityName)])}
                  />
                </td>
                {columns.map(
                  (column, columnIndex) =>
                    columnVisibility[column.accessor] && (
                      <td
                        key={`${item[getKey(entityName)]}-${column.accessor}-${columnIndex}`}
                      >
                        {column.accessor === "status" ? (
                          <span
                            style={{
                              color: item.status === "Active" ? "green" : "red",
                            }}
                          >
                            {item[column.accessor]}
                          </span>
                        ) : (
                          item[column.accessor]
                        )}
                      </td>
                    ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <div className="page-size-dropdown">
          Show
          <select value={recordsPerPage} onChange={handlePageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
          entries per page
        </div>
        <div className="pagination-controls">
          <span>
            Showing results {startRecord} - {endRecord} of{" "}
            {filteredItems.length}
          </span>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <img
              width="10"
              height="13"
              src="https://img.icons8.com/ios-glyphs/30/less-than.png"
              alt="Previous Page"
            />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage >= Math.ceil(filteredItems.length / recordsPerPage)
            }
          >
            <img
              width="10"
              height="13"
              src="https://img.icons8.com/ios-glyphs/30/more-than.png"
              alt="Next Page"
            />
          </button>
        </div>
      </div>
      <BulkModal
        isOpen={bulkUploadModalOpen}
        onClose={() => setBulkUploadModalOpen(false)}
        columns={columns}
        onUpload={handleBulkUpload}
        onComplete={handleBulkUploadComplete}
        entityName={entityName}
        selectedTerm={selectedTerm}
      />
      <EditModal
        isOpen={editModalOpen}
        data={editData}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEdit}
        entityName={entityName}
        selectedTerm={selectedTerm}
      />
      <AddModal
        isOpen={addModalOpen}
        data={columns.map((column) => ({
          label: column.header,
          accessor: column.accessor,
        }))}
        onClose={() => setAddModalOpen(false)}
        onSubmit={onAddSubmit}
        entityName={entityName}
        selectedTerm={selectedTerm}
      />
    </div>
  );
}

export default Table;
