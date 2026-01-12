import { useEffect, useState } from "react";
import WorkoutService from "../services/WorkoutService";

const FeedComponent = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        WorkoutService.getAllWorkouts()
            .then((res) => {
                setWorkouts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

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
            <h1>Feed</h1>
            <div>
                <div>
                    <div className="feed__subheading">
                        <h3>Activity</h3>
                        <h3>
                            Last 30 Days:{" "}
                            <span>
                                {
                                    workouts.filter((w) => {
                                        const d = new Date(w.date);
                                        const now = new Date();
                                        return (
                                            (now - d) / (1000 * 60 * 60 * 24) <=
                                            30
                                        );
                                    }).length
                                }{" "}
                                workouts
                            </span>
                        </h3>
                    </div>
                    <div className="feed__row">
                        <div>
                            <div className="feed__weekdays feed__calendar">
                                {weekDays.map((day) => (
                                    <div
                                        className="feed__calendarcell"
                                        key={day}
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div>
                                {calendarDays.map((calweek, wIndex) => (
                                    <div
                                        className="feed__calendar"
                                        key={wIndex}
                                    >
                                        {calweek.length > 0 &&
                                            calweek.map((date, index) => {
                                                if (date !== null) {
                                                    const isToday =
                                                        new Date().toDateString() ===
                                                        date.toDateString();
                                                    const active =
                                                        hasWorkout(date);
                                                    const dayNum = String(
                                                        date.getDate()
                                                    ).padStart(2, "0");
                                                    return (
                                                        <div
                                                            className={`feed__calendarcell ${
                                                                active
                                                                    ? "feed__activecalendarcell"
                                                                    : ""
                                                            }`}
                                                            key={index}
                                                        >
                                                            <div>{dayNum}</div>
                                                        </div>
                                                    );
                                                }
                                                return (
                                                    <div
                                                        className="feed__calendarcell"
                                                        key={index}
                                                    ></div>
                                                );
                                            })}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedComponent;
