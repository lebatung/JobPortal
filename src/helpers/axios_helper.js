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

export const loadUsersNPD = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      "http://localhost:8080/api/users/listAllUsersNPD",
      { headers }
    );
    console.log("Data from loadUsersNPD:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadUsersNPD:", error);
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
    console.log("loadAllBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAllBlogs:", error);
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
    console.log("loadAllRecruitments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAllRecruitments:", error);
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

export const loadBlogsByUserIdNEnable = async (userId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listAllBlogsByUserIdNEnable/${userId}`,
      { headers }
    );
    console.log("loadBlogsByUserIdNEnable:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsByUserIdNEnable:", error);
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

export const loadPersonalDetailByUserId = async (userId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/personal-details/by-user/${userId}`,
      { headers }
    );
    console.log("loadPersonalDetailByUserId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadPersonalDetailByUserId:", error);
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

export const loadFavoriteBlogsDTOByPersonalDetailId = async (personalDetailId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/favorites/listFavoriteBlogsByPersonalDetailId/${personalDetailId}`,
      { headers }
    );
    console.log("loadFavoriteBlogsDTOByPersonalDetailId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadFavoriteBlogsDTOByPersonalDetailId:", error);
    throw error;
  }
};

export const loadAppliesByBlogId = async (blogId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/apply/listAppliesByBlog/${blogId}`,
      { headers }
    );
    console.log("loadAppliesByBlogId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAppliesByBlogId:", error);
    throw error;
  }
};

export const loadAppliedByUsernameApplied = async (username) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/apply/listAppliesByUsername/${username}`,
      { headers }
    );
    console.log("loadAppliedByUsernameApplied:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAppliedByUsernameApplied:", error);
    throw error;
  }
};

export const loadConversationByUserId = async (UserId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/conversations/byUserId/${UserId}`,
      { headers }
    );
    console.log("loadConversationByUserId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadConversationByUserId:", error);
    throw error;
  }
};

export const loadListMostBlogFrequency = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listmostBlogFrequency`,
      { headers }
    );
    console.log("loadListMostBlogFrequency:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadListMostBlogFrequency:", error);
    throw error;
  }
};

export const loadMostInteractedBlogsForUser = async (userId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/mostInteractedBlogsForUser/${userId}`,
      { headers }
    );
    console.log("loadMostInteractedBlogsForUser:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadMostInteractedBlogsForUser:", error);
    throw error;
  }
};

export const loadAllBlogsByCategoryId = async (categoryId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/getAllBlogsByCategoryId/${categoryId}`,
      { headers }
    );
    console.log("loadAllBlogsByCategoryId:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAllBlogsByCategoryId:", error);
    throw error;
  }
};

export const loadListCategoriesNBlogsRelated = async (categoryId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/categories/listCategoriesNBlogsRelated`,
      { headers }
    );
    console.log("loadListCategoriesNBlogsRelated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadListCategoriesNBlogsRelated:", error);
    throw error;
  }
};

export const loadNewestBlogs = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/getNewestBlogs`,
      { headers }
    );
    console.log("loadNewestBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadNewestBlogs:", error);
    throw error;
  }
};

export const loadBlogsByCategorySlug = async (categorySlug) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/byCategory/${categorySlug}`,
      { headers }
    );
    console.log("loadBlogsByCategorySlug:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsByCategorySlug:", error);
    throw error;
  }
};

export const loadHighSalaryBlogs = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listHighSalaryBlogs`,
      { headers }
    );
    console.log("loadHighSalaryBlogs:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadHighSalaryBlogs:", error);
    throw error;
  }
};

export const loadOutStandingRecruitments = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/users/recruitersWithMostBlogsLimit`,
      { headers }
    );
    console.log("loadOutStandingRecruitments:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadOutStandingRecruitments:", error);
    throw error;
  }
};

export const loadFavoritedBlogsList = async (personalDetailId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listFavoritedBlogs/${personalDetailId}`,
      { headers }
    );
    console.log("loadFavoritedBlogsList:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadFavoritedBlogsList:", error);
    throw error;
  }
};

export const loadUserByRoles = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/users/by-roles`,
      { headers }
    );
    console.log("loadUserByRoles:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadUserByRoles:", error);
    throw error;
  }
};

export const loadBlogsSortedByEnable = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listAllBlogsByEnable`,
      { headers }
    );
    console.log("loadBlogsSortedByEnable:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsSortedByEnable:", error);
    throw error;
  }
};

export const loadUsersByActive = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/users/by-active-status`,
      { headers }
    );
    console.log("loadUsersByActive:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadUsersByActive:", error);
    throw error;
  }
};

export const loadAllBlogss = async () => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listAllBlogss`,
      { headers }
    );
    console.log("loadAllBlogss:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadAllBlogss:", error);
    throw error;
  }
};

export const loadBlogsByUserIdandStatus = async (userId) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/blogs/listBlogsByUserIdandStatus/${userId}`,
      { headers }
    );
    console.log("loadBlogsByUserIdandStatus:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsByUserIdandStatus:", error);
    throw error;
  }
};

export const loadApplyListByUsernameStatus = async (username) => {
  try {
    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
      headers = { Authorization: `Bearer ${getAuthToken()}` };
    }
    const response = await axios.get(
      `http://localhost:8080/api/apply/by-status/${username}`,
      { headers }
    );
    console.log("loadBlogsByUserIdandStatus:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error loading loadBlogsByUserIdandStatus:", error);
    throw error;
  }
};



