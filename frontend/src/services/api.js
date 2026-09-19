import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_URL is not configured.");
}

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* =========================================================
   REQUEST INTERCEPTOR
   ========================================================= */

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

/* =========================================================
   RESPONSE INTERCEPTOR
   ========================================================= */

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't automatically remove the token.
      // Protected routes can handle authentication separately.
    }

    return Promise.reject(error);
  },
);

export default API;
