import axios from "axios";
import { apiClient } from "../api/axiosConfig";
import {
    fetchDefinitionFailed,
    fetchDefinitionSuccess,
    fetchWorkoutFailed,
    fetchWorkoutSuccess,
} from "../store/slices/workoutSlice";

class WorkoutService {
    getAllWorkouts() {
        // return apiClient.get("/workouts");

        return async (dispatch) => {
            try {
                const response = await apiClient.get("/workouts");
                dispatch(fetchWorkoutSuccess(response.data));
            } catch (error) {
                dispatch(fetchWorkoutFailed());
            }
        };
    }

    saveWorkout(workout) {
        return apiClient.post("/workouts", workout);
    }

    deleteWorkout(id) {
        return apiClient.delete("/workouts/" + id);
    }

    getWorkoutById(workoutId) {
        return apiClient.get("/workouts/" + workoutId);
    }

    getDefinitions() {
        // return apiClient.get("/definitions");

        return async (dispatch) => {
            try {
                const response = await apiClient.get("/definitions");
                dispatch(fetchDefinitionSuccess(response.data));
            } catch (error) {
                dispatch(fetchDefinitionFailed());
            }
        };
    }

    saveDefinition(definition) {
        return apiClient.post("/definitions", definition);
    }
}

export default new WorkoutService();
