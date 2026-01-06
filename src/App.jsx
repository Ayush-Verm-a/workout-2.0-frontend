import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import HeaderComponent from "./components/HeaderComponent";
import ListWorkoutComponent from "./components/ListWorkoutComponent";
import AddWorkoutComponent from "./components/AddWorkoutComponent";
import LiveWorkoutComponent from "./components/LiveWorkoutComponent";
import ExerciseLibraryComponent from "./components/ExerciseLibraryComponent";
import WorkoutDetailsComponent from "./components/WorkoutDetailsComponent";
import FeedComponent from "./components/FeedComponent";

function App() {
    return (
        <BrowserRouter>
            <HeaderComponent />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/register" element={<RegisterComponent />} />

                <Route path="/home" element={<Home />} />
                <Route path="/workouts" element={<ListWorkoutComponent />} />
                <Route path="/add-workout" element={<AddWorkoutComponent />} />
                <Route path="/live-workout" element={<LiveWorkoutComponent />} />
                <Route path="/exercises" element={<ExerciseLibraryComponent />} />
                <Route path="/workouts/:id" element={<WorkoutDetailsComponent />} />
                <Route path="/feed" element={<FeedComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
