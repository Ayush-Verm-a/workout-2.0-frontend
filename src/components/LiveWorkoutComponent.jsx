import { duration } from "@mui/material";
import { addListener } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutService from "../services/WorkoutService";
import { internal_createExtendSxProp } from "@mui/material/zero-styled";

const LiveWorkoutComponent = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [definitions, setDefinitions] = useState([]);
    const [workoutTitle, setWorkoutTitle] = useState("My Workout");
    const [activeExercises, setActiveExercises] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [calorieInput, setCalorieInput] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        WorkoutService.getDefinitions().then((res) => {
            setDefinitions(res.data);
        });
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds != 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    });

    const formatTime = () => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
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
            <div className="liveworkout__title">
                <input
                    type="text"
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                />
            </div>
            <div className="liveworkout__row">
                <div>
                    <h2>{formatTime()}</h2>
                </div>
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
                                <div key={index} className="liveworkout__setgroup">
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
                                                "exerciseSelect"
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
                                                        e.target.value
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
