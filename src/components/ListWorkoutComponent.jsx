import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import { useNavigate } from "react-router-dom";

const ListWorkoutComponent = () => {
    const [workouts, setWorkouts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getWorkouts();
    }, []);

    const getWorkouts = () => {
        WorkoutService.getAllWorkouts()
            .then((res) => {
                const sorted = res.data.sort(
                    (a, b) => new Date(b.date) - new Date(a.date)
                );
                setWorkouts(sorted);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
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
        <div className="listworkout__container">
            <div>
                <h2>History</h2>
            </div>

            <div>
                {workouts.map((workout) => (
                    <div
                        key={workout.id}
                        onClick={() => navigate(`/workouts/${workout.id}`)}
                    >
                        <div>
                            <div>
                                <h5>{workout.title}</h5>
                                <small>
                                    {formatDate(workout.date)} •{" "}
                                    {new Date(workout.date).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" }
                                    )}
                                </small>
                            </div>
                            <div>
                                <span>{workout.duration}m</span>
                                <small>❯</small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {workouts.length === 0 && (
                <div>
                    <p>No workouts yet.</p>
                </div>
            )}
        </div>
    );
};

export default ListWorkoutComponent;
