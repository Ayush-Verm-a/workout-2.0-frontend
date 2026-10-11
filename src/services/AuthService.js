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
  authLoading,
} from "../store/slices/userSlice";
import { getErrorMessage } from "../utils/errorMessage";

class AuthService {
  bootstrap() {
    return async (dispatch) => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(fetchUserFailed());
        return;
      }
      dispatch(authLoading());
      try {
        const response = await apiClient.get("/users/me");
        dispatch(fetchUserSuccess(response.data));
      } catch {
        localStorage.removeItem("token");
        dispatch(fetchUserFailed());
      }
    };
  }

  login(credentials) {
    return async (dispatch) => {
      dispatch(authLoading());
      try {
        const response = await apiClient.post("/auth/login", credentials);
        const token = response.data.accessToken || response.data.token;
        localStorage.setItem("token", token);

        const userResponse = await apiClient.get("/users/me");
        dispatch(fetchUserSuccess(userResponse.data));
        dispatch(loginSuccess());
      } catch (error) {
        dispatch(loginFailed(getErrorMessage(error, "Invalid email or password")));
        throw error;
      }
    };
  }

  register(user) {
    return async (dispatch) => {
      dispatch(authLoading());
      try {
        await apiClient.post("/auth/register", user);
        dispatch(registerSuccess());
      } catch (error) {
        dispatch(registerFailed(getErrorMessage(error, "Registration failed")));
        throw error;
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
    return this.bootstrap();
  }
}

export default new AuthService();
