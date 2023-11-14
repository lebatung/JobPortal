import axios from 'axios';
import { SET_USER_ID } from './actionTypes';

export const setUserId = (userId) => ({
  type: SET_USER_ID,
  payload: userId,
});

export const fetchUserId = (username) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/findByUsername/${username}`);
      const userId = response.data.id; // Giả sử userId được trả về từ server
      dispatch(setUserId(userId));
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error('Error fetching userId:', error);
    }
  };
};