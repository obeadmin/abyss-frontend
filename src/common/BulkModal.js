import React, { useState, useRef, useEffect } from "react";
import "./Bulk.css";
import MappingInterface from "./MappingInterface";
import axios from "axios";

function BulkModal({ isOpen, onClose, columns, onUpload, onComplete, entityName, selectedTerm }) {
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSuccess, setFileSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [academicyearid, setAcademicyearid] = useState(null);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  const fileInputRef = useRef();

  useEffect(() => {
    const fetchAcademicyearid = async () => {
      if (selectedTerm) {
        try {
          const response = await axios.get(
            "http://localhost:3001/fetchacademicyearid",
            {
              params: { yearname: selectedTerm },
            },
          );
          if (response.data) {
            setAcademicyearid(response.data.academicyearid);
          } else {
            console.error("No academic year ID returned from API");
            setAcademicyearid(null);
          }
        } catch (error) {
          console.error("Failed to fetch academic year ID:", error);
          setAcademicyearid(null);
        }
      } else {
        console.error("No selected term provided");
        setAcademicyearid(null);
      }
    };
    fetchAcademicyearid();
  }, [selectedTerm]);

  useEffect(() => {
    if (academicyearid) {
      const fetchSchoolsAndDepartments = async () => {
        try {
          const schoolsResponse = await axios.get(
            "http://localhost:3001/schools",
            {
              params: { year: selectedTerm },
            },
          );
          setSchools(schoolsResponse.data);

          const departmentsResponse = await axios.get(
            "http://localhost:3001/departments",
            {
              params: { year: selectedTerm },
            },
          );
          setDepartments(departmentsResponse.data);

          const programsResponse = await axios.get(
            "http://localhost:3001/programs",
            {
              params: { year: selectedTerm },
            },
          );
          setPrograms(programsResponse.data);
        } catch (error) {
          console.error("Failed to fetch schools, departments, or programs:", error);
        }
      };
      fetchSchoolsAndDepartments();
    }
  }, [academicyearid, selectedTerm]);

  const fetchProgramId = (programName) => {
    const program = programs.find(program => program.program_name === programName);
    return program ? program.program_id : null;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateFileType(file);
  };

  const validateFileType = (file) => {
    const validTypes = ["csv", "xls", "xlsx"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (validTypes.includes(fileExtension)) {
      setFile(file);
      setFileName(file.name);
      setFileTypeError(false);
      setFileSuccess(true);
    } else {
      setFileTypeError(true);
      setFileSuccess(false);
      setFile(null);
      setFileName("");
    }
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow drop
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0]; // Access the files from the event
    validateFileType(file);
  };

  const goToMapping = () => {
    if (file && fileType) {
      setCurrentPage(2);
    }
  };

  const handleCancel = () => {
    onClose();
    setCurrentPage(1);
    setFileType("");
    setFile(null);
    setFileName("");
    setFileTypeError(false);
    setFileSuccess(false);
  };

  const handleBulkUpload = async (mappedData) => {
    try {
      const enrichedData = mappedData.map(item => {
        const school = schools.find(school => school.school_name === item.school_name);
        const department = departments.find(department => department.dept_name === item.dept_name);
        const program_id = fetchProgramId(item.program_name);
        return {
          ...item,
          academicyearid: academicyearid,
          school_id: school ? school.school_id : null,
          department_id: department ? department.department_id : null,
          program_id: program_id,
        };
      });

      const response = await axios.post("http://localhost:3001/bulk-upload", {
        entity: entityName,
        data: enrichedData,
      });

      if (onComplete) {
        onComplete(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error during bulk upload:", error);
      alert(`Bulk upload failed, please try again. Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  if (!isOpen) return null;

  const filteredColumns = columns.filter(
    (col) => ![
      "academicyearid",
      "school_id",
      "department_id",
      "program_id",
      "employee_id",
      "student_id",
      "structure_id",
      "assignment_id",
      "room_id"
    ].includes(col.accessor)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={handleCancel}>
          ✖
        </button>
        {currentPage === 1 && (
          <div>
            <h2>Upload File</h2>
            <div>
              <p>What is your file type?</p>
              <label>
                <input
                  type="radio"
                  name="fileType"
                  value="CSV"
                  checked={fileType === "CSV"}
                  onChange={handleFileTypeChange}
                />{" "}
                CSV
              </label>
              <label>
                <input
                  type="radio"
                  name="fileType"
                  value="Excel"
                  checked={fileType === "Excel"}
                  onChange={handleFileTypeChange}
                />{" "}
                Excel
              </label>
            </div>
            <div
              className="file-input-container"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <button
                className="file-input-button"
                onClick={() => fileInputRef.current.click()}
              >
                Choose or Drop File
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            <div className="form-buttons">
              <button
                onClick={goToMapping}
                disabled={!file || !fileType}
                className="submit-button"
              >
                Next
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
            {fileTypeError && (
              <div className="error-message">
                Invalid file type. Please upload a CSV or Excel file.
              </div>
            )}
            {fileSuccess && (
              <div className="success-message">
                File successfully uploaded: {fileName}
              </div>
            )}
          </div>
        )}
        {currentPage === 2 && (
          <MappingInterface
            columns={filteredColumns}
            file={file}
            onClose={handleCancel}
            onUpload={handleBulkUpload}
          />
        )}
      </div>
    </div>
  );
}

export default BulkModal;
