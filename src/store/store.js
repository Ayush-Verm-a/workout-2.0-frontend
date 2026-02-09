import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import workoutReducer from "./slices/workoutSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        workout: workoutReducer,
    },
});
