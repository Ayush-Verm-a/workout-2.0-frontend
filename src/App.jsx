import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import HeaderComponent from "./components/HeaderComponent";
import ListWorkoutComponent from "./components/ListWorkoutComponent";
import AddWorkoutComponent from "./components/AddWorkoutComponent";
import LiveWorkoutComponent from "./components/LiveWorkoutComponent";

function App() {
    return (
        <BrowserRouter>
            <HeaderComponent />
            <Routes>
                <Route path="/" element={<LoginComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/register" element={<RegisterComponent />} />

                <Route path="/home" element={<Home />} />
                <Route path="/workouts" element={<ListWorkoutComponent />} />
                <Route path="/add-workout" element={<AddWorkoutComponent />} />
                <Route path="/live-workout" element={<LiveWorkoutComponent />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
