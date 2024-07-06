// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import ProtectedComponent from './components/ProtectedComponent';
import StudentDashboard from './components/StudentDashboard'; // Assume you have a StudentPage component
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute component={AdminDashboard} requiredRole="admin" />} />
          <Route path="/protected" element={<PrivateRoute component={ProtectedComponent} />} />
          <Route path="/" element={<PrivateRoute component={StudentDashboard} requiredRole="student" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
