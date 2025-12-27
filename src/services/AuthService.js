import axios from "axios";
import { apiClient } from "../api/axiosConfig";

class AuthService {
    login(credentials) {
        return apiClient.post("/auth/login", credentials);
    }

    register(user) {
        return axios.post("/auth/register", user);
    }

    logout() {
        localStorage.removeItem("token");
    }

    getCurrentUser() {
        return localStorage.getItem("token");
    }
}

export default new AuthService();
