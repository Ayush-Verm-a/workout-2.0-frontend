import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../styles/header-style.scss";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isAuth = AuthService.getCurrentUser();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    return (
        <div className="header__container alfa-slab-one-regular">
            <header>
                <nav className="header__navbar">
                    <div>
                        <h2>
                            <Link to="/" className="header__title">
                                Workout App
                            </Link>
                        </h2>
                    </div>
                    <div className="header__menu">
                        {isAuth && (
                            <>
                                <div className="header__menuitem">
                                    <Link to="/feed">Feed</Link>
                                </div>
                                <div className="header__menuitem">
                                    <Link to="/workouts">My Workouts</Link>
                                </div>
                                <div className="header__menuitem">
                                    <Link to="/live-workout">
                                        Start Workout
                                    </Link>
                                </div>
                                <div className="header__menuitem">
                                    <Link to="/exercises">Exercises</Link>
                                </div>
                                <div className="header__menuitem">
                                    <button className="header__authbutton" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                        {!isAuth && (
                            <>
                                <div className="header__menuitem">
                                    <Link className="header__authbutton" to="/login">Login</Link>
                                </div>
                                <div className="header__menuitem">
                                    <Link className="header__authbutton" to="/register">Signup</Link>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default HeaderComponent;
