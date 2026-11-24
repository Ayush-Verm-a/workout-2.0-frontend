import { useEffect, useMemo, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import "../styles/exercise-library-style.scss";
import { Dumbbell, HeartPulse, Info, Search, Timer, Zap } from "lucide-react";
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

const EXERCISE_CATEGORIES = ["Strength", "Cardio", "Endurance"];
const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const DESCRIPTION_MAX_LENGTH = 250;

const CATEGORY_ICONS = {
  Strength: Dumbbell,
  Cardio: HeartPulse,
  Endurance: Timer,
};

const DIFFICULTY_ACCENTS = {
  Beginner: "blue",
  Intermediate: "green",
  Advanced: "orange",
};

const getAccent = (difficulty) => DIFFICULTY_ACCENTS[difficulty] || "slate";

const ExerciseLibraryComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { exercises } = useSelector((store) => store.workout);

  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
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

    if (!name.trim() || !muscleGroup || !category || !difficulty) {
      setError("Please fill name, muscle group, category and difficulty.");
      return;
    }

    setSaving(true);
    setError("");
    WorkoutService.saveDefinition({
      name: name.trim(),
      muscleGroup,
      category,
      difficulty,
      description: description.trim().slice(0, DESCRIPTION_MAX_LENGTH),
    })
      .then(() => {
        setMessage("Exercise added successfully!");
        setName("");
        setMuscleGroup("");
        setCategory("");
        setDifficulty("");
        setDescription("");
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
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Category</option>
          {EXERCISE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Difficulty</option>
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <div className="exercise-library__description-field">
          <input
            type="text"
            placeholder="Description (optional)"
            maxLength={DESCRIPTION_MAX_LENGTH}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="exercise-library__char-count">
            {description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
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
        {filteredExercises.map((exercise) => {
          const CategoryIcon = CATEGORY_ICONS[exercise.category] || Zap;
          const level = DIFFICULTY_LEVELS.indexOf(exercise.difficulty) + 1;

          return (
            <div
              key={exercise.id}
              className={`exercise-card exercise-card--${getAccent(exercise.difficulty)}`}
            >
              <div className="exercise-card__header">
                <div className="exercise-card__labels">
                  <span className="exercise-card__muscle">
                    {exercise.muscleGroup || "General"}
                  </span>
                  {exercise.category && (
                    <span className="exercise-card__category">
                      {exercise.category}
                    </span>
                  )}
                </div>
                <CategoryIcon className="exercise-card__icon" />
              </div>

              <div className="exercise-card__body">
                <h3 className="exercise-card__title">{exercise.name}</h3>
                <p className="exercise-card__description">
                  {exercise.description ||
                    "Add this movement to a plan or live session."}
                </p>

                <div className="exercise-card__footer">
                  <span className="exercise-card__footer-label">Difficulty</span>
                  <div className="exercise-card__difficulty">
                    <div
                      className="exercise-card__meter"
                      role="img"
                      aria-label={`Difficulty: ${exercise.difficulty || "Not set"}`}
                      title={exercise.difficulty || "Not set"}
                    >
                      {DIFFICULTY_LEVELS.map((lvl, i) => (
                        <span
                          key={lvl}
                          className={i < level ? "is-filled" : ""}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
