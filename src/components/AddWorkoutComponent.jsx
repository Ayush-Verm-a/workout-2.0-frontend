import { useState } from "react";
import WorkoutService from "../services/WorkoutService";
import { Link, useNavigate } from "react-router-dom";

const AddWorkoutComponent = () => {
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const navigate = useNavigate();

    const saveWorkout = (e) => {
        e.preventDefault();

        const workout = { title, duration, caloriesBurned };

        WorkoutService.saveWorkout(workout)
            .then((res) => {
                console.log(res.data);
                navigate("/workouts");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="addWorkout__container">
            <div className="row">
                <h3>Log a Workout</h3>
                <div>
                    <form>
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Duration (minutes)</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>CaloriesBurned</label>
                            <input
                                type="number"
                                value={caloriesBurned}
                                onChange={(e) =>
                                    setCaloriesBurned(e.target.value)
                                }
                            />
                        </div>
                        <button onClick={(e) => saveWorkout(e)}>Save</button>
                        <Link to="/workouts">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddWorkoutComponent;
