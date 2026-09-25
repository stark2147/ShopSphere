import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

// Add JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle expired/invalid login sessions
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.log("Session expired or authentication required.");

            // Remove old authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Send user to login page
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;