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
                className={`navitem ${current === view ? "navitemactive" : "navitemnotactive"}`}
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

    const profileClick = () => {};

    const handleLogout = () => {
        setCurrentView("");
        dispatch(AuthService.logout());
        navigate("/home");
    };

    return (
        <aside className="sidebar__container">
            <Link to="/" onClick={() => setCurrentView("")}>
                <div className="sidebar__head">
                    <div className="icon">
                        <BicepsFlexed />
                    </div>
                    <span>Workout App</span>
                </div>
            </Link>

            <nav className="sidebar__navcontainer">
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
                <div className="sidebar__usercontainer">
                    <Link>
                        <button
                            onClick={() => setCurrentView("PROFILE")}
                            className={`navuser ${currentView === "PROFILE" ? "navuseractive" : ""}`}
                        >
                            <div className="navusericon">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="navuserdetail">
                                <p className="navusername">{user.name}</p>
                                <p className="navuseremail">{user.email}</p>
                            </div>
                        </button>
                    </Link>
                    <div className="navuserdivider" />
                    <div className="navlogout">
                        <button onClick={handleLogout}>
                            <LogOut />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
            {!isAuthenticated && (
                <div className="sidebar__usercontainer">
                    <div className="navlogin">
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
