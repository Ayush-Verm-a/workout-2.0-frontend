import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Flame, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ListWorkoutComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((store) => store.user);
    const { workouts } = useSelector((store) => store.workout);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/home");
        }
        if (!workouts || workouts.length === 0) {
            dispatch(WorkoutService.getAllWorkouts());
        }
    }, [dispatch, isAuthenticated]);

    const getWorkouts = () => {
        dispatch(WorkoutService.getAllWorkouts());
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
                                >
                                    <Trash2 />
                                </button>
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
