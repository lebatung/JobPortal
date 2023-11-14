import React, {
  useState,
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";

const fetchUserIdByUsername = async (username) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/users/findByUsername/${username}`);
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status === 200) {
      // Kiểm tra xem response.data có chứa id không
      if (response.data && response.data.id) {
        console.log("User id found:", response.data.id);
        return response.data.id;
      } else {
        console.error("User id not found in response data.");
        return null;
      }
    } else {
      console.error("Failed to fetch user id. Status:", response.status);
      return null;
    }
  } catch (error) {
    // Xử lý lỗi nếu cần
    console.error("Error fetching user id:", error);
    return null;
  }
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const newState = {
        isAuthenticated: true,
        userRoles: action.roles,
        username: action.username,
        userRole: action.role,
        userId: action.userId,
      };
      console.log("New state after LOGIN:", newState);
      
      return newState;
    case "LOGOUT":
      return { isAuthenticated: false, userRoles: [], username: "", userId: null };
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
    username: "",
    userRole: "",
    userId: "",
  });

  const login = async (roles, username, role, userId) => {
    try {
      const userId = await fetchUserIdByUsername(username);
      dispatch({ type: "LOGIN", roles, username, role, userId });
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error during login:", error);
    }
  };

  
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  useEffect(() => {
    const getTokenAndFetchUser = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          const decodedToken = jwt_decode(token);
          const roles = decodedToken.roles || [];
          const username = decodedToken.username || [];

          let role = "";
          if (roles.includes("ROLE_ADMIN")) {
            role = "ROLE_ADMIN";
          } else if (roles.includes("ROLE_RECRUITMENT")) {
            role = "ROLE_RECRUITMENT";
          } else {
            role = "ROLE_CANDIDATE";
          }

          const userId = await fetchUserIdByUsername(username);
          console.log("Fetched userId:", userId);

          dispatch({ type: "LOGIN", roles, username, role, userId });

          // Check when the token expired
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            logout();
            localStorage.removeItem("auth_token");
          }
        }
      } catch (error) {
        // Handle errors here
        console.error("Error during login:", error);
      }
    };

    getTokenAndFetchUser();
  }, []);

  const getActualUserRole = () => {
    const { userRoles } = authState;

    if (userRoles.includes("ROLE_ADMIN")) {
      return "ROLE_ADMIN";
    } else if (userRoles.includes("ROLE_RECRUITMENT")) {
      return "ROLE_RECRUITMENT";
    } else if (userRoles.includes("ROLE_CANDIDATE")) {
      return "ROLE_CANDIDATE";
    }

    return null;
  };

  const value = {
    isAuthenticated: authState.isAuthenticated,
    userRoles: authState.userRoles,
    username: authState.username,
    userRole: authState.userRole,
    userId: authState.userId,
    login,
    logout,
    getActualUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
