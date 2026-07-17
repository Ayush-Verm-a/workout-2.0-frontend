import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Home from "./pages/home/Home";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";
import ListWorkoutComponent from "./components/ListWorkoutComponent";
import AddWorkoutComponent from "./components/AddWorkoutComponent";
import LiveWorkoutComponent from "./components/LiveWorkoutComponent";
import ExerciseLibraryComponent from "./components/ExerciseLibraryComponent";
import FeedComponent from "./components/FeedComponent";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AICoachComponent from "./components/AICoachComponent";
import { useSelector } from "react-redux";

function App() {
    const { isAuthenticated } = useSelector((store) => store.user);

    return (
        <div className="app__container">
            <BrowserRouter>
                <Sidebar />
                <main className="app__body">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginComponent />} />
                        <Route path="/register" element={<RegisterComponent />} />
                        <Route path="/home" element={<Home />} />
                        
                        {/* Protected Routes */}
                        <Route path="/workouts" element={<ProtectedRoute><ListWorkoutComponent /></ProtectedRoute>} />
                        <Route path="/add-workout" element={<ProtectedRoute><AddWorkoutComponent /></ProtectedRoute>} />
                        <Route path="/live-workout" element={<ProtectedRoute><LiveWorkoutComponent /></ProtectedRoute>} />
                        <Route path="/exercises" element={<ProtectedRoute><ExerciseLibraryComponent /></ProtectedRoute>} />
                        <Route path="/feed" element={<ProtectedRoute><FeedComponent /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/ai-coach" element={<ProtectedRoute><AICoachComponent /></ProtectedRoute>} />
                    </Routes>
                </main>
            </BrowserRouter>
        </div>
    );
}

export default App;
