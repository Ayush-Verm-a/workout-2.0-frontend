import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";

const ExerciseLibraryComponent = () => {
    const [exercises, setExercises] = useState([]);

    const [name, setName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [message, setMessage] = useState("");

    const loadExercises = () => {
        WorkoutService.getDefinitions()
            .then((res) => {
                setExercises(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        loadExercises();
    }, []);

    const handleAdd = (e) => {
        e.preventDefault();

        if (!name || !muscleGroup) {
            setMessage("Please fill both the fields!");
            return;
        }

        const newExercise = { name, muscleGroup };

        WorkoutService.saveDefinition(newExercise)
            .then(() => {
                setMessage("Exercise added successfully!");
                setName("");
                setMuscleGroup("");
                loadExercises();

                setTimeout(() => setMessage(""), 3000);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="exerciselibrary__container">
            <h2>Exercise Library</h2>
            <div>
                <div>Add Custom Exercise</div>
                <div>
                    {message && <div>{message}</div>}
                    <form>
                        <div>
                            <input
                                type="text"
                                placeholder="Exercise Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <select
                                value={muscleGroup}
                                onChange={(e) => setMuscleGroup(e.target.value)}
                            >
                                <option value="">Select Muscle Group...</option>
                                <option value="Chest">Chest</option>
                                <option value="Back">Back</option>
                                <option value="Legs">Legs</option>
                                <option value="Arms">Arms</option>
                                <option value="Core">Core</option>
                                <option value="Cardio">Cardio</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <button
                                onClick={(e) => {
                                    handleAdd(e);
                                }}
                            >
                                + Add to Library
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div>
                {exercises.map((ex) => (
                    <div key={ex.id}>
                        <div>
                            <div>
                                <div>
                                    <h5>{ex.name}</h5>
                                    <small>{ex.muscleGroup}</small>
                                </div>
                                <span>{ex.muscleGroup.substring(0, 1)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseLibraryComponent;
