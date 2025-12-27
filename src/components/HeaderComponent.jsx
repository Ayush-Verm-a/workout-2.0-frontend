import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <div>
            <header>
                <nav>
                    <div>User Management App</div>
                    <div>
                        <ul>
                            {isAuth && (
                                <>
                                    <li>
                                        <Link to="/workouts">My Workouts</Link>
                                    </li>
                                    <li>
                                        <Link to="/live-workout">
                                            Start Workout
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                            {!isAuth && (
                                <>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/register">Signup</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default HeaderComponent;
