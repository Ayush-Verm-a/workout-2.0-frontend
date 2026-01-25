import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Flame, Trash2 } from "lucide-react";

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
                    (a, b) => new Date(b.date) - new Date(a.date),
                );
                setWorkouts(sorted);
                console.log(sorted);
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
                <h1>Workout History</h1>
            </div>

            <div className="listworkout__subcontainer">
                <div className="listworkout__row listworkout__head">
                    {workouts.length == 0 ? (
                        <div className="listworkout__noworkout">
                            No workouts logged yet. Start your journey today!
                        </div>
                    ) : (
                        workouts.map((workout) => (
                            <div
                                key={workout.id}
                                className="listworkout__workoutrow"
                            >
                                <div className="listworkout__workoutdata">
                                    <div className="listworkout__workoutdatahead">
                                        <span>
                                            {workout.title.substring(0, 3)}
                                        </span>
                                    </div>

                                    <div className="listworkout__workoutdatabody">
                                        <h3 className="">{workout.title}</h3>
                                        <div className="listworkout__workoutdatabodycontainer">
                                            <span>
                                                <Calendar />
                                                {new Date(
                                                    workout.date,
                                                ).toLocaleDateString()}
                                            </span>
                                            <span>
                                                <Clock />
                                                {workout.duration} min
                                            </span>
                                            <span>
                                                <Flame />
                                                {workout.caloriesBurned} cal
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    title="Delete Workout"
                                    className="listworkout__deletebtn"
                                ><Trash2 /></button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListWorkoutComponent;

{
    /* <div
    onClick={() => navigate(`/workouts/${workout.id}`)}
    className="listworkout__details"
>
    <small>❯</small>
</div>; */
}
