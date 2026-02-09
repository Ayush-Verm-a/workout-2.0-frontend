import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";
import ActivityCalendar from "./ActivityCalendar";
import Chart from "./Chart";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const FeedComponent = () => {
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useSelector((store) => store.user);
    const { workouts } = useSelector((store) => store.workout);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/home");
        }
        if (!workouts || workouts.length === 0) {
            dispatch(WorkoutService.getAllWorkouts());
        }
    }, [dispatch, isAuthenticated]);

    const generateCalendarDays = () => {
        const today = new Date();
        const weeks = [[], [], [], [], [], []];

        const endDate = new Date(today);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);

        let weekDay = startDate.getDay();
        let week = 0;
        for (let i = 0; i < weekDay; i += 1) {
            weeks[0].push(null);
        }

        const loopDate = new Date(startDate);

        while (loopDate <= endDate) {
            weeks[week].push(new Date(loopDate));
            loopDate.setDate(loopDate.getDate() + 1);
            weekDay += 1;
            week = Math.floor(weekDay / 7);
        }

        return weeks;
    };

    const hasWorkout = (dateObj) => {
        const dateString = dateObj.toISOString().split("T")[0];

        return workouts.some((w) => w.date.startsWith(dateString));
    };

    const calendarDays = generateCalendarDays();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="feed__container">
            <header className="feed__header">
                <h1>Feed</h1>
            </header>
            <div className="feed__stats">
                <div className="statcard">
                    <div className="statcardicon">
                        <Activity />
                    </div>
                    <div>
                        <p className="statcardvalue1">Total Workouts</p>
                        <p className="statcardvalue2">
                            {
                                workouts.filter((w) => {
                                    const d = new Date(w.date);
                                    const now = new Date();
                                    return (
                                        (now - d) / (1000 * 60 * 60 * 24) <= 30
                                    );
                                }).length
                            }
                        </p>
                    </div>
                </div>
            </div>
            <ActivityCalendar workouts={workouts} />
            <Chart workouts={workouts} />
        </div>
    );
};

export default FeedComponent;
