import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isAuthenticated = true;
        },
        loginFailed(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        registerSuccess(state, action) {
            state.isAuthenticated = false;
        },
        registerFailed(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        fetchUserSuccess(state, action) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        fetchUserFailed(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutSuccess(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFailed(state) {
            state.isAuthenticated = state.isAuthenticated;
            state.user = state.user;
        },
    },
});

export default userSlice.reducer;
export const {
    fetchUserSuccess,
    fetchUserFailed,
    loginSuccess,
    loginFailed,
    logoutSuccess,
    logoutFailed,
    registerSuccess,
    registerFailed,
} = userSlice.actions;
