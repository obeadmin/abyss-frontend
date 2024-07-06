// ProtectedComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function ProtectedComponent() {
  const { auth } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching protected data with token:', auth.token); // Debugging log
        const response = await axios.get('http://localhost:3001/api/protected', {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        console.log('Protected data response:', response.data); // Debugging log
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching protected data:', error);
        setMessage('Failed to fetch protected data');
      }
    };

    fetchData();
  }, [auth.token]);

  return (
    <div>
      <h1>Protected Component</h1>
      <p>{message}</p>
    </div>
  );
}

export default ProtectedComponent;
