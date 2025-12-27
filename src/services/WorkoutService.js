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

    getDefinitions() {
        return apiClient.get("/definitions");
    }
}

export default new WorkoutService();
