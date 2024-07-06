// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/login', { username, password });
      console.log('Login response:', response.data);

      // Ensure the response includes username and user_id
      if (response.data.username && response.data.user_id) {
        login(response.data.token, response.data.role, response.data.username, response.data.user_id);

        // Redirect based on user role
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Login failed. Please try again.');
        console.error('Login response missing username or user_id:', response.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('An error occurred. Please try again later.');
      }
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
