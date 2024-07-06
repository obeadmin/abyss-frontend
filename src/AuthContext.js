// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null, username: null, user_id: null });

  const login = (token, role, username, user_id) => {
    console.log('Setting auth token, role, username, and user_id:', token, role, username, user_id); // Debugging log
    setAuth({ token, role, username, user_id });
  };

  const value = { auth, login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
