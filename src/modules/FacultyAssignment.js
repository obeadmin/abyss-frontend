import React, { useState, useEffect } from "react";
import axios from "axios";

function FacultyAssignment({ selectedTerm }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [programStructures, setProgramStructures] = useState([]);
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [draggingCourse, setDraggingCourse] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/api/employees?year=${selectedTerm}`);
        setEmployees(result.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    const fetchProgramStructures = async () => {
      try {
        const result = await axios.get(`http://localhost:3001/programstructures?year=${selectedTerm}`);
        setProgramStructures(result.data);
        setAvailableCourses(result.data);
      } catch (error) {
        console.error("Failed to fetch program structures:", error);
      }
    };

    if (selectedTerm) {
      fetchEmployees();
      fetchProgramStructures();
    }
  }, [selectedTerm]);

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

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    setAssignedCourses([]);
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
    setSelectedDepartment(null);
    setSelectedProgram(null);
    setSelectedSemester(null);
  };

  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setSelectedProgram(null);
    setSelectedSemester(null);
  };

  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgram(programId);
    setSelectedSemester(null);
  };

  const handleSemesterChange = (e) => {
    const semesterId = e.target.value;
    setSelectedSemester(semesterId);
  };

  const onDragStart = (course) => {
    setDraggingCourse(course);
  };

  const onDrop = (listType) => {
    if (draggingCourse) {
      if (listType === "available" && !availableCourses.includes(draggingCourse)) {
        setAvailableCourses((prevCourses) => [...prevCourses, draggingCourse]);
        setAssignedCourses((prevCourses) => prevCourses.filter((course) => course !== draggingCourse));
      } else if (listType === "assigned" && !assignedCourses.includes(draggingCourse)) {
        setAssignedCourses((prevCourses) => [...prevCourses, draggingCourse]);
        setAvailableCourses((prevCourses) => prevCourses.filter((course) => course !== draggingCourse));
      }
      setDraggingCourse(null);
    }
  };

  const handleAssignCourses = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    const courseIds = assignedCourses.map((course) => course.structure_id);

    try {
      await axios.post("http://localhost:3001/api/assign_courses", {
        employee_id: selectedEmployee,
        course_ids: courseIds,
      });
      alert("Courses assigned successfully");
    } catch (error) {
      console.error("Failed to assign courses:", error);
      alert("Failed to assign courses");
    }
  };

  return (
    <div className="faculty-assignment-container-new">
        
      <h1>Faculty Assignment</h1>
      <div className="Allot-Container">
      <div className="form-group-new">
        <label htmlFor="schoolSelect">Select School</label>
        <select id="schoolSelect" onChange={handleSchoolChange} value={selectedSchool || ""}>
          <option value="" disabled>
            Select School
          </option>
          {schools.map((school) => (
            <option key={school.school_id} value={school.school_id}>
              {school.school_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-new">
        <label htmlFor="departmentSelect">Select Department</label>
        <select id="departmentSelect" onChange={handleDepartmentChange} value={selectedDepartment || ""} disabled={!selectedSchool}>
          <option value="" disabled>
            Select Department
          </option>
          {departments.map((department) => (
            <option key={department.department_id} value={department.department_id}>
              {department.department_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-new">
        <label htmlFor="programSelect">Select Program</label>
        <select id="programSelect" onChange={handleProgramChange} value={selectedProgram || ""} disabled={!selectedDepartment}>
          <option value="" disabled>
            Select Program
          </option>
          {programs.map((program) => (
            <option key={program.program_id} value={program.program_id}>
              {program.program_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-new">
        <label htmlFor="semesterSelect">Select Semester</label>
        <select id="semesterSelect" onChange={handleSemesterChange} value={selectedSemester || ""} disabled={!selectedProgram}>
          <option value="" disabled>
            Select Semester
          </option>
          {semesters.map((semester) => (
            <option key={semester.semester_id} value={semester.semester_id}>
              {semester.semester_name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group-new">
        <label htmlFor="employeeSelect">Select Employee</label>
        <select id="employeeSelect" onChange={handleEmployeeChange} value={selectedEmployee || ""}>
          <option value="" disabled>
            Select Employee
          </option>
          {employees.map((employee) => (
            <option key={employee.employee_id} value={employee.employee_id}>
              {employee.employee_name}
            </option>
          ))}
        </select>
      </div>
      <div className="course-columns-new">
        <div
          className="course-list-new"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop("available")}
        >
          <h2>Available Courses</h2>
          {availableCourses.map((course) => (
            <div
              key={course.structure_id}
              className="course-item-new"
              draggable
              onDragStart={() => onDragStart(course)}
            >
              {course.course_title}
            </div>
          ))}
        </div>
        <div
          className="course-list-new"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop("assigned")}
        >
          <h2>Assigned Courses</h2>
          {assignedCourses.map((course) => (
            <div
              key={course.structure_id}
              className="course-item-new"
              draggable
              onDragStart={() => onDragStart(course)}
            >
              {course.course_title}
            </div>
          ))}
        </div>
      </div>
      <button className="assign-courses-button-new" onClick={handleAssignCourses}>Assign Courses</button>
      </div>
    </div>
  );
}

export default FacultyAssignment;
