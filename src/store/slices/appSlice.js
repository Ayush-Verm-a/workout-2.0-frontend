import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentView: "",
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setCurrentView(state, action) {
            state.currentView = action.payload;
        },
    },
});

export default appSlice.reducer;
export const { setCurrentView } = appSlice.actions;
