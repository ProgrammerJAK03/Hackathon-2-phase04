import axios from "axios";

// 1. Added quotes around the URL
const API_URL = "https://hackathon2phase3backend.vercel.app"; 

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);



api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 2. Handle 401 errors and ensure we aren't already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(
          `${API_URL}/api/v1/auth/refresh`,
          null,
          { params: { refresh_token: refreshToken } }
        );

        const { access_token, refresh_token: new_refresh_token } = response.data;

        localStorage.setItem("access_token", access_token);
        
        // 3. Only update refresh token if the backend actually sent a new one
        if (new_refresh_token) {
          localStorage.setItem("refresh_token", new_refresh_token);
        }

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 4. Clear storage and redirect on failure
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        
        // Use a more robust check if you're in a SPA like React/Next.js
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
