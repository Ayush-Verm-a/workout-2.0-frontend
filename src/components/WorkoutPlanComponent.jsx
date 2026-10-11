import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Pencil,
  Play,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import WorkoutService from "../services/WorkoutService";
import { setCurrentView } from "../store/slices/appSlice";
import "../styles/workout-plan-style.scss";

const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABELS = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const emptyForm = () => ({
  name: "",
  days: {},
});

const planToForm = (plan) => {
  const days = {};
  (plan.days || []).forEach((day) => {
    days[day.dayOfWeek] = (day.exercises || []).map((ex) => ({
      exerciseDefinitionId: ex.definition.id,
      name: ex.definition.name,
      muscleGroup: ex.definition.muscleGroup,
    }));
  });
  return { name: plan.name || "", days };
};

const formToPayload = (form) => ({
  name: form.name.trim(),
  days: WEEKDAYS.filter((d) => form.days[d]?.length > 0).map((dayOfWeek) => ({
    dayOfWeek,
    exercises: form.days[dayOfWeek].map((ex, orderIndex) => ({
      exerciseDefinitionId: ex.exerciseDefinitionId,
      orderIndex,
    })),
  })),
});

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.error || fallback;

const WorkoutPlanComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exercises } = useSelector((store) => store.workout);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState(null);
  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");
  const [pickerDay, setPickerDay] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(setCurrentView("WORKOUTPLAN"));
  }, [dispatch]);

  useEffect(() => {
    if (!exercises || exercises.length === 0) {
      dispatch(WorkoutService.getDefinitions());
    }
  }, [dispatch, exercises]);

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await WorkoutService.getWorkoutPlan();
        if (cancelled) return;
        setPlan(response.data);
        setMode("view");
      } catch (err) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setPlan(null);
          setMode("create");
          setForm(emptyForm());
        } else {
          setError(getErrorMessage(err, "Failed to load workout plan"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPlan();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDays = WEEKDAYS.filter((d) => form.days[d] !== undefined);

  const toggleDay = (dayOfWeek) => {
    setForm((prev) => {
      const next = { ...prev, days: { ...prev.days } };
      if (next.days[dayOfWeek] !== undefined) {
        delete next.days[dayOfWeek];
      } else {
        next.days[dayOfWeek] = [];
      }
      return next;
    });
  };

  const addExerciseToDay = (dayOfWeek, definition) => {
    setForm((prev) => {
      const existing = prev.days[dayOfWeek] || [];
      if (existing.some((ex) => ex.exerciseDefinitionId === definition.id)) {
        return prev;
      }
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayOfWeek]: [
            ...existing,
            {
              exerciseDefinitionId: definition.id,
              name: definition.name,
              muscleGroup: definition.muscleGroup,
            },
          ],
        },
      };
    });
    setPickerDay(null);
    setSearchQuery("");
  };

  const removeExercise = (dayOfWeek, index) => {
    setForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayOfWeek]: prev.days[dayOfWeek].filter((_, i) => i !== index),
      },
    }));
  };

  const moveExercise = (dayOfWeek, index, direction) => {
    setForm((prev) => {
      const list = [...prev.days[dayOfWeek]];
      const target = index + direction;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return {
        ...prev,
        days: { ...prev.days, [dayOfWeek]: list },
      };
    });
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Plan name is required";
    }
    const daysWithExercises = WEEKDAYS.filter(
      (d) => form.days[d]?.length > 0,
    );
    if (daysWithExercises.length === 0) {
      return "Add at least one day with one or more exercises";
    }
    for (const day of selectedDays) {
      if (!form.days[day] || form.days[day].length === 0) {
        return `${DAY_LABELS[day]} needs at least one exercise (or deselect it)`;
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = formToPayload(form);
    setSaving(true);
    setError("");

    try {
      let response;
      if (mode === "create") {
        try {
          response = await WorkoutService.createWorkoutPlan(payload);
        } catch (err) {
          if (err?.response?.status === 409) {
            response = await WorkoutService.updateWorkoutPlan(payload);
          } else {
            throw err;
          }
        }
      } else {
        try {
          response = await WorkoutService.updateWorkoutPlan(payload);
        } catch (err) {
          if (err?.response?.status === 404) {
            response = await WorkoutService.createWorkoutPlan(payload);
          } else {
            throw err;
          }
        }
      }
      setPlan(response.data);
      setMode("view");
      setForm(emptyForm());
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save workout plan"));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = () => {
    setForm(planToForm(plan));
    setMode("edit");
    setError("");
  };

  const cancelEdit = () => {
    if (plan) {
      setMode("view");
      setForm(emptyForm());
    } else {
      setMode("create");
      setForm(emptyForm());
    }
    setError("");
  };

  const startWorkoutFromDay = (day) => {
    dispatch(setCurrentView("STARTWORKOUT"));
    navigate("/live-workout", {
      state: {
        fromPlan: true,
        title: `${plan.name} — ${DAY_LABELS[day.dayOfWeek]}`,
        exercises: (day.exercises || []).map((ex) => ({
          definitionId: ex.definition.id,
          name: ex.definition.name,
          sets: [],
        })),
      },
    });
  };

  const filteredDefinitions = (exercises || []).filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="workout-plan">
        <div className="workout-plan__loading">Loading your plan…</div>
      </div>
    );
  }

  return (
    <div className="workout-plan">
      <div className="workout-plan__header">
        <div>
          <h2>Workout Plan</h2>
          <p>
            {mode === "view" && plan
              ? "Your weekly training schedule"
              : "Build a weekly plan from your exercise library"}
          </p>
        </div>
        {mode === "view" && plan && (
          <button type="button" className="btn-primary" onClick={startEdit}>
            <Pencil /> Edit Plan
          </button>
        )}
      </div>

      {error && <div className="workout-plan__error">{error}</div>}

      {mode === "view" && plan && (
        <div className="workout-plan__view">
          <h3 className="workout-plan__name">{plan.name}</h3>
          <div className="workout-plan__days">
            {(plan.days || []).map((day) => (
              <div key={day.id || day.dayOfWeek} className="plan-day">
                <div className="plan-day__header">
                  <div className="plan-day__title">
                    <CalendarDays />
                    <span>{DAY_LABELS[day.dayOfWeek] || day.dayOfWeek}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-start"
                    onClick={() => startWorkoutFromDay(day)}
                    disabled={!day.exercises?.length}
                  >
                    <Play /> Start Workout
                  </button>
                </div>
                <ul className="plan-day__exercises">
                  {(day.exercises || []).map((ex) => (
                    <li key={ex.id || `${ex.definition.id}-${ex.orderIndex}`}>
                      <span className="exercise-name">{ex.definition.name}</span>
                      <span className="exercise-group">
                        {ex.definition.muscleGroup}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {(mode === "create" || mode === "edit") && (
        <form className="workout-plan__form" onSubmit={handleSubmit}>
          {mode === "create" && !plan && (
            <div className="workout-plan__empty-banner">
              <CalendarDays />
              <div>
                <h3>Create your workout plan</h3>
                <p>Pick training days and add exercises from your library.</p>
              </div>
            </div>
          )}

          <label className="form-field">
            <span>Plan name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Push Pull Legs"
            />
          </label>

          <div className="form-field">
            <span>Training days</span>
            <div className="weekday-picker">
              {WEEKDAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`weekday-chip ${
                    form.days[day] !== undefined ? "active" : ""
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {DAY_LABELS[day].slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {selectedDays.map((dayOfWeek) => (
            <div key={dayOfWeek} className="day-editor">
              <div className="day-editor__header">
                <h4>{DAY_LABELS[dayOfWeek]}</h4>
                <button
                  type="button"
                  className="btn-add"
                  onClick={() => {
                    setPickerDay(dayOfWeek);
                    setSearchQuery("");
                  }}
                >
                  <Plus /> Add Exercise
                </button>
              </div>
              {(form.days[dayOfWeek] || []).length === 0 ? (
                <p className="day-editor__empty">No exercises yet</p>
              ) : (
                <ul className="day-editor__list">
                  {form.days[dayOfWeek].map((ex, index) => (
                    <li key={`${ex.exerciseDefinitionId}-${index}`}>
                      <div className="day-editor__info">
                        <span className="exercise-name">{ex.name}</span>
                        <span className="exercise-group">{ex.muscleGroup}</span>
                      </div>
                      <div className="day-editor__actions">
                        <button
                          type="button"
                          title="Move up"
                          disabled={index === 0}
                          onClick={() => moveExercise(dayOfWeek, index, -1)}
                        >
                          <ChevronUp />
                        </button>
                        <button
                          type="button"
                          title="Move down"
                          disabled={index === form.days[dayOfWeek].length - 1}
                          onClick={() => moveExercise(dayOfWeek, index, 1)}
                        >
                          <ChevronDown />
                        </button>
                        <button
                          type="button"
                          title="Remove"
                          className="btn-remove"
                          onClick={() => removeExercise(dayOfWeek, index)}
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div className="workout-plan__form-actions">
            {mode === "edit" && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Create Plan"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {pickerDay && (
        <div className="exercise-picker">
          <div className="exercise-picker__container">
            <div className="exercise-picker__header">
              <h3>Add to {DAY_LABELS[pickerDay]}</h3>
              <button
                type="button"
                onClick={() => {
                  setPickerDay(null);
                  setSearchQuery("");
                }}
              >
                <X />
              </button>
            </div>
            <div className="exercise-picker__search">
              <input
                type="text"
                placeholder="Search exercises…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="exercise-picker__body">
              {filteredDefinitions.length === 0 ? (
                <p className="exercise-picker__empty">No exercises found</p>
              ) : (
                filteredDefinitions.map((ex) => {
                  const alreadyAdded = (form.days[pickerDay] || []).some(
                    (item) => item.exerciseDefinitionId === ex.id,
                  );
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => addExerciseToDay(pickerDay, ex)}
                    >
                      <span>
                        <strong>{ex.name}</strong>
                        <small>{ex.muscleGroup}</small>
                      </span>
                      <Plus />
                    </button>
                  );
                })
              )}
            </div>
            <div className="exercise-picker__footer">
              <button
                type="button"
                onClick={() => {
                  setPickerDay(null);
                  setSearchQuery("");
                }}
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

export default WorkoutPlanComponent;
