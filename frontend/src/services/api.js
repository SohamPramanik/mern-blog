import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't automatically remove the token
      // on every 401 yet. We can handle this
      // more carefully once the protected routes are complete.
    }

    return Promise.reject(error);
  },
);

export default API;
