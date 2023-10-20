import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ element, roles }) {
  const { isAuthenticated, userRoles } = useAuth();

  if (isAuthenticated && roles.some(role => userRoles.includes(role))) {
    return element;
  } else {
    
    return <Navigate to="/forbiddenPage" />;
  }
}

export default ProtectedRoute;
