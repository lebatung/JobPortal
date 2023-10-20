import jwt_decode from 'jwt-decode';

const SECRET_KEY = 'secret-key';

export const getToken = () => {
  return localStorage.getItem('auth_token');
};

export const decodeToken = () => {
  const token = getToken();
  if (token) {
    return jwt_decode(token);
  }
  return null;
};

export const getUsername = () => {
  const decoded = decodeToken();
  return decoded ? decoded.username : '';
};

export const getRoles = () => {
  const decoded = decodeToken();
  return decoded ? decoded.roles : '';
};
