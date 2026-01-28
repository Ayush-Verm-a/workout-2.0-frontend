import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        if (config.url.includes("/api/auth")) {
            return config;
        }
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);
