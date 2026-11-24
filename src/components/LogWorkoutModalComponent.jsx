import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, X } from "lucide-react";
import WorkoutService from "../services/WorkoutService";
import { getErrorMessage } from "../utils/errorMessage";
import "../styles/workout-modal-style.scss";
import "../styles/log-workout-modal-style.scss";

// Local "YYYY-MM-DDTHH:mm" for datetime-local inputs
const toLocalInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

const emptySet = () => ({ weight: "", reps: "" });

const LogWorkoutModalComponent = ({ onClose, onSaved }) => {
  const dispatch = useDispatch();
  const { exercises: definitions } = useSelector((store) => store.workout);

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [dateTime, setDateTime] = useState(() => toLocalInputValue(new Date()));
  const [exercises, setExercises] = useState([]);
  const [selectedDefId, setSelectedDefId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(WorkoutService.getDefinitions());
  }, [dispatch]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, saving]);

  const addExercise = () => {
    const def = (definitions || []).find((d) => String(d.id) === selectedDefId);
    if (!def) return;
    if (exercises.some((ex) => ex.definitionId === def.id)) {
      setError(`${def.name} is already in this workout.`);
      return;
    }
    setError("");
    setExercises((prev) => [
      ...prev,
      { definitionId: def.id, name: def.name, sets: [emptySet()] },
    ]);
    setSelectedDefId("");
  };

  const removeExercise = (exIndex) =>
    setExercises((prev) => prev.filter((_, i) => i !== exIndex));

  const addSet = (exIndex) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex ? { ...ex, sets: [...ex.sets, emptySet()] } : ex,
      ),
    );

  const removeSet = (exIndex, setIndex) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? { ...ex, sets: ex.sets.filter((_, s) => s !== setIndex) }
          : ex,
      ),
    );

  const updateSet = (exIndex, setIndex, field, value) =>
    setExercises((prev) =>
      prev.map((ex, i) =>
        i === exIndex
          ? {
              ...ex,
              sets: ex.sets.map((set, s) =>
                s === setIndex ? { ...set, [field]: value } : set,
              ),
            }
          : ex,
      ),
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a workout title.");
      return;
    }
    if (!duration || Number(duration) <= 0) {
      setError("Please enter a duration in minutes.");
      return;
    }
    if (!dateTime) {
      setError("Please choose a date and time.");
      return;
    }
    if (new Date(dateTime) > new Date()) {
      setError("Date and time can't be in the future.");
      return;
    }

    const allSets = [];
    for (const ex of exercises) {
      ex.sets.forEach((s, i) => {
        allSets.push({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0,
          setNumber: i + 1,
          definition: { id: ex.definitionId },
        });
      });
    }

    if (allSets.some((s) => s.reps <= 0)) {
      setError("Every set needs at least 1 rep.");
      return;
    }

    setSaving(true);
    setError("");

    WorkoutService.saveWorkout({
      title: title.trim(),
      duration: parseInt(duration, 10),
      caloriesBurned: parseInt(calories, 10) || 0,
      date: `${dateTime}:00`,
      sets: allSets,
    })
      .then(() => {
        dispatch(WorkoutService.getAllWorkouts());
        onSaved?.();
        onClose();
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Could not save workout. Try again."));
      })
      .finally(() => setSaving(false));
  };

  const availableDefs = (definitions || []).filter(
    (d) => !exercises.some((ex) => ex.definitionId === d.id),
  );

  return createPortal(
    <div className="workoutmodal__overlay" onClick={() => !saving && onClose()}>
      <form
        className="workoutmodal__container logworkout"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logworkout-title"
      >
        <div className="workoutmodal__header">
          <div>
            <h2 id="logworkout-title">Log Workout</h2>
            <p>Record a workout you've already done.</p>
          </div>
          <button
            type="button"
            className="workoutmodal__closebtn"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workoutmodal__content logworkout__content">
          <div className="logworkout__field">
            <label htmlFor="logworkout-name">Workout title</label>
            <input
              id="logworkout-name"
              type="text"
              placeholder="e.g. Push Day"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="logworkout__grid">
            <div className="logworkout__field">
              <label htmlFor="logworkout-duration">Duration (min)</label>
              <input
                id="logworkout-duration"
                type="number"
                min="1"
                placeholder="45"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="logworkout__field">
              <label htmlFor="logworkout-calories">Calories (kcal)</label>
              <input
                id="logworkout-calories"
                type="number"
                min="0"
                placeholder="300"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
          </div>

          <div className="logworkout__field">
            <label htmlFor="logworkout-date">Date &amp; time</label>
            <input
              id="logworkout-date"
              type="datetime-local"
              value={dateTime}
              max={toLocalInputValue(new Date())}
              onChange={(e) => setDateTime(e.target.value)}
            />
          </div>

          <div className="logworkout__section">
            <h3>Exercises</h3>

            {exercises.map((ex, exIndex) => (
              <div key={ex.definitionId} className="logworkout__exercise">
                <div className="logworkout__exercise-header">
                  <span>{ex.name}</span>
                  <button
                    type="button"
                    className="logworkout__icon-btn"
                    onClick={() => removeExercise(exIndex)}
                    aria-label={`Remove ${ex.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="logworkout__set-labels">
                  <span>Set</span>
                  <span>kg</span>
                  <span>Reps</span>
                  <span />
                </div>

                {ex.sets.map((set, setIndex) => (
                  <div key={setIndex} className="logworkout__set-row">
                    <span className="logworkout__set-num">{setIndex + 1}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, "weight", e.target.value)
                      }
                      aria-label={`${ex.name} set ${setIndex + 1} weight in kg`}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="0"
                      value={set.reps}
                      onChange={(e) =>
                        updateSet(exIndex, setIndex, "reps", e.target.value)
                      }
                      aria-label={`${ex.name} set ${setIndex + 1} reps`}
                    />
                    <button
                      type="button"
                      className="logworkout__icon-btn"
                      onClick={() => removeSet(exIndex, setIndex)}
                      aria-label={`Remove set ${setIndex + 1}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="logworkout__add-set"
                  onClick={() => addSet(exIndex)}
                >
                  <Plus size={14} /> Add set
                </button>
              </div>
            ))}

            <div className="logworkout__add-exercise">
              <select
                value={selectedDefId}
                onChange={(e) => setSelectedDefId(e.target.value)}
                aria-label="Choose an exercise"
              >
                <option value="">Choose an exercise…</option>
                {availableDefs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addExercise}
                disabled={!selectedDefId}
              >
                <Plus size={16} /> Add exercise
              </button>
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="logworkout__footer">
          <button
            type="button"
            className="logworkout__cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="logworkout__submit" disabled={saving}>
            {saving ? "Saving…" : "Add workout"}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default LogWorkoutModalComponent;
