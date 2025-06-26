import axios from 'axios';

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust if your backend runs elsewhere
});

API.interceptors.request.use((req) => {
  const storedData = JSON.parse(localStorage.getItem('userData'));
  if (storedData && storedData.token) {
    req.headers.Authorization = `Bearer ${storedData.token}`;
  }
  return req;
});

export default API; 