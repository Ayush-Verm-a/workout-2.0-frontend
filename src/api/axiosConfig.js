import axios from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
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
    }
);
