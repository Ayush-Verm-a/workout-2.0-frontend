import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import "../styles/exercise-library-style.scss";
import { ChevronRight, Info, Search, Trophy, Zap } from "lucide-react";

const ExerciseLibraryComponent = () => {
    const categories = ["All", "Strength", "Cardio", "HIIT", "Stability"];
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

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

        console.log(muscleGroupList);

        return muscleGroupList;
    };

    const sortedExercises = sortExercises();

    return (
        <div className="exerciselibrary__container">
            <header className="exerciselibrary__header">
                <h2>Exercise Library</h2>
                <p>Explore exercises to build your perfect routine.</p>
            </header>

            <div className="exerciselibrary__search">
                <div className="librarysearch">
                    <Search />
                    <input
                        type="text"
                        placeholder="Search by name or muscle group..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="librarycategory">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`${selectedCategory === cat ? "selected" : "notselected"}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="exerciselibrary__body">
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="exercisecard">
                        <div className="cardtop">
                            <div className="cardicon">
                                <Zap className={`${"iconemerald"}`} />
                            </div>
                            <span className={`${"advanced"}`}>Difficulty</span>
                        </div>
                        <h3 className="cardtitle">{exercise.name}</h3>
                        <p className="cardsubtitle">{exercise.muscleGroup}</p>
                        <p className="carddesc">Description</p>

                        <div className="cardbottom">
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
                <div className="exerciselibrary__nomatch">
                    <div className="nomatchicon">
                        <Info />
                    </div>
                    <h3 className="nomatchtitle">No exercises found</h3>
                    <p className="nomatchsubtitle">
                        Try adjusting your seach or filters.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExerciseLibraryComponent;
