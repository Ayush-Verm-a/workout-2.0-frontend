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

const LiveWorkoutComponent = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [definitions, setDefinitions] = useState([]);
    const [workoutTitle, setWorkoutTitle] = useState("My Workout");
    const [activeExercises, setActiveExercises] = useState([]);
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

    const addSet = (exerciseIndex, weight, reps) => {
        const updatedExercises = [...activeExercises];
        updatedExercises[exerciseIndex].sets.push({
            weight: weight,
            reps: reps,
            setNumber: updatedExercises[exerciseIndex].sets.length + 1,
        });

        setActiveExercises(updatedExercises);
    };

    const addExerciseToWorkout = (defId) => {
        const def = definitions.find((d) => d.id === defId);
        setActiveExercises([
            ...activeExercises,
            {
                definitionId: def.id,
                name: def.name,
                sets: [],
            },
        ]);
    };

    const finishWorkout = () => {
        setIsActive(false);

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

    const handleAddCalories = () => {
        const val = parseInt(calorieInput);

        if (!isNaN(val) && val > 0) {
            setTotalCalories((prevTotal) => prevTotal + val);
            setCalorieInput("");
        }
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
                            onClick={() => navigate("/workouts")}
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
                                        <input type="number" />
                                        <span>cal</span>
                                    </div>
                                    <div className="divider"></div>
                                    <button className="removebtn">
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
                                                />
                                            </div>
                                            <div className="singlesetkgrep">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="singlesetremove">
                                                <button>
                                                    <X />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="addset">
                                    <Plus /> Add Set
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {activeExercises.length > 0 && (
                    <div className="addbtncontainer">
                        <button className="addexercisebtn">
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

            <div className="liveworkout__row">
                {/* <div>
                    <h2>{formatTime()}</h2>
                </div> */}
                <div>
                    <label>Total Calories Burned: </label>
                    <span>{totalCalories}</span>
                </div>
            </div>
            <div className="liveworkout__row">
                {seconds > 0 && (
                    <div>
                        <div>
                            {activeExercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="liveworkout__setgroup"
                                >
                                    <h2>{exercise.name}</h2>
                                    <div>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Set</th>
                                                    <th>Weight(kg)</th>
                                                    <th>Reps</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map((set, i) => (
                                                    <tr key={i}>
                                                        <td>{set.setNumber}</td>
                                                        <td>{set.weight}</td>
                                                        <td>{set.reps}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <SetInput
                                            onAdd={(w, r) =>
                                                addSet(index, w, r)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div>
                    <div className="liveworkout__controlworkout">
                        {!isActive && seconds === 0 && (
                            <button onClick={toggleTimer}>Start Workout</button>
                        )}
                        {isActive && (
                            <button onClick={toggleTimer}>Pause</button>
                        )}
                        {seconds > 0 && !isActive && (
                            <button onClick={toggleTimer}>Resume</button>
                        )}
                    </div>
                    {seconds > 0 && (
                        <div>
                            <div className="liveworkout__addexercise">
                                <select id="exerciseSelect">
                                    <option value="">Select Exercise...</option>
                                    {definitions.map((def) => (
                                        <option key={def.id} value={def.id}>
                                            {def.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => {
                                        const select =
                                            document.getElementById(
                                                "exerciseSelect",
                                            );
                                        if (select.value)
                                            addExerciseToWorkout(select.value);
                                    }}
                                >
                                    + Add Exercise
                                </button>
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <label>Add Calories</label>
                                        <div>
                                            <input
                                                type="number"
                                                placeholder="e.g. 100"
                                                value={calorieInput}
                                                onChange={(e) =>
                                                    setCalorieInput(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddCalories}
                                            >
                                                + Add
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate("/workouts")}
                                    >
                                        Cancel Workout
                                    </button>
                                    <button onClick={finishWorkout}>
                                        Finish & Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SetInput = ({ onAdd }) => {
    const [weight, setWeight] = useState("");
    const [reps, setReps] = useState("");

    const handleAdd = () => {
        if (weight && reps) {
            onAdd(weight, reps);
            setWeight("");
            setReps("");
        }
    };

    return (
        <div>
            <input
                type="number"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
            />
            <input
                type="number"
                placeholder="reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
            />
            <button onClick={handleAdd}>Add Set</button>
        </div>
    );
};

export default LiveWorkoutComponent;
