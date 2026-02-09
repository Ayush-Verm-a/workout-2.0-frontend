import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workouts: [],
    exercises: [],
};

const workoutSlice = createSlice({
    name: "workout",
    initialState,
    reducers: {
        fetchWorkoutSuccess(state, action) {
            state.workouts = action.payload;
        },
        fetchWorkoutFailed(state, action) {
            state.workouts = [];
        },
        fetchDefinitionSuccess(state, action) {
            state.exercises = action.payload;
        },
        fetchDefinitionFailed(state) {
            state.exercises = [];
        },
    },
});

export default workoutSlice.reducer;
export const {
    fetchWorkoutSuccess,
    fetchWorkoutFailed,
    fetchDefinitionSuccess,
    fetchDefinitionFailed,
} = workoutSlice.actions;
