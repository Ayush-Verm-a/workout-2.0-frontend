import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import WorkoutModalComponent from "./WorkoutModalComponent";
import { Link } from "react-router-dom";
import { Calendar, Clock, Flame, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/list-workout-style.scss";
import { getErrorMessage } from "../utils/errorMessage";

const ListWorkoutComponent = () => {
  const dispatch = useDispatch();
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const { isAuthenticated } = useSelector((store) => store.user);
  const { workouts, workoutsStatus, workoutsError } = useSelector(
    (store) => store.workout,
  );

  useEffect(() => {
    dispatch(WorkoutService.getAllWorkouts());
  }, [dispatch, isAuthenticated]);

  const deleteWorkout = (id) => {
    setDeleteError("");
    WorkoutService.deleteWorkout(id)
      .then(() => {
        dispatch(WorkoutService.getAllWorkouts());
      })
      .catch((error) => {
        setDeleteError(getErrorMessage(error, "Could not delete workout"));
      });
  };

  return (
    <div className="listworkout__container">
      <div className="listworkout__header-row">
        <h1>Workout History</h1>
        <Link to="/live-workout" className="listworkout__start-link">
          <Plus /> Start Workout
        </Link>
      </div>

      {deleteError && <div className="form-error">{deleteError}</div>}
      {workoutsStatus === "failed" && (
        <div className="form-error">{workoutsError}</div>
      )}

      <div className="listworkout__subcontainer">
        <div className="listworkout__row listworkout__head">
          {workoutsStatus === "loading" && workouts.length === 0 ? (
            <div className="listworkout__noworkout">Loading workouts…</div>
          ) : workouts.length === 0 ? (
            <div className="listworkout__noworkout">
              No workouts logged yet. Start a live session to record one.
            </div>
          ) : (
            workouts.map((workout) => (
              <div
                key={workout.id}
                className="listworkout__workoutrow"
                onClick={() => setSelectedWorkoutId(workout.id)}
              >
                <div className="listworkout__workoutdata">
                  <div className="listworkout__workoutdatahead">
                    <span>{(workout.title || "WO").substring(0, 3)}</span>
                  </div>

                  <div className="listworkout__workoutdatabody">
                    <h3>{workout.title}</h3>
                    <div className="listworkout__workoutdatabodycontainer">
                      <span>
                        <Calendar />
                        {workout.date
                          ? new Date(workout.date).toLocaleDateString()
                          : "—"}
                      </span>
                      <span>
                        <Clock />
                        {workout.duration} min
                      </span>
                      <span>
                        <Flame />
                        {workout.caloriesBurned ?? 0} cal
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  title="Delete Workout"
                  className="listworkout__deletebtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkout(workout.id);
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {selectedWorkoutId && (
        <WorkoutModalComponent
          workoutId={selectedWorkoutId}
          onClose={() => setSelectedWorkoutId(null)}
        />
      )}
    </div>
  );
};

export default ListWorkoutComponent;
