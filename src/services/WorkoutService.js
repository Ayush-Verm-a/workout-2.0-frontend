import axios from "axios";
import { apiClient } from "../api/axiosConfig";

class WorkoutService {
    getAllWorkouts() {
        return apiClient.get("/workouts");
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
        return apiClient.get("/definitions");
    }

    saveDefinition(definition) {
        return apiClient.post("/definitions", definition);
    }
}

export default new WorkoutService();
