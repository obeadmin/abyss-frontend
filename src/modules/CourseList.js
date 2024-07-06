import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CourseList.css'; // Create a separate CSS file for styling

function CourseList({ username, userId }) {
  const [courses, setCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchSemesterAndCourses = async () => {
      try {
        // Fetch semester for the student
        const semesterResponse = await axios.get(`http://localhost:3001/studentdetails`, { params: { username, user_id: userId } });
        const semester_name = semesterResponse.data.semester_name;
        setSemester(semester_name);

        // Fetch courses for the fetched semester
        const coursesResponse = await axios.get(`http://localhost:3001/courses`, { params: { semester: semester_name } });
        setCourses(coursesResponse.data);
      } catch (err) {
        setError('An error occurred while fetching courses.');
        console.error('Fetch courses error:', err);
      }
    };

    fetchSemesterAndCourses();
  }, [username, userId]);

  // Calculate current courses to display
  const indexOfLastCourse = currentPage * recordsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - recordsPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(courses.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageSizeChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(startRecord + recordsPerPage - 1, courses.length);

  const showCourseDetails = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="course-list-container">
      <h2>Course List for Semester: {semester}</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="course-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map(course => (
            <tr key={course.course_code} onClick={() => showCourseDetails(course)} className="clickable-row">
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
            Showing results {startRecord} - {endRecord} of {courses.length}
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
            disabled={currentPage >= Math.ceil(courses.length / recordsPerPage)}
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
      {selectedCourse && (
        <div className="course-details-pane">
          <button className="close-button" onClick={closeCourseDetails}>
            <img src="https://img.icons8.com/ios-filled/24/000000/multiply.png" alt="Close" />
          </button>
          <h3>Course Details</h3>
          <div className="course-details-content">
            <div className="course-details-column">
              <p><strong>School Name:</strong> {selectedCourse.school_name}</p>
              <p><strong>Course Code:</strong> {selectedCourse.course_code}</p>
            </div>
            <div className="course-details-column">
              <p><strong>Course Title:</strong> {selectedCourse.course_title}</p>
              <p><strong>Lecture Hours:</strong> {selectedCourse.lecture_hours}</p>
            </div>
            <div className="course-details-column">
              <p><strong>Tutorial Hours:</strong> {selectedCourse.tutorial_hours}</p>
              <p><strong>Practical Hours:</strong> {selectedCourse.practical_hours}</p>
              <p><strong>Total Hours:</strong> {selectedCourse.total_hours}</p>
              <p><strong>Credits:</strong> {selectedCourse.credits}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList;
