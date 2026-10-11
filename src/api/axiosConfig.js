import axios from "axios";
import { logoutSuccess } from "../store/slices/userSlice";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const url = config.url || "";
        if (url.includes("/auth/login") || url.includes("/auth/register")) {
            return config;
        }
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || "";
            if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
                localStorage.removeItem("token");
                import("../store/store").then(({ store }) => {
                    store.dispatch(logoutSuccess());
                });
            }
        }
        return Promise.reject(error);
    },
);
