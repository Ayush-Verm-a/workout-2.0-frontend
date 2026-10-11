import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workouts: [],
    exercises: [],
    workoutsStatus: "idle",
    workoutsError: null,
    exercisesStatus: "idle",
};

const workoutSlice = createSlice({
    name: "workout",
    initialState,
    reducers: {
        fetchWorkoutStart(state) {
            state.workoutsStatus = "loading";
            state.workoutsError = null;
        },
        fetchWorkoutSuccess(state, action) {
            state.workouts = action.payload;
            state.workoutsStatus = "succeeded";
            state.workoutsError = null;
        },
        fetchWorkoutFailed(state, action) {
            state.workouts = [];
            state.workoutsStatus = "failed";
            state.workoutsError = action.payload || "Failed to load workouts";
        },
        fetchDefinitionSuccess(state, action) {
            state.exercises = action.payload;
            state.exercisesStatus = "succeeded";
        },
        fetchDefinitionFailed(state) {
            state.exercises = [];
            state.exercisesStatus = "failed";
        },
    },
});

export default workoutSlice.reducer;
export const {
    fetchWorkoutStart,
    fetchWorkoutSuccess,
    fetchWorkoutFailed,
    fetchDefinitionSuccess,
    fetchDefinitionFailed,
} = workoutSlice.actions;
