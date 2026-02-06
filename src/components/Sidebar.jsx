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
    const [currentView, setCurrentView] = useState("");
    const isAuth = AuthService.getCurrentUser();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        UserService.getProfile()
            .then((res) => {
                setUser(res.data);
                console.log(res.data);
            })
            .catch((err) => console.error(err));
    }, [isAuth]);

    const profileClick = () => {};

    const handleLogout = () => {
        setCurrentView("");
        setUser(null);
        AuthService.logout();
        navigate("/login");
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

            {isAuth && user && (
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
            {!isAuth && (
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
