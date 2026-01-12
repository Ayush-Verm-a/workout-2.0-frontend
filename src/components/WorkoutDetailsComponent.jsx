import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";

const WorkoutDetailsComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState(null);
    const [groupedExercises, setGroupedExercises] = useState({});
    const [stats, setStats] = useState({ sets: 0, volume: 0 });

    useEffect(() => {
        WorkoutService.getWorkoutById(id)
            .then((res) => {
                console.log(res.data);
                setWorkout(res.data);
                processData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const processData = (data) => {
        let totalSets = 0;
        let totalVolume = 0;

        const groups = {};

        if (data.sets) {
            data.sets.forEach((set) => {
                totalSets++;
                totalVolume += set.weight * set.reps;

                const exerciseName = set.definition.name;
                if (!groups[exerciseName]) {
                    groups[exerciseName] = [];
                }
                groups[exerciseName].push(set);
            });
        }

        setStats({ sets: totalSets, volume: totalVolume });
        setGroupedExercises(groups);
    };

    if (!workout) return <div>Loading...</div>;

    const dateObj = new Date(workout.date);
    const dateStr = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const timeStr = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="workoutdetails__container">
            <div>
                <div>
                    <button onClick={() => navigate("/workouts")}>
                        ← Back to History
                    </button>
                </div>
                <div className="workoutdetails__overviewrow">
                    <div>
                        <h1>{workout.title}</h1>
                        <p>
                            {dateStr} • {timeStr}
                        </p>
                    </div>
                    <div>
                        <div>Duration</div>
                        <div>{workout.duration}m</div>
                    </div>
                    <div>
                        <div>Total Sets</div>
                        <div>{stats.sets}</div>
                    </div>
                    <div>
                        <div>Volume</div>
                        <div>{stats.volume} kg</div>
                    </div>
                </div>
            </div>
            {Object.keys(groupedExercises).map((exerciseName, index) => (
                <div key={index} className="workoutdetails__setgroup">
                    <div>
                        <h2>{exerciseName}</h2>
                    </div>
                    <div>
                        {groupedExercises[exerciseName].map((set, i) => (
                            <div
                                key={set.id || i}
                                className="workoutdetails__setrow"
                            >
                                <span>{i + 1}.</span>
                                <span>{set.weight} kg</span>
                                <span>x</span>
                                <span>{set.reps}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkoutDetailsComponent;
