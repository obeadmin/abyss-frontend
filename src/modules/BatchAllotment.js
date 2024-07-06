import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Allotment.css";

function BatchAllotment({ selectedTerm }) {
  const [activeTab, setActiveTab] = useState("automated");
  const [regexBased, setRegexBased] = useState(true);
  const [batchConfig, setBatchConfig] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [batchType, setBatchType] = useState("existing");
  const [selectedAll, setSelectedAll] = useState(false);
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [maxBatchCount, setMaxBatchCount] = useState(0);
  const [numberOfBatches, setNumberOfBatches] = useState(0);
  const [batchName, setBatchName] = useState("");

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get("http://localhost:3001/semesters");
        setSemesters(response.data);
      } catch (error) {
        console.error("Failed to fetch semesters:", error);
      }
    };
    fetchSemesters();
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      if (selectedTerm) {
        try {
          const response = await axios.get("http://localhost:3001/schools", {
            params: { year: selectedTerm },
          });
          setSchools(response.data);
        } catch (error) {
          console.error("Failed to fetch schools:", error);
        }
      }
    };
    fetchSchools();
  }, [selectedTerm]);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedSchool) {
        try {
          const response = await axios.get("http://localhost:3001/departments", {
            params: { year: selectedTerm, school: selectedSchool },
          });
          setDepartments(response.data);
        } catch (error) {
          console.error("Failed to fetch departments:", error);
        }
      }
    };
    fetchDepartments();
  }, [selectedSchool]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (selectedSchool && selectedDepartment) {
        try {
          const response = await axios.get("http://localhost:3001/programs", {
            params: { year: selectedTerm, school: selectedSchool, department: selectedDepartment },
          });
          setPrograms(response.data);
        } catch (error) {
          console.error("Failed to fetch programs:", error);
        }
      }
    };
    fetchPrograms();
  }, [selectedSchool, selectedDepartment, selectedTerm]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/allotstudents", {
          params: {
            school_id: selectedSchool,
            department_id: selectedDepartment,
            program_id: selectedProgram,
            semestername: selectedSemester,
            limit: maxBatchCount,
          },
        });
        const studentsWithSelection = response.data.map(student => ({
          ...student,
          selected: false
        }));
        setStudents(studentsWithSelection);
        console.log("Fetched students with selection:", studentsWithSelection);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    if (selectedSchool && selectedDepartment && selectedProgram && selectedSemester) {
      fetchStudents();
    }
  }, [selectedSchool, selectedDepartment, selectedProgram, selectedSemester, maxBatchCount]);

  const handleMaxBatchCountChange = (e) => {
    setMaxBatchCount(Number(e.target.value));
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  const handleRegexBasedChange = () => {
    setRegexBased(true);
  };

  const handleFormBasedChange = () => {
    setRegexBased(false);
  };

  const addBatchConfigField = () => {
    setBatchConfig([...batchConfig, { type: "static", value: "" }]);
  };

  const handleBatchConfigChange = (index, field, value) => {
    const newConfig = [...batchConfig];
    newConfig[index][field] = value;
    setBatchConfig(newConfig);
  };

  const removeBatchConfigField = (index) => {
    const newConfig = [...batchConfig];
    newConfig.splice(index, 1);
    setBatchConfig(newConfig);
  };

  const toggleSelectAll = () => {
    setSelectedAll(!selectedAll);
    setStudents(students.map(student => ({ ...student, selected: !selectedAll })));
    console.log("Students after select all toggle:", students);
  };

  const handleStudentSelect = (id) => {
    setStudents(students.map(student =>
      student.student_id === id ? { ...student, selected: !student.selected } : student
    ));
    console.log("Students after individual select toggle:", students);
  };

  const handleBatchTypeChange = (event) => {
    setBatchType(event.target.value);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const allotBatches = () => {
    const selectedStudentIds = students
      .filter(student => student.selected)
      .map(student => student.student_id);

    console.log("Selected student IDs:", selectedStudentIds);

    axios.post("http://localhost:3001/assign-batches", {
      batch_name: batchName,
      semester_name: selectedSemester,
      student_ids: selectedStudentIds
    })
    .then(response => {
      console.log("Batches assigned successfully:", response.data);
      alert("Batches assigned successfully");
      closeModal();
    })
    .catch(error => {
      console.error("Error assigning batches:", error);
      alert("Error assigning batches");
    });
  };

  return (
    <div>
      <h1>Batch Allotment</h1>
      <div className="Allot-Container">
        <div className="toolbar">
          <button
            className={`tab-button ${activeTab === "automated" ? "active" : ""}`}
            onClick={() => handleTabSelect("automated")}
          >
            Automated
          </button>
          <button
            className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
            onClick={() => handleTabSelect("manual")}
          >
            Manual
          </button>
        </div>

        {activeTab === "automated" ? (
          <div>
            <div className="form-group">
              <label>Select School</label>
              <select onChange={(e) => setSelectedSchool(e.target.value)} value={selectedSchool}>
                <option value="">Select School</option>
                {schools.map(school => (
                  <option key={school.school_id} value={school.school_id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Department</label>
              <select onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Program</label>
              <select onChange={(e) => setSelectedProgram(e.target.value)} value={selectedProgram}>
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Semester</label>
              <select onChange={(e) => setSelectedSemester(e.target.value)} value={selectedSemester}>
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.semester_name} value={semester.semester_name}>
                    {semester.semester_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Max Batch Count</label>
              <input type="number" onChange={handleMaxBatchCountChange} value={maxBatchCount} />
            </div>

            <div className="form-group">
              <label>Number of Batches</label>
              <input type="number" onChange={(e) => setNumberOfBatches(Number(e.target.value))} value={numberOfBatches} />
            </div>

            <div className="form-group">
              <label>Batch Name</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="batchNameMethod"
                    onChange={handleRegexBasedChange}
                    checked={regexBased}
                  />
                  Regex Based
                </label>
                <label>
                  <input
                    type="radio"
                    name="batchNameMethod"
                    onChange={handleFormBasedChange}
                  />
                  Form Based
                </label>
              </div>
            </div>

            {regexBased ? (
              <div className="form-group">
                <label>Regex Pattern</label>
                <input type="text" placeholder="e.g., BATCH-[A-Z]{2}-[0-9]{2}" />
              </div>
            ) : (
              <div>
                {batchConfig.map((config, index) => (
                  <div className="form-group" key={index}>
                    <select
                      value={config.type}
                      onChange={(e) =>
                        handleBatchConfigChange(index, "type", e.target.value)
                      }
                    >
                      <option value="static">Static</option>
                      <option value="variable">Variable</option>
                    </select>
                    {config.type === "static" ? (
                      <input
                        type="text"
                        value={config.value}
                        onChange={(e) =>
                          handleBatchConfigChange(index, "value", e.target.value)
                        }
                      />
                    ) : (
                      <>
                        <select
                          value={config.value}
                          onChange={(e) =>
                            handleBatchConfigChange(index, "value", e.target.value)
                          }
                        >
                          <option value="alphabet">Alphabet</option>
                          <option value="numbers">Numbers</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Set range (e.g., A-Z,0-9)"
                          onChange={(e) =>
                            handleBatchConfigChange(index, "range", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          placeholder="Exclude (e.g., B,D,5)"
                          onChange={(e) =>
                            handleBatchConfigChange(index, "exclude", e.target.value)
                          }
                        />
                      </>
                    )}
                    <button
                      className="remove-field-button"
                      onClick={() => removeBatchConfigField(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button className="add-field-button" onClick={addBatchConfigField}>
                  Add Field
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>Select School</label>
              <select onChange={(e) => setSelectedSchool(e.target.value)} value={selectedSchool}>
                <option value="">Select School</option>
                {schools.map(school => (
                  <option key={school.school_id} value={school.school_id}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Department</label>
              <select onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.department_id} value={dept.department_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Program</label>
              <select onChange={(e) => setSelectedProgram(e.target.value)} value={selectedProgram}>
                <option value="">Select Program</option>
                {programs.map(program => (
                  <option key={program.program_id} value={program.program_id}>
                    {program.program_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Semester</label>
              <select onChange={(e) => setSelectedSemester(e.target.value)} value={selectedSemester}>
                <option value="">Select Semester</option>
                {semesters.map(semester => (
                  <option key={semester.semester_name} value={semester.semester_name}>
                    {semester.semester_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Max Batch Count</label>
              <input type="number" onChange={handleMaxBatchCountChange} value={maxBatchCount} />
            </div>

            <table className="batch-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedAll}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={student.selected}
                        onChange={() => handleStudentSelect(student.student_id)}
                      />
                    </td>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="assign-batch-button" onClick={openModal}>
              Assign Batch
            </button>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <button className="close-button" onClick={closeModal}>
                    &times;
                  </button>
                  <div className="form-group">
                    <label>
                      <input
                        type="radio"
                        name="batchType"
                        value="existing"
                        checked={batchType === "existing"}
                        onChange={handleBatchTypeChange}
                      />
                      Existing Batch
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="batchType"
                        value="new"
                        checked={batchType === "new"}
                        onChange={handleBatchTypeChange}
                      />
                      New Batch
                    </label>
                  </div>
                  {batchType === "existing" ? (
                    <div className="form-group">
                      <label>Batch Name</label>
                      <select>
                        <option>Batch 1</option>
                        <option>Batch 2</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Batch Name</label>
                      <input
                        type="text"
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                      />
                    </div>
                  )}
                  <button className="submit-button" onClick={allotBatches}>
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchAllotment;
