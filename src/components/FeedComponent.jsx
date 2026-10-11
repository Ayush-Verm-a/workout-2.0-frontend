import { useEffect } from "react";
import WorkoutService from "../services/WorkoutService";
import ActivityCalendar from "./ActivityCalendar";
import Chart from "./Chart";
import { Activity } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/feed-style.scss";

const FeedComponent = () => {
    const { isAuthenticated } = useSelector((store) => store.user);
    const { workouts, workoutsStatus, workoutsError } = useSelector(
        (store) => store.workout,
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(WorkoutService.getAllWorkouts());
    }, [dispatch, isAuthenticated]);

    const recentCount = workouts.filter((w) => {
        const d = new Date(w.date);
        const now = new Date();
        return (now - d) / (1000 * 60 * 60 * 24) <= 30;
    }).length;

    return (
        <div className="feed__container">
            <header className="feed__header">
                <h1>Feed</h1>
            </header>
            {workoutsStatus === "failed" && (
                <div className="form-error">{workoutsError}</div>
            )}
            <div className="feed__stats">
                <div className="statcard">
                    <div className="statcardicon">
                        <Activity />
                    </div>
                    <div>
                        <p className="statcardvalue1">Workouts (30 days)</p>
                        <p className="statcardvalue2">
                            {workoutsStatus === "loading" && workouts.length === 0
                                ? "…"
                                : recentCount}
                        </p>
                    </div>
                </div>
            </div>
            {workoutsStatus === "succeeded" && workouts.length === 0 ? (
                <p className="feed__empty">No workouts yet. Start a live session to see activity here.</p>
            ) : (
                <>
                    <ActivityCalendar workouts={workouts} />
                    <Chart workouts={workouts} />
                </>
            )}
        </div>
    );
};

export default FeedComponent;
