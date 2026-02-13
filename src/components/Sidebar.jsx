import { BicepsFlexed } from "lucide-react";
import { useState, useEffect } from "react";
import UserService from "../services/UserService";
import {
    LayoutDashboard,
    Dumbbell,
    Timer,
    NotebookTabs,
    LogOut,
    LogIn,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../styles/sidebar-style.scss";
import { useDispatch, useSelector } from "react-redux";

const NavItem = ({ view, label, icon: Icon, current, onClick, link }) => {
    return (
        <Link to={`/${link}`}>
            <button
                onClick={() => onClick(view)}
                className={`nav-item ${current === view ? "nav-item--active" : ""}`}
            >
                <Icon />
                <span>{label}</span>
            </button>
        </Link>
    );
};

const Sidebar = () => {
    const { user, isAuthenticated } = useSelector((store) => store.user);
    const [currentView, setCurrentView] = useState("");
    // const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(AuthService.getCurrentUser());
    }, [isAuthenticated]);

    const profileClick = () => { };

    const handleLogout = () => {
        setCurrentView("");
        dispatch(AuthService.logout());
        navigate("/home");
    };

    return (
        <aside className="sidebar">
            <Link to="/" onClick={() => setCurrentView("")}>
                <div className="sidebar__header">
                    <div className="sidebar__icon">
                        <BicepsFlexed />
                    </div>
                    <span>Workout App</span>
                </div>
            </Link>

            <nav className="sidebar__nav">
                <NavItem
                    view="FEED"
                    label="Feed"
                    icon={LayoutDashboard}
                    current={currentView}
                    onClick={setCurrentView}
                    link="feed"
                />
                <NavItem
                    view="WORKOUTS"
                    label="Workouts"
                    icon={Dumbbell}
                    current={currentView}
                    onClick={setCurrentView}
                    link="workouts"
                />
                <NavItem
                    view="STARTWORKOUT"
                    label="Start Workout"
                    icon={Timer}
                    current={currentView}
                    onClick={setCurrentView}
                    link="live-workout"
                />
                <NavItem
                    view="EXERCISES"
                    label="Exercises"
                    icon={NotebookTabs}
                    current={currentView}
                    onClick={setCurrentView}
                    link="exercises"
                />
            </nav>

            {isAuthenticated && user && (
                <div className="sidebar__footer">
                    <Link>
                        <button
                            onClick={() => setCurrentView("PROFILE")}
                            className={`user-profile ${currentView === "PROFILE" ? "user-profile--active" : ""}`}
                        >
                            <div className="user-profile__avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-profile__info">
                                <p className="user-profile__name">{user.name}</p>
                                <p className="user-profile__email">{user.email}</p>
                            </div>
                        </button>
                    </Link>
                    <div className="sidebar__divider" />
                    <div className="sidebar__logout">
                        <button onClick={handleLogout}>
                            <LogOut />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
            {!isAuthenticated && (
                <div className="sidebar__footer">
                    <div className="sidebar__login">
                        <Link to="/login">
                            <button onClick={() => setCurrentView("")}>
                                <LogIn />
                                <span>Sign In</span>
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
