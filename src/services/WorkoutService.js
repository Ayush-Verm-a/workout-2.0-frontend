import { apiClient } from "../api/axiosConfig";
import {
    fetchDefinitionFailed,
    fetchDefinitionSuccess,
    fetchWorkoutFailed,
    fetchWorkoutStart,
    fetchWorkoutSuccess,
} from "../store/slices/workoutSlice";
import { getErrorMessage } from "../utils/errorMessage";

class WorkoutService {
    getAllWorkouts() {
        return async (dispatch) => {
            dispatch(fetchWorkoutStart());
            try {
                const response = await apiClient.get("/workouts");
                dispatch(fetchWorkoutSuccess(response.data));
            } catch (error) {
                dispatch(fetchWorkoutFailed(getErrorMessage(error, "Failed to load workouts")));
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

    getWorkoutPlan() {
        return apiClient.get("/workout-plans");
    }

    createWorkoutPlan(payload) {
        return apiClient.post("/workout-plans", payload);
    }

    updateWorkoutPlan(payload) {
        return apiClient.put("/workout-plans", payload);
    }
}

export default new WorkoutService();
