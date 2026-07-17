import axios from "axios";
import { apiClient } from "../api/axiosConfig";
import {
  fetchUserSuccess,
  fetchUserFailed,
  loginSuccess,
  loginFailed,
  logoutFailed,
  logoutSuccess,
  registerSuccess,
  registerFailed,
} from "../store/slices/userSlice";

class AuthService {
  login(credentials) {
    // return apiClient.post("/auth/login", credentials);

    return async (dispatch) => {
      try {
        const response = await apiClient.post("/auth/login", credentials);
        
        const token = response.data.accessToken;
        localStorage.setItem("token", token);
        
        // Immediately fetch user info to populate state fully
        const userResponse = await apiClient.get("/users/me");
        dispatch(fetchUserSuccess(userResponse.data));
        
        // Still dispatch loginSuccess as a fallback or if other sagas/reducers listen to it
        dispatch(loginSuccess(response.data));
      } catch (error) {
        dispatch(loginFailed());
      }
    };
  }

  register(user) {
    // return apiClient.post("/auth/register", user);

    return async (dispatch) => {
      try {
        const response = await apiClient.post("/auth/register", user);
        dispatch(registerSuccess());
      } catch (error) {
        dispatch(registerFailed());
        console.log("Register Failed");
      }
    };
  }

  logout() {
    return async (dispatch) => {
      try {
        localStorage.removeItem("token");
        dispatch(logoutSuccess());
      } catch (error) {
        dispatch(logoutFailed());
      }
    };
  }

  getCurrentUser() {
    // return localStorage.getItem("token");

    return async (dispatch) => {
      try {
        const response = await apiClient.get("/users/me");
        dispatch(fetchUserSuccess(response.data));
      } catch (error) {
        dispatch(fetchUserFailed());
      }
    };
  }
}

export default new AuthService();
