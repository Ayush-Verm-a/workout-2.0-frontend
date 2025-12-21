import axios from "axios";

const AUTH_API_BASE_URL = "http://localhost:8080/api/auth";

class AuthService {

    login(credentials) {
        return axios.post(AUTH_API_BASE_URL+"/login", credentials);
    }

    register(user) {
        return axios.post(AUTH_API_BASE_URL+"/register", user);
    }
}

export default new AuthService();