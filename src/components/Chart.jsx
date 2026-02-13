import { duration } from "@mui/material";
import { useMemo } from "react";
import "../styles/chart-style.scss";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const Chart = ({ workouts }) => {
    const chartData = useMemo(() => {
        return [...workouts]
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .slice(-28)
            .map((w) => ({
                date: new Date(w.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                }),
                calories: w.caloriesBurned,
                duration: w.duration,
            }));
    }, [workouts]);

    return (
        <div className="chart__container">
            <div className="chart__subcontainer">
                <h3>Duration Trend (mins)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                        />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="duration"
                            stroke="#059669"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="chart__subcontainer">
                <h3>Calories Burned</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e2e8f0"
                        />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: "#f1f5f9" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                        <Bar
                            dataKey="calories"
                            fill="#f97316"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Chart;
