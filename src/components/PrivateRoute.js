// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ component: Component, requiredRole }) => {
  const { auth } = useAuth();
  console.log('Auth in PrivateRoute:', auth); // Debugging log

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && auth.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PrivateRoute;
