import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        authLoading(state) {
            state.status = "loading";
            state.error = null;
        },
        loginSuccess(state) {
            state.isAuthenticated = true;
            state.status = "ready";
            state.error = null;
        },
        loginFailed(state, action) {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "ready";
            state.error = action.payload || "Login failed";
        },
        registerSuccess(state) {
            state.isAuthenticated = false;
            state.status = "ready";
            state.error = null;
        },
        registerFailed(state, action) {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "ready";
            state.error = action.payload || "Registration failed";
        },
        fetchUserSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.status = "ready";
            state.error = null;
        },
        fetchUserFailed(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "ready";
        },
        clearAuthError(state) {
            state.error = null;
        },
        logoutSuccess(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "ready";
            state.error = null;
        },
        logoutFailed(state) {
        },
    },
});

export default userSlice.reducer;
export const {
    authLoading,
    fetchUserSuccess,
    fetchUserFailed,
    loginSuccess,
    loginFailed,
    logoutSuccess,
    logoutFailed,
    registerSuccess,
    registerFailed,
    clearAuthError,
} = userSlice.actions;
