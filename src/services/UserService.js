import { apiClient } from "../api/axiosConfig";

class UserService {
    getProfile() {
        return apiClient.get("/users/me");
    }
}

export default new UserService();
