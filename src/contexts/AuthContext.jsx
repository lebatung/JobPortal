import React, { useState, createContext, useContext, useReducer, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, userRoles: action.roles, username: action.username, userRole: action.role };
    case 'LOGOUT':
      return { isAuthenticated: false, userRoles: [], username: '' };
    default:
      return state;
  }
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    userRoles: [],
    username: '',
    userRole: '',
  });

  const login = (roles, username, role) => {
    dispatch({ type: 'LOGIN', roles, username, role });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
      

        const decodedToken = jwt_decode(token);
        const roles = decodedToken.roles || []; 
        const username = decodedToken.username || [];

        let role = '';
        if(roles.includes('ROLE_ADMIN')){
          role = 'ROLE_ADMIN';
        } else if(roles.includes('ROLE_RECRUITMENT')){
          role = 'ROLE_RECRUITMENT';
        }else {
          role = 'ROLE_CANDIDATE';
        }

        dispatch({ type: 'LOGIN', roles, username, role }); 
        
        //check when the token expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
       
          logout();
          localStorage.removeItem('auth_token');
        }
      }
    }, []);

    
    const getActualUserRole = () => {
      const { userRoles } = authState;
  
      if (userRoles.includes('ROLE_ADMIN')) {
        return 'ROLE_ADMIN';
      } else if (userRoles.includes('ROLE_RECRUITMENT')) {
        return 'ROLE_RECRUITMENT';
      } else if (userRoles.includes('ROLE_CANDIDATE')) {
        return 'ROLE_CANDIDATE';
      }
  
      return null; 
    };
    
  const value = {
    isAuthenticated: authState.isAuthenticated,
    userRoles: authState.userRoles,
    username: authState.username,
    userRole: authState.userRole,
    login,
    logout,
    getActualUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}