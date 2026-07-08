import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import WorkoutService from "../services/WorkoutService";
import { X, Activity } from "lucide-react";
import "../styles/workout-modal-style.scss";

const WorkoutModalComponent = ({ workoutId, onClose }) => {
    const [workout, setWorkout] = useState(null);
    const [groupedExercises, setGroupedExercises] = useState({});
    const [stats, setStats] = useState({ sets: 0, volume: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        WorkoutService.getWorkoutById(workoutId)
            .then((res) => {
                setWorkout(res.data);
                processData(res.data);
                console.log(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [workoutId]);

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

    if (loading || !workout) {
        return createPortal(
            <div className="workoutmodal__overlay">
                <div className="workoutmodal__container" style={{ minHeight: "300px" }}>
                    <div className="workoutmodal__loading">
                        <Activity className="animate-spin" size={48} />
                        <p>Loading details...</p>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

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

    const modalContent = (
        <div className="workoutmodal__overlay" onClick={onClose}>
            <div className="workoutmodal__container" onClick={(e) => e.stopPropagation()}>
                <div className="workoutmodal__header">
                    <div>
                        <h2>{workout.title}</h2>
                        <p>{dateStr} • {timeStr}</p>
                    </div>
                    <button className="workoutmodal__closebtn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="workoutmodal__content">
                    <div className="workoutmodal__stats">
                        <div className="stat-card">
                            <div className="label">Duration</div>
                            <div className="value">{workout.duration}m</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Total Sets</div>
                            <div className="value">{stats.sets}</div>
                        </div>
                        <div className="stat-card">
                            <div className="label">Volume</div>
                            <div className="value">{stats.volume} kg</div>
                        </div>
                    </div>

                    <div className="workoutmodal__exercises">
                        {Object.keys(groupedExercises).map((exerciseName, index) => (
                            <div key={index} className="workoutmodal__exercisegroup">
                                <h3>{exerciseName}</h3>
                                <div className="workoutmodal__setlist">
                                    {groupedExercises[exerciseName].map((set, i) => (
                                        <div key={set.id || i} className="workoutmodal__setrow">
                                            <span className="set-num">{i + 1}.</span>
                                            <span className="set-data">
                                                <span>{set.weight} kg</span>
                                                <span>x</span>
                                                <span>{set.reps}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default WorkoutModalComponent;
