import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import "../styles/exercise-library-style.scss";
import { ChevronRight, Info, Search, Trophy, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ExerciseLibraryComponent = () => {
    const categories = ["All", "Strength", "Cardio", "HIIT", "Stability"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const { exercises } = useSelector((store) => store.workout);

    const [name, setName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!exercises || exercises.length === 0) {
            dispatch(WorkoutService.getDefinitions());
        }
    }, []);

    const filteredExercises = exercises.filter((ex) => {
        const matchesSearch =
            ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === "All" || false;
        return matchesSearch && matchesCategory;
    });

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

    const sortExercises = () => {
        const muscleGroupList = {
            Back: [],
            Biceps: [],
            Chest: [],
            Core: [],
            Cardio: [],
            Legs: [],
            Triceps: [],
            Other: [],
        };

        exercises.map((ex) => {
            if (ex.muscleGroup in muscleGroupList) {
                muscleGroupList[ex.muscleGroup].push(ex);
            }
        });

        return muscleGroupList;
    };

    const sortedExercises = sortExercises();

    return (
        <div className="exercise-library">
            <header className="exercise-library__header">
                <h2>Exercise Library</h2>
                <p>Explore exercises to build your perfect routine.</p>
            </header>

            <div className="exercise-library__filters">
                <div className="exercise-library__search-wrapper">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search by name or muscle group..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="exercise-library__categories">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="exercise-library__grid">
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-card">
                        <div className="exercise-card__header">
                            <div className="exercise-card__icon">
                                <Zap className="icon-emerald" />
                            </div>
                            <span className="badge badge-advanced">Difficulty</span>
                        </div>
                        <h3 className="exercise-card__title">{exercise.name}</h3>
                        <p className="exercise-card__subtitle">{exercise.muscleGroup}</p>
                        <p className="exercise-card__description">Description</p>

                        <div className="exercise-card__footer">
                            <span>
                                <Trophy /> Type
                            </span>
                            <button>
                                View Details <ChevronRight />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredExercises.length === 0 && (
                <div className="exercise-library__empty-state">
                    <div className="empty-state__icon">
                        <Info />
                    </div>
                    <h3 className="empty-state__title">No exercises found</h3>
                    <p className="empty-state__subtitle">
                        Try adjusting your seach or filters.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExerciseLibraryComponent;
