import { useState } from "react";
import WorkoutService from "../services/WorkoutService";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/errorMessage";
import "../styles/login-style.scss";

const AddWorkoutComponent = () => {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const saveWorkout = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        setSaving(true);
        setError("");

        const workout = {
            title: title.trim(),
            duration: parseInt(duration, 10) || 0,
            caloriesBurned: parseInt(caloriesBurned, 10) || 0,
        };

        WorkoutService.saveWorkout(workout)
            .then(() => {
                navigate("/workouts");
            })
            .catch((err) => {
                setError(getErrorMessage(err, "Could not save workout"));
            })
            .finally(() => setSaving(false));
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h3 className="auth-card__title">Log a Workout</h3>
                <form className="auth-card__form" onSubmit={saveWorkout}>
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (minutes)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Calories burned</label>
                        <input
                            type="number"
                            value={caloriesBurned}
                            onChange={(e) => setCaloriesBurned(e.target.value)}
                        />
                    </div>
                    <button className="btn-auth" type="submit" disabled={saving}>
                        {saving ? "Saving…" : "Save"}
                    </button>
                    <Link to="/workouts">Cancel</Link>
                </form>
            </div>
        </div>
    );
};

export default AddWorkoutComponent;
