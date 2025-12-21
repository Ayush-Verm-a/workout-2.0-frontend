import axios from "axios";

const USER_API_BASE_URL = "http://localhost:8080/api/users";

axios.interceptors.request.use(
    (config) => {
        if (config.url.includes("/api/auth")) {
            return config;
        }
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

class UserService {
    getUsers() {
        return axios.get(USER_API_BASE_URL);
    }

    createUser(user) {
        return axios.post(USER_API_BASE_URL, user);
    }

    getUserById(userId) {
        return axios.get(USER_API_BASE_URL + "/" + userId);
    }

    updateUser(user, userId) {
        return axios.put(USER_API_BASE_URL + "/" + userId, user);
    }

    deleteUser(userId) {
        return axios.delete(USER_API_BASE_URL + "/" + userId);
    }
}

export default new UserService();
