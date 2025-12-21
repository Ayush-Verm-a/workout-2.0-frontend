import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./pages/register/Register";
import Home from "./pages/home/Home";
import LoginComponent from "./components/LoginComponent";
import RegisterComponent from "./components/RegisterComponent";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginComponent />} />
                <Route path="/login" element={<LoginComponent />} />
                <Route path="/register" element={<RegisterComponent />} />

                <Route path="/users" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
