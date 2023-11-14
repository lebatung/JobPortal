import React, { useEffect } from 'react'

import { useAuth } from '../../../contexts/AuthContext';
export default function MyJobsCpn() {

  const { isAuthenticated, userRoles, username, userRole, userId,  getActualUserRole } = useAuth();
  console.log("Current userId:", userId);
  useEffect(() => {
    
    
  }, []);
  

  return (
    <div>
      <p>isAuthenticated: {isAuthenticated.toString()}</p>
      <p>userRoles: {JSON.stringify(userRoles)}</p>
      <p>username: {username}</p>
      <p>userRole: {userRole}</p>
      <p>userId: {userId}</p>
    </div>
  )
}
