import { CalendarDays } from "lucide-react";
import { useMemo } from "react";
import "../styles/activity-calendar-style.scss";

const ActivityCalendar = ({ workouts }) => {
    const today = new Date();
    const generateCalendarDays = () => {
        const days = [];
        const endDate = new Date(today);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 29);

        const gridStart = new Date(startDate);
        gridStart.setDate(startDate.getDate() - startDate.getDay());

        const current = new Date(gridStart);

        while (current <= endDate || current.getDay() !== 0) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
            if (days.length > 42) break;
        }

        return days;
    };

    const isSameDay = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const workoutsByDay = useMemo(() => {
        const map = new Map();
        workouts.map((w) => {
            const d = new Date(w.date).toDateString();
            if (!map.has(d)) map.set(d, []);
            map.get(d)?.push(w);
        });
        return map;
    }, [workouts]);

    const calendarDays = generateCalendarDays();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="activitycalendar__container">
            <div className="activitycalendar__header">
                <CalendarDays />
                <h3>Activity Calendar</h3>
            </div>
            <div className="activitycalendar__body">
                {weekDays.map((day) => (
                    <div className="weekdayname" key={day}>
                        {day}
                    </div>
                ))}
                {calendarDays.map((date, i) => {
                    const dateKey = date.toDateString();
                    const dayWorkouts = workoutsByDay.get(dateKey);
                    const hasWorkout = dayWorkouts && dayWorkouts.length > 0;
                    const isToday = isSameDay(date, today);

                    const timeDiff = today.getTime() - date.getTime();
                    const daysDiff = timeDiff / (1000 * 3600 * 24);
                    const isWithin30Days = daysDiff <= 29 && daysDiff >= 0;

                    return (
                        <div
                            key={i}
                            className={`calendarday ${hasWorkout ? "hasworkout" : "hasnoworkout"} ${isToday ? 'istoday' : ''} ${!isWithin30Days ? 'withinmonth' : ''}`}
                            title={
                                hasWorkout
                                    ? dayWorkouts
                                        ?.map(
                                            (w) =>
                                                `${w.type}: ${w.durationMinutes}m`,
                                        )
                                        .join("\n")
                                    : undefined
                            }
                        >
                            <span>{date.getDate()}</span>
                            {hasWorkout && (
                                <div className="workoutcnt">
                                    {dayWorkouts.slice(0, 3).map((_, idx) => (
                                        <div key={idx} className="workoutcnt1" />
                                    ))}
                                    {dayWorkouts.length > 3 && (
                                        <div className="" />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActivityCalendar;
