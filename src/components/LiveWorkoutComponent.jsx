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

const LiveWorkoutComponent = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [definitions, setDefinitions] = useState([]);
    const [workoutTitle, setWorkoutTitle] = useState("My Workout");
    const [activeExercises, setActiveExercises] = useImmer([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [calorieInput, setCalorieInput] = useState("");
    const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        WorkoutService.getDefinitions().then((res) => {
            setDefinitions(res.data);
        });
    }, []);

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
        const def = definitions.find((d) => d.id === defId);

        const exists = activeExercises.findIndex(
            (ex) => ex.definitionId === defId,
        );

        if (exists === -1) {
            setActiveExercises((draft) => {
                draft.push({ definitionId: def.id, name: def.name, sets: [] });
            });
        }

        setIsExerciseModalOpen(false);
    };

    const removeExercise = (exerciseIndex) => {
        setActiveExercises((draft) => {
            draft.splice(exerciseIndex, 1);
        });
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
                navigate("/workouts");
            })
            .catch((err) => console.log(err));
    };

    const handleAddCalories = (e) => {
        const val = parseInt(e.target.value);

        if (!isNaN(val) && val > 0) {
            setTotalCalories((prevTotal) => prevTotal + val);
        }
    };

    const resetWorkout = () => {
        setSeconds(0);
        setIsActive(false);
        setIsPaused(false);
        setActiveExercises([]);
        setTotalCalories(0);
        setWorkoutTitle("My Workout");
    };

    return (
        <div className="liveworkout__container">
            <div className="liveworkout__header">
                <div className="headerleft">
                    <div className="headerlefttitle">
                        <p>Duration</p>
                        <div className="timer">
                            <Timer />
                            {formatTime()}
                        </div>
                    </div>
                    <div></div>
                    <div className="headerlefttitle">
                        <p>Total Calories</p>
                        <div className="calories">
                            <Flame />
                            <span>{totalCalories}</span>
                        </div>
                    </div>
                </div>
                <div className="headerright">
                    {!isActive ? (
                        <button onClick={toggleTimer} className="playbtn1">
                            <Play /> Start
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={toggleTimer}
                                className={`playpausebtn ${isPaused ? "ispaused" : "isnotpaused"}`}
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
                                className="finishbtn"
                            >
                                <Save /> Finish
                            </button>
                        </>
                    )}
                    {isActive && (
                        <button
                            onClick={resetWorkout}
                            title="Cancel Workout"
                            className="cancelbtn"
                        >
                            <Square />
                        </button>
                    )}
                </div>
            </div>

            <div className="liveworkout__body">
                <div className="bodytitle">
                    <label>Session Title</label>
                    <input
                        type="text"
                        value={workoutTitle}
                        onChange={(e) => setWorkoutTitle(e.target.value)}
                    />
                </div>

                {activeExercises.length === 0 && (
                    <div className="bodynoexercise">
                        <div className="noexerciseicon">
                            <Dumbbell />
                        </div>
                        <h3 className="noexercisetitle">Ready to sweat?</h3>
                        <p className="noexercisebody">
                            Start your timer and add your first exercise.
                        </p>
                        <button
                            onClick={() => setIsExerciseModalOpen(true)}
                            className="addexercisebtn"
                        >
                            <Plus /> Add Exercise
                        </button>
                    </div>
                )}

                <div className="activeexercises">
                    {activeExercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="singleexercise">
                            <div className="exercisecontainer">
                                <h3 className="exercisetitle">
                                    <span>
                                        {exercise.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </span>
                                    {exercise.name}
                                </h3>

                                <div className="exercisecontrol">
                                    <div className="calorie">
                                        <Flame />
                                        <input
                                            type="number"
                                            onChange={(e) =>
                                                handleAddCalories(e)
                                            }
                                        />
                                        <span>cal</span>
                                    </div>
                                    <div className="divider"></div>
                                    <button
                                        className="removebtn"
                                        onClick={() =>
                                            removeExercise(exerciseIndex)
                                        }
                                    >
                                        <Trash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="exercisebody">
                                <div className="settitle">
                                    <div className="setindex">Set</div>
                                    <div className="setkg">kg</div>
                                    <div className="setrep">Reps</div>
                                    <div className="setremove"></div>
                                </div>
                                <div className="setbody">
                                    {exercise.sets.map((set, index) => (
                                        <div className="singleset" key={index}>
                                            <div className="singlesetindex">
                                                <span>{index + 1}</span>
                                            </div>
                                            <div className="singlesetkgrep">
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
                                            <div className="singlesetkgrep">
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
                                            <div className="singlesetremove">
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
                                    className="addset"
                                    onClick={() => addSet(exerciseIndex)}
                                >
                                    <Plus /> Add Set
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {activeExercises.length > 0 && (
                    <div className="addbtncontainer">
                        <button
                            className="addexercisebtn"
                            onClick={() => setIsExerciseModalOpen(true)}
                        >
                            <Plus /> Add Another Exercise
                        </button>
                    </div>
                )}
            </div>
            {isExerciseModalOpen && (
                <div className="liveworkout__exercisemodal">
                    <div className="modalcontainer">
                        <div className="modaltop">
                            <h3>Select Exercise</h3>
                            <button
                                onClick={() => setIsExerciseModalOpen(false)}
                            >
                                <X />
                            </button>
                        </div>
                        <div className="modalbody">
                            <div className="exerciselist">
                                {definitions.map((ex) => (
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
                        <div className="modalfooter">
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
