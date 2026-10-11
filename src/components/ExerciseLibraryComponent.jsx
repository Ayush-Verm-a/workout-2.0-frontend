import { useEffect, useMemo, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import "../styles/exercise-library-style.scss";
import { Info, Search, Trophy, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../utils/errorMessage";

const DEFAULT_MUSCLE_GROUPS = [
  "Back",
  "Biceps",
  "Chest",
  "Core",
  "Cardio",
  "Legs",
  "Triceps",
  "Other",
];

const ExerciseLibraryComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { exercises } = useSelector((store) => store.workout);

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(WorkoutService.getDefinitions());
  }, [dispatch]);

  const categories = useMemo(() => {
    const groups = new Set(DEFAULT_MUSCLE_GROUPS);
    (exercises || []).forEach((ex) => {
      if (ex.muscleGroup) groups.add(ex.muscleGroup);
    });
    return ["All", ...Array.from(groups)];
  }, [exercises]);

  const filteredExercises = (exercises || []).filter((ex) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      ex.name.toLowerCase().includes(query) ||
      (ex.muscleGroup || "").toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "All" || ex.muscleGroup === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name.trim() || !muscleGroup.trim()) {
      setError("Please fill both fields.");
      return;
    }

    setSaving(true);
    setError("");
    WorkoutService.saveDefinition({ name: name.trim(), muscleGroup: muscleGroup.trim() })
      .then(() => {
        setMessage("Exercise added successfully!");
        setName("");
        setMuscleGroup("");
        dispatch(WorkoutService.getDefinitions());
        setTimeout(() => setMessage(""), 3000);
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Could not add exercise"));
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="exercise-library">
      <header className="exercise-library__header">
        <h2>Exercise Library</h2>
        <p>Explore exercises to build your perfect routine.</p>
      </header>

      <form className="exercise-library__add-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Exercise name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
        >
          <option value="">Muscle group</option>
          {DEFAULT_MUSCLE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        <button type="submit" disabled={saving}>
          {saving ? "Adding…" : "Add"}
        </button>
      </form>
      {message && <p className="exercise-library__message">{message}</p>}
      {error && <div className="form-error">{error}</div>}

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
              type="button"
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
              <span className="badge badge-beginner">
                {exercise.muscleGroup}
              </span>
            </div>
            <h3 className="exercise-card__title">{exercise.name}</h3>
            <p className="exercise-card__subtitle">{exercise.muscleGroup}</p>
            <p className="exercise-card__description">
              {exercise.description || "Add this movement to a plan or live session."}
            </p>
            <div className="exercise-card__footer">
              <span>
                <Trophy /> {exercise.muscleGroup}
              </span>
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
            Try adjusting your search or filters, or add a new exercise above.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibraryComponent;
