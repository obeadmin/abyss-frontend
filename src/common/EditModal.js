import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Common.css";

function EditModal({
  isOpen,
  data,
  onClose,
  onSubmit,
  entityName,
  selectedTerm,
}) {
  const [formData, setFormData] = useState({});
  const [academicYearName, setAcademicYearName] = useState("");
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    if (isOpen && data) {
      const initialFormData = data.reduce(
        (acc, item) => ({
          ...acc,
          [item.accessor]: item.value,
        }),
        {}
      );
      setFormData(initialFormData);
      console.log("Initial Form Data:", initialFormData); // Log initial form data
    }
  }, [data, isOpen]);

  useEffect(() => {
    const fetchAcademicYearName = async () => {
      if (formData.academicyearid) {
        try {
          const response = await axios.get(
            `http://localhost:3001/academicyear/${formData.academicyearid}`
          );
          if (response.data) {
            setAcademicYearName(response.data.yearname);
          }
        } catch (error) {
          console.error("Failed to fetch academic year:", error);
        }
      }
    };

    if (isOpen && formData.academicyearid) {
      fetchAcademicYearName();
    }
  }, [isOpen, formData.academicyearid]);

  useEffect(() => {
    if (
      ["Department", "Program", "Program_Structure", "Employee", "Student", "Room", "Slot_Assignment"].includes(
        entityName
      )
    ) {
      const fetchSchools = async () => {
        try {
          const response = await axios.get("http://localhost:3001/schools", {
            params: { year: selectedTerm },
          });
          setSchools(response.data);
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      };
      fetchSchools();
    }
  }, [entityName, selectedTerm]);

  useEffect(() => {
    if (
      ["Program", "Program_Structure", "Employee", "Student", "Room", "Slot_Assignment"].includes(entityName) &&
      formData.school_name
    ) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3001/departments",
            {
              params: { year: selectedTerm, schoolName: formData.school_name },
            }
          );
          setDepartments(response.data);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
        }
      };
      fetchDepartments();
    }
  }, [entityName, formData.school_name, selectedTerm]);

  useEffect(() => {
    if (["Program_Structure", "Student", "Slot_Assignment"].includes(entityName) && formData.academicyearid) {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get("http://localhost:3001/programs", {
            params: { year: selectedTerm },
          });
          setPrograms(response.data);
        } catch (error) {
          console.error("Failed to fetch programs:", error);
        }
      };
      fetchPrograms();
    }
  }, [entityName, formData.academicyearid, selectedTerm]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let submissionData = {
      entity: entityName,
      id: formData.school_id || formData.department_id || formData.program_id || formData.employee_id || formData.student_id || formData.room_id || formData.assignment_id, // Ensure ID is correctly set
      ...formData,
    };

    if (
      ["Department", "Program", "Program_Structure", "Employee", "Student", "Room", "Slot_Assignment"].includes(
        entityName
      )
    ) {
      const selectedSchool = schools.find(
        (school) => school.school_name === formData.school_name
      );
      if (selectedSchool) {
        submissionData = {
          ...submissionData,
          school_id: selectedSchool.school_id,
          school_code: selectedSchool.school_code,
          school_abbreviation: selectedSchool.school_abbreviation,
        };
      }

      if (["Program", "Program_Structure", "Employee", "Student", "Room", "Slot_Assignment"].includes(entityName)) {
        const selectedDepartment = departments.find(
          (dept) => dept.dept_name === formData.dept_name
        );
        if (selectedDepartment) {
          submissionData.department_id = selectedDepartment.department_id;
        } else {
          console.error("Department not found");
          return;
        }
      }

      if (["Program_Structure", "Student", "Slot_Assignment"].includes(entityName)) {
        const selectedProgram = programs.find(
          (program) => program.program_name === formData.program_name
        );
        if (selectedProgram) {
          submissionData.program_id = selectedProgram.program_id;
        } else {
          console.error("Program not found");
          return;
        }
      }
    }

    console.log("Submission Data:", submissionData); // Log the submission data

    try {
      const response = await axios.put(
        "http://localhost:3001/update-entity",
        submissionData
      );
      console.log("Update response:", response);
      onSubmit({ ...formData, ...response.data }); // Ensure updated data is passed
      onClose();
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
          <h2>Edit {entityName}</h2>
          <form onSubmit={handleSubmit}>
            {data.map(
              (item) =>
                ((entityName !== "Program" &&
                  entityName !== "Program_Structure" &&
                  entityName !== "Department" &&
                  entityName !== "Employee" &&
                  entityName !== "Student" &&
                  entityName !== "Room" &&
                  entityName !== "Slot_Assignment" &&
                  item.accessor !== "school_id") ||
                  (entityName === "Department" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Program" &&
                    item.accessor !== "program_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Program_Structure" &&
                    item.accessor !== "program_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Employee" &&
                    item.accessor !== "employee_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Student" &&
                    item.accessor !== "student_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Room" &&
                    item.accessor !== "room_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation") ||
                  (entityName === "Slot_Assignment" &&
                    item.accessor !== "assignment_id" &&
                    item.accessor !== "program_id" &&
                    item.accessor !== "employee_id" &&
                    item.accessor !== "department_id" &&
                    item.accessor !== "school_id" &&
                    item.accessor !== "school_code" &&
                    item.accessor !== "school_abbreviation")) && (
                  <div key={item.accessor} className="form-group">
                    <label>
                      {item.accessor === "academicyearid"
                        ? "Academic Year"
                        : item.label}
                    </label>
                    {item.accessor === "academicyearid" ? (
                      <input type="text" value={academicYearName} readOnly />
                    ) : item.accessor === "school_name" &&
                      (entityName === "Department" ||
                        entityName === "Program" ||
                        entityName === "Program_Structure" ||
                        entityName === "Employee" ||
                        entityName === "Student" ||
                        entityName === "Room" ||
                        entityName === "Slot_Assignment") ? (
                      <select
                        className="dropdown"
                        value={formData[item.accessor] || ""}
                        onChange={(e) =>
                          handleChange(item.accessor, e.target.value)
                        }
                      >
                        <option value="">Select a School</option>
                        {schools.map((school) => (
                          <option
                            key={school.school_id}
                            value={school.school_name}
                          >
                            {school.school_name}
                          </option>
                        ))}
                      </select>
                    ) : item.accessor === "dept_name" &&
                      (entityName === "Program" ||
                        entityName === "Program_Structure" ||
                        entityName === "Employee" ||
                        entityName === "Student" ||
                        entityName === "Room" ||
                        entityName === "Slot_Assignment") ? (
                      <select
                        className="dropdown"
                        value={formData[item.accessor] || ""}
                        onChange={(e) =>
                          handleChange(item.accessor, e.target.value)
                        }
                      >
                        <option value="">Select a Department</option>
                        {departments.map((department) => (
                          <option
                            key={department.department_id}
                            value={department.dept_name}
                          >
                            {department.dept_name}
                          </option>
                        ))}
                      </select>
                    ) : item.accessor === "program_name" &&
                      (entityName === "Program_Structure" ||
                        entityName === "Student" ||
                        entityName === "Slot_Assignment") ? (
                      <select
                        className="dropdown"
                        value={formData[item.accessor] || ""}
                        onChange={(e) =>
                          handleChange(item.accessor, e.target.value)
                        }
                      >
                        <option value="">Select a Program</option>
                        {programs.map((program) => (
                          <option
                            key={program.program_id}
                            value={program.program_name}
                          >
                            {program.program_name}
                          </option>
                        ))}
                      </select>
                    ) : item.accessor === "status" ? (
                      <select
                        className="dropdown"
                        value={formData[item.accessor] || ""}
                        onChange={(e) =>
                          handleChange(item.accessor, e.target.value)
                        }
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData[item.accessor] || ""}
                        onChange={(e) =>
                          handleChange(item.accessor, e.target.value)
                        }
                      />
                    )}
                  </div>
                )
            )}
            <div className="form-buttons">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
