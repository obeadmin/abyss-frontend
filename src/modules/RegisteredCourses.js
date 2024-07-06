import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RegisteredCourses.css';

function RegisteredCourses({ username, userId }) {
  const [semester, setSemester] = useState('');
  const [mandatoryCourses, setMandatoryCourses] = useState([]);
  const [electiveCourses, setElectiveCourses] = useState([]);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        // Fetch student details
        const studentResponse = await axios.get(`http://localhost:3001/studentdetails`, { params: { username, user_id: userId } });
        const { semester_name, registered, ...studentDetails } = studentResponse.data;
        setSemester(semester_name);
        setIsRegistered(registered === 'yes');

        if (registered === 'yes') {
          // Fetch course types
          const courseTypesResponse = await axios.get('http://localhost:3001/course_types');
          const courseTypes = courseTypesResponse.data;

          // Fetch mandatory courses
          const mandatoryTypes = courseTypes.filter(ct => ct.max_reg === 0);
          const mandatoryCourses = [];
          for (const type of mandatoryTypes) {
            const coursesResponse = await axios.get(`http://localhost:3001/courses_by_type`, { params: { course_type: type.course_type } });
            mandatoryCourses.push(...coursesResponse.data);
          }
          setMandatoryCourses(mandatoryCourses);

          // Fetch elective courses
          const electiveCourses = [];
          for (const type of courseTypes.filter(ct => ct.max_reg > 0)) {
            for (let i = 1; i <= type.max_reg; i++) {
              const columnName = type.max_reg > 1 ? `${type.course_type}(${i})` : type.course_type;
              const courseCode = studentDetails[columnName];
              if (courseCode) {
                const courseResponse = await axios.get(`http://localhost:3001/courses_by_type`, { params: { course_type: type.course_type } });
                const course = courseResponse.data.find(c => c.course_code === courseCode);
                if (course) {
                  electiveCourses.push(course);
                }
              }
            }
          }
          setElectiveCourses(electiveCourses);
        }
      } catch (err) {
        setError('An error occurred while fetching course details.');
        console.error('Fetch course details error:', err);
      }
    };

    fetchStudentDetails();
  }, [username, userId]);

  if (isRegistered === null) {
    return <p>Loading...</p>;
  }

  if (!isRegistered) {
    return <p>You have not registered courses for semester {semester}.</p>;
  }

  return (
    <div className="registered-courses-container">
      <h2>Registered Courses for Semester: {semester}</h2>
      {error && <p className="error-message">{error}</p>}
      <h3>Mandatory Courses</h3>
      <table className="course-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
          </tr>
        </thead>
        <tbody>
          {mandatoryCourses.map(course => (
            <tr key={course.course_code}>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Elective Courses</h3>
      <table className="course-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
          </tr>
        </thead>
        <tbody>
          {electiveCourses.map(course => (
            <tr key={course.course_code}>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegisteredCourses;
