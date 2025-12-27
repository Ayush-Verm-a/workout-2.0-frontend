import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";

const ListWorkoutComponent = () => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        getWorkouts();
    }, []);

    const getWorkouts = () => {
        WorkoutService.getAllWorkouts()
            .then((res) => {
                setWorkouts(res.data);
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteWorkout = (id) => {
        WorkoutService.deleteWorkout(id)
            .then((res) => {
                getWorkouts();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="workout__container">
            <h2>My Workout History</h2>

            <div className="row">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Duration</th>
                            <th>Calories</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workouts.map((workout) => (
                            <tr key={workout.id}>
                                <td>
                                    {new Date(
                                        workout.date
                                    ).toLocaleDateString()}
                                </td>
                                <td>{workout.title}</td>
                                <td>{workout.duration}</td>
                                <td>{workout.caloriesBurned}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            deleteWorkout(workout.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {workouts.length === 0 && (
                    <div>No workouts found. Start training!</div>
                )}
            </div>
        </div>
    );
};

export default ListWorkoutComponent;