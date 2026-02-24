import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";
import "../styles/live-workout-style.scss";
import {
    Dumbbell,
    Flame,
    Pause,
    Play,
    Plus,
    Save,
    Square,
    Timer,
    Trash2,
    X,
} from "lucide-react";
import { useImmer } from "use-immer";
import { useDispatch, useSelector } from "react-redux";

const LiveWorkoutComponent = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const { exercises } = useSelector((store) => store.workout);
    const { isAuthenticated } = useSelector((store) => store.user);
    const [workoutTitle, setWorkoutTitle] = useState("New Workout");
    const [activeExercises, setActiveExercises] = useImmer([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [calories, setCalories] = useState([]);
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/home");
        }
        if (!exercises || exercises.length === 0) {
            dispatch(WorkoutService.getDefinitions());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    const formatTime = () => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const toggleTimer = () => {
        if (!isActive) {
            setIsActive(true);
            setIsPaused(false);
        } else {
            setIsPaused(!isPaused);
        }
    };

    const addSet = (exerciseIndex) => {
        setActiveExercises((draft) => {
            draft[exerciseIndex].sets.push({
                weight: 0,
                reps: 0,
                setNumber: draft[exerciseIndex].sets.length + 1,
            });
        });
    };

    const updateSet = (e, exerciseIndex, setIndex, field) => {
        setActiveExercises((draft) => {
            draft[exerciseIndex].sets[setIndex][field] = e.target.value;
        });
    };

    const deleteSet = (exerciseIndex, setIndex) => {
        setActiveExercises((draft) => {
            draft[exerciseIndex].sets.splice(setIndex, 1);
            draft[exerciseIndex].sets.forEach(
                (set, i) => (set.setNumber = i + 1),
            );
        });
    };

    const addExerciseToWorkout = (defId) => {
        const def = exercises.find((d) => d.id === defId);

        const exists = activeExercises.findIndex(
            (ex) => ex.definitionId === defId,
        );

        if (exists === -1) {
            setActiveExercises((draft) => {
                draft.push({ definitionId: def.id, name: def.name, sets: [] });
            });

            const newCalories = [...calories];
            newCalories.push(0);
            setCalories(newCalories);
        }

        setIsExerciseModalOpen(false);
    };

    const removeExercise = (exerciseIndex) => {
        setActiveExercises((draft) => {
            draft.splice(exerciseIndex, 1);
        });

        const num = calories[exerciseIndex];
        setTotalCalories((prevTotal) => prevTotal - num);
        const newCalories = [...calories];
        newCalories.splice(exerciseIndex, 1);
        setCalories(newCalories);
    };

    const finishWorkout = () => {
        setIsActive(false);
        setIsPaused(false);

        const allSets = [];

        activeExercises.forEach((ex) => {
            ex.sets.forEach((s) => {
                allSets.push({
                    weight: s.weight,
                    reps: s.reps,
                    setNumber: s.setNumber,
                    definition: { id: ex.definitionId },
                });
            });
        });

        const workoutPayload = {
            title: workoutTitle,
            duration: Math.floor(seconds / 60),
            caloriesBurned: totalCalories,
            sets: allSets,
        };

        WorkoutService.saveWorkout(workoutPayload)
            .then(() => {
                console.log("Workout Saved!");
                dispatch(WorkoutService.getAllWorkouts());
                navigate("/workouts");
            })
            .catch((err) => console.log(err));
    };

    const handleAddCalories = (e, exerciseIndex) => {
        const val = parseInt(e.target.value);

        if (!isNaN(val) && val >= 0) {
            setTotalCalories(
                (prevTotal) => prevTotal - calories[exerciseIndex] + val,
            );
            const newCalories = [...calories];
            newCalories[exerciseIndex] = val;
            setCalories(newCalories);
        }
    };

    const resetWorkout = () => {
        setSeconds(0);
        setIsActive(false);
        setIsPaused(false);
        setActiveExercises([]);
        setTotalCalories(0);
        setCalories([]);
        setWorkoutTitle("New Workout");
    };

    return (
        <div className="live-workout">
            <div className="live-workout__header">
                <div className="live-workout__header-left">
                    <div className="header-stat">
                        <p>Duration</p>
                        <div className="stat-value timer">
                            <Timer />
                            {formatTime()}
                        </div>
                    </div>
                    <div></div>
                    <div className="header-stat">
                        <p>Total Calories</p>
                        <div className="stat-value calories">
                            <Flame />
                            <span>{totalCalories}</span>
                        </div>
                    </div>
                </div>
                <div className="live-workout__header-right">
                    {!isActive ? (
                        <button onClick={toggleTimer} className="btn-play">
                            <Play /> Start
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={toggleTimer}
                                className={`btn-play-pause ${isPaused ? "paused" : "running"}`}
                            >
                                {isPaused ? (
                                    <>
                                        <Play /> Resume
                                    </>
                                ) : (
                                    <>
                                        <Pause /> Pause
                                    </>
                                )}
                            </button>
                            <button
                                onClick={finishWorkout}
                                className="btn-finish"
                            >
                                <Save /> Finish
                            </button>
                        </>
                    )}
                    {isActive && (
                        <button
                            onClick={resetWorkout}
                            title="Cancel Workout"
                            className="btn-cancel"
                        >
                            <Square />
                        </button>
                    )}
                </div>
            </div>

            <div className="live-workout__body">
                <div className="workout-title">
                    <label>Session Title</label>
                    <input
                        type="text"
                        value={workoutTitle}
                        onChange={(e) => setWorkoutTitle(e.target.value)}
                    />
                </div>

                {activeExercises.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state__icon">
                            <Dumbbell />
                        </div>
                        <h3 className="empty-state__title">Ready to sweat?</h3>
                        <p className="empty-state__subtitle">
                            Start your timer and add your first exercise.
                        </p>
                        <button
                            onClick={() => setIsExerciseModalOpen(true)}
                            className="btn-add-exercise"
                        >
                            <Plus /> Add Exercise
                        </button>
                    </div>
                )}

                <div className="active-exercises">
                    {activeExercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="exercise-item">
                            <div className="exercise-item__header">
                                <h3 className="exercise-item__title">
                                    <span>
                                        {exercise.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </span>
                                    {exercise.name}
                                </h3>

                                <div className="exercise-item__controls">
                                    <div className="calorie-input">
                                        <Flame />
                                        <input
                                            type="number"
                                            value={calories[exerciseIndex]}
                                            onChange={(e) =>
                                                handleAddCalories(
                                                    e,
                                                    exerciseIndex,
                                                )
                                            }
                                        />
                                        <span>cal</span>
                                    </div>
                                    <div className="divider"></div>
                                    <button
                                        className="btn-remove"
                                        onClick={() =>
                                            removeExercise(exerciseIndex)
                                        }
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="exercise-item__body">
                                <div className="sets-header">
                                    <div className="col-index">Set</div>
                                    <div className="col-weight">kg</div>
                                    <div className="col-reps">Reps</div>
                                    <div className="col-remove"></div>
                                </div>
                                <div className="sets-list">
                                    {exercise.sets.map((set, index) => (
                                        <div className="set-item" key={index}>
                                            <div className="set-item__index">
                                                <span>{index + 1}</span>
                                            </div>
                                            <div className="set-item__input">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={set.weight}
                                                    onChange={(e) =>
                                                        updateSet(
                                                            e,
                                                            exerciseIndex,
                                                            index,
                                                            "weight",
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="set-item__input">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={set.reps}
                                                    onChange={(e) =>
                                                        updateSet(
                                                            e,
                                                            exerciseIndex,
                                                            index,
                                                            "reps",
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="set-item__remove">
                                                <button
                                                    onClick={() =>
                                                        deleteSet(
                                                            exerciseIndex,
                                                            index,
                                                        )
                                                    }
                                                >
                                                    <X />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    className="btn-add-set"
                                    onClick={() => addSet(exerciseIndex)}
                                >
                                    <Plus /> Add Set
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {activeExercises.length > 0 && (
                    <div className="add-exercise-container">
                        <button
                            className="btn-add-exercise-dashed"
                            onClick={() => setIsExerciseModalOpen(true)}
                        >
                            <Plus /> Add Another Exercise
                        </button>
                    </div>
                )}
            </div>
            {isExerciseModalOpen && (
                <div className="exercise-modal">
                    <div className="exercise-modal__container">
                        <div className="exercise-modal__header">
                            <h3>Select Exercise</h3>
                            <button
                                onClick={() => setIsExerciseModalOpen(false)}
                            >
                                <X />
                            </button>
                        </div>
                        <div className="exercise-modal__body">
                            <div className="exercise-list">
                                {exercises.map((ex) => (
                                    <button
                                        key={ex.id}
                                        onClick={() =>
                                            addExerciseToWorkout(ex.id)
                                        }
                                    >
                                        {ex.name} <Plus />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="exercise-modal__footer">
                            <button
                                onClick={() => setIsExerciseModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveWorkoutComponent;
