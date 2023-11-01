import axios from "axios";
import { useParams } from "react-router-dom";

export const getAuthToken = () => {
  return window.localStorage.getItem("auth_token");
};

export const setAuthHeader = (token) => {
  window.localStorage.setItem("auth_token", token);
};

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const request = (method, url, data) => {
  let headers = {};
  if (getAuthToken() !== null && getAuthToken() !== "null") {
    headers = { Authorization: `Bearer ${getAuthToken()}` };
  }
  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data,
  });
};

export const loadUsers = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      "http://localhost:8080/api/users/listAllUsers",
      { headers }
    );
    console.log("Data from loadUsers:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading users:", error);
    throw error;
  }
};

export const loadCategories = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      "http://localhost:8080/api/categories/listAllCategories",
      { headers }
    );
    console.log("Categories from response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading categories:", error);
    throw error;
  }
};

export const loadLocations = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      "http://localhost:8080/api/locations/listAllLocations",
      { headers }
    );
    //console.log("Data from response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading locations:", error);
    throw error;
  }
};

export const loadBlogs = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/findByUsername/listAllBlogs`,
      { headers }
    );
    console.log("loadBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogs:", error);
    throw error;
  }
};

export const loadAllBlogs = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listAllBlogs`,
      { headers }
    );
    console.log("loadBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogs:", error);
    throw error;
  }
};

export const loadAllRecruitments = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/users/getRecruitment`,
      { headers }
    );
    console.log("loadBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogs:", error);
    throw error;
  }
};


export const loadPersonalDetail = async (id) => {
  
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/personal-details/findByUserId/${id}`,
      { headers }
    );
    console.log("Data from loadPersonalDetail:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading personal-details:", error);
    throw error;
  }
};

export const loadPersonalDetailById = async (id) => {
  
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/personal-details/${id}`,
      { headers }
    );
    console.log("Data from response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading personal-details:", error);
    throw error;
  }
};

export const loadCategory = async (id) => {
  
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/categories/${id}`,
      { headers }
    );
    console.log("Data from response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading category:", error);
    throw error;
  }
};

export const loadPersonalDetailByUsername = async (username) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/personal-details/findByUsername/${username}`,
      { headers }
    );
    console.log("loadPersonalDetailByUsername:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading personalDetail:", error);
    throw error;
  }
};

export const loadUserByUsername = async (username) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/users/findByUsername/${username}`,
      { headers }
    );
    console.log("loadUserByUsername:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadUserByUsername:", error);
    throw error;
  }
};

export const updateUserDetail = async (id) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.put(
      `http://localhost:8080/api/personal-details/update/${id}`,
      { headers }
    );
    console.log("Data from response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading personalDetail:", error);
    throw error;
  }
};

export const changePassword = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      "http://localhost:8080/changePassword",
      { headers }
    );
    console.log("Password:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const loadBlogsByUserId = async (userId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listAllBlogsByUserId/${userId}`,
      { headers }
    );
    console.log("loadBlogsByUserId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsByUserId:", error);
    throw error;
  }
};

export const loadBlogById = async (id) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/${id}`,
      { headers }
    );
    console.log("loadBlogsById:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsById:", error);
    throw error;
  }
};

export const loadPendingBlogs = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/getPendingBlogs`,
      { headers }
    );
    console.log("loadPendingBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadPendingBlogs:", error);
    throw error;
  }
};

export const loadCompanyNBlogs = async (slug) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/personal-details/getCompanyDetailIncludeBlogs/${slug}`,
      { headers }
    );
    console.log("loadCompanyNBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadCompanyNBlogs:", error);
    throw error;
  }
};

export const loadRelatedBlogs = async (categoryId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/getRelatedBlogs/${categoryId}`,
      { headers }
    );
    console.log("loadRelatedBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadRelatedBlogs:", error);
    throw error;
  }
};

export const loadFavoriteBlogsByPersonalDetailId = async (personalDetailId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/favorites/listAllFavoritesByPersonalDetailId/${personalDetailId}`,
      { headers }
    );
    console.log("loadFavoriteBlogsByPersonalDetailId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadFavoriteBlogsByPersonalDetailId:", error);
    throw error;
  }
};



