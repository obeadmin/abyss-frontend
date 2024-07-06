import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Common.css";

function AddModal({
  isOpen,
  data,
  onClose,
  onSubmit,
  entityName,
  selectedTerm,
}) {
  const [formData, setFormData] = useState(
    data.reduce((acc, item) => {
      if (
        (entityName !== "Program" &&
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
          item.accessor !== "structure_id" &&
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
          item.accessor !== "program_id" &&
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
          item.accessor !== "slot_id" &&
          item.accessor !== "program_id" &&
          item.accessor !== "employee_id" &&
          item.accessor !== "department_id" &&
          item.accessor !== "school_id" &&
          item.accessor !== "school_code" &&
          item.accessor !== "school_abbreviation")
      ) {
        return { ...acc, [item.accessor]: "" };
      }
      return acc;
    }, {}),
  );

  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [academicYearId, setAcademicYearId] = useState(null);

  useEffect(() => {
    const fetchAcademicYearId = async () => {
      if (selectedTerm) {
        try {
          const response = await axios.get(
            "http://localhost:3001/fetchacademicyearid",
            {
              params: { yearname: selectedTerm },
            },
          );
          if (response.data) {
            setAcademicYearId(response.data.academicyearid);
            setFormData((prev) => ({
              ...prev,
              academicyearid: response.data.academicyearid,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch academic year ID:", error);
        }
      }
    };

    fetchAcademicYearId();
  }, [selectedTerm]);

  useEffect(() => {
    if (academicYearId) {
      const fetchData = async () => {
        try {
          const schoolsResponse = await axios.get(
            "http://localhost:3001/schools",
            {
              params: { year: selectedTerm },
            },
          );
          setSchools(schoolsResponse.data);
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      };
      fetchData();
    }
  }, [academicYearId, selectedTerm]);

  useEffect(() => {
    if (formData.school_name && selectedTerm) {
      const fetchDepartments = async () => {
        try {
          const departmentsResponse = await axios.get(
            "http://localhost:3001/departments",
            {
              params: {
                year: selectedTerm,
                schoolName: formData.school_name,
              },
            },
          );
          setDepartments(departmentsResponse.data);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
        }
      };
      fetchDepartments();
    }
  }, [formData.school_name, selectedTerm]);

  useEffect(() => {
    if (academicYearId) {
      const fetchPrograms = async () => {
        try {
          const programsResponse = await axios.get(
            "http://localhost:3001/programs",
            {
              params: { year: selectedTerm },
            },
          );
          setPrograms(programsResponse.data);
        } catch (error) {
          console.error("Failed to fetch programs:", error);
        }
      };
      fetchPrograms();
    }
  }, [academicYearId, selectedTerm]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let submissionData = {
      entity: entityName,
      ...formData,
    };

    if (
      entityName === "Department" ||
      entityName === "Program" ||
      entityName === "Program_Structure" ||
      entityName === "Employee" ||
      entityName === "Student" ||
      entityName === "Room" ||
      entityName === "Slot_Assignment"
    ) {
      const selectedSchool = schools.find(
        (school) => school.school_name === formData.school_name,
      );
      if (selectedSchool) {
        submissionData = {
          ...submissionData,
          school_id: selectedSchool.school_id,
          school_code: selectedSchool.school_code,
          school_abbreviation: selectedSchool.school_abbreviation,
        };
      }

      if (
        entityName === "Program" ||
        entityName === "Program_Structure" ||
        entityName === "Employee" ||
        entityName === "Student" ||
        entityName === "Room" ||
        entityName === "Slot_Assignment"
      ) {
        const selectedDepartment = departments.find(
          (dept) => dept.dept_name === formData.dept_name,
        );
        if (selectedDepartment) {
          submissionData.department_id = selectedDepartment.department_id;
        } else {
          console.error("Department not found");
          return;
        }
      }

      if (entityName === "Program_Structure" || entityName === "Student") {
        const selectedProgram = programs.find(
          (program) => program.program_name === formData.program_name,
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

    axios
      .post("http://localhost:3001/add-entity", submissionData)
      .then((response) => {
        console.log("Submission successful", response.data);
        onSubmit({ ...formData, ...response.data });
        onClose();
      })
      .catch((error) => {
        console.error("Failed to submit:", error);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <button className="close-button" onClick={onClose}>
            ✖
          </button>
          <h2>Add {entityName}</h2>
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
                    item.accessor !== "structure_id" &&
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
                    item.accessor !== "program_id" &&
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
                      <input type="text" value={selectedTerm} readOnly />
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
                ),
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

export default AddModal;
