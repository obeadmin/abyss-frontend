import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CourseRegistration.css';
import ErrorBar from './ErrorBar';

function CourseRegistration({ username, userId }) {
  const [courses, setCourses] = useState([]);
  const [semester, setSemester] = useState('');
  const [courseTypes, setCourseTypes] = useState([]);
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/studentdetails`, { params: { username, user_id: userId } });
        const { semester_name, registered } = response.data;
        setSemester(semester_name);
        setIsRegistered(registered === 'yes');

        if (registered !== 'yes') {
          const courseTypesResponse = await axios.get('http://localhost:3001/course_types');
          setCourseTypes(courseTypesResponse.data);
        }
      } catch (err) {
        setError('An error occurred while fetching student details.');
        console.error('Fetch student details error:', err);
      }
    };

    fetchStudentDetails();
  }, [username, userId]);

  const fetchCoursesByType = async (courseType) => {
    try {
      const coursesResponse = await axios.get(`http://localhost:3001/courses_by_type`, { params: { course_type: courseType } });
      setCourses(coursesResponse.data);
    } catch (err) {
      setError('An error occurred while fetching courses.');
      console.error('Fetch courses error:', err);
    }
  };

  const handleCourseTypeChange = (e) => {
    const selectedType = e.target.value;
    setSelectedCourseType(selectedType);
    fetchCoursesByType(selectedType);
  };

  const handleAddCourse = (course) => {
    const courseType = courseTypes.find(ct => ct.course_type === course.course_type);

    if (courseType && courseType.max_reg !== 0) {
      const selectedCount = selectedCourses.filter(sc => sc.course_type === course.course_type).length;

      if (selectedCount >= courseType.max_reg) {
        setError(`You can only select a maximum of ${courseType.max_reg} courses for ${course.course_type}.`);
        return;
      }
    }

    if (!selectedCourses.some(sc => sc.course_code === course.course_code)) {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const handleRemoveCourse = (course_code) => {
    if (!submissionSuccess) {
      setSelectedCourses(selectedCourses.filter(course => course.course_code !== course_code));
    }
  };

  const handleSubmit = async () => {
    try {
      const validations = courseTypes.map(courseType => {
        const selectedCount = selectedCourses.filter(course => course.course_type === courseType.course_type).length;

        if (courseType.max_reg === 0) {
          const availableCourses = courses.filter(course => course.course_type === courseType.course_type).length;
          if (selectedCount !== availableCourses) {
            return `You must select all available courses for ${courseType.course_type}.`;
          }
        } else if (selectedCount > courseType.max_reg) {
          return `You can only select a maximum of ${courseType.max_reg} courses for ${courseType.course_type}.`;
        }
        return null;
      }).filter(message => message !== null);

      if (validations.length > 0) {
        setError(validations.join(' '));
        return;
      }

      await axios.post(`http://localhost:3001/update_student_registered`, { user_id: userId, registered: 'yes' });

      for (const courseType of courseTypes) {
        const selectedForType = selectedCourses.filter(course => course.course_type === courseType.course_type);

        if (courseType.max_reg > 0) {
          for (let i = 0; i < selectedForType.length; i++) {
            const columnName = `${courseType.course_type}${courseType.max_reg > 1 ? `(${i + 1})` : ''}`;
            const courseCode = selectedForType[i].course_code;
            await axios.post(`http://localhost:3001/update_student_course`, { user_id: userId, column: columnName, value: courseCode });
          }
        }
      }

      setSubmissionSuccess(true);
      setError('Courses successfully registered.');
    } catch (err) {
      setError('An error occurred while submitting your courses.');
      console.error('Submit courses error:', err);
    }
  };

  if (isRegistered === null) {
    return <p>Loading...</p>;
  }

  if (isRegistered) {
    return (
      <div className="registration-message">
        
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;        <span className="green-tick">&#10003;</span><p>&nbsp;  You have already registered the courses for semester {semester}</p>
      </div>
    );
  }

  return (
    <div className="course-registration-container">
      <h2>Course Registration for Semester: {semester}</h2>
      <div className="dropdown-container">
        <label htmlFor="course-type-dropdown">Select Course Type: </label>
        <select id="course-type-dropdown" value={selectedCourseType} onChange={handleCourseTypeChange}>
          <option value="">Select a course type</option>
          {courseTypes.map(type => (
            <option key={type.course_type} value={type.course_type}>
              {type.course_type}
            </option>
          ))}
        </select>
      </div>
      <table className="course-table">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.course_code}>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
              <td>
                <button className="addButton" onClick={() => handleAddCourse(course)}>
                  <img src="https://img.icons8.com/external-creatype-glyph-colourcreatype/64/FFFFFF/external-add-essential-ui-v4-creatype-glyph-colourcreatype.png" alt="add" style={{ width: '20px', marginRight: '5px' }} />
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCourses.length > 0 && (
        <div className={`selected-courses-pane visible`}>
          <div className="selected-courses">
            {selectedCourses.map(course => (
              <div key={course.course_code} className={`selected-course ${submissionSuccess ? 'success' : ''}`}>
                <span>{course.course_code} - {course.course_title}</span>
                {!submissionSuccess && (
                  <button onClick={() => handleRemoveCourse(course.course_code)}>
                    <span>&times;</span>
                  </button>
                )}
                {submissionSuccess && (
                  <span className="tick">&#10003;</span>
                )}
              </div>
            ))}
          </div>
          {!submissionSuccess && <button className="submit-button" onClick={handleSubmit}>Submit</button>}
        </div>
      )}
      <ErrorBar message={error} clearError={() => setError('')} />
    </div>
  );
}

export default CourseRegistration;
