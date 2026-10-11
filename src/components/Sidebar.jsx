import { BicepsFlexed } from "lucide-react";
import {
  LayoutDashboard,
  Dumbbell,
  Timer,
  NotebookTabs,
  LogOut,
  LogIn,
  Bot,
  CalendarDays,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../styles/sidebar-style.scss";
import { useDispatch, useSelector } from "react-redux";

const PATH_TO_VIEW = {
  "/feed": "FEED",
  "/workouts": "WORKOUTS",
  "/live-workout": "STARTWORKOUT",
  "/workout-plan": "WORKOUTPLAN",
  "/exercises": "EXERCISES",
  "/ai-coach": "AICOACH",
  "/profile": "PROFILE",
};

const NavItem = ({ view, label, icon: Icon, current, link }) => {
  return (
    <Link to={`/${link}`}>
      <button
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
  const location = useLocation();
  const currentView = PATH_TO_VIEW[location.pathname] || "";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(AuthService.logout());
    navigate("/home");
  };

  return (
    <>
      <div className="sidebar__mobile-header">
        <Link to="/" className="brand">
          <BicepsFlexed />
          <span>Workout App</span>
        </Link>
        {isAuthenticated && user && (
          <div className="actions">
            <Link to="/profile">
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut />
            </button>
          </div>
        )}
        {!isAuthenticated && (
           <div className="actions">
             <Link to="/login">
               <LogIn />
             </Link>
           </div>
        )}
      </div>
      <aside className="sidebar">
      <Link to="/">
        <div className="sidebar__header">
          <div className="sidebar__icon">
            <BicepsFlexed />
          </div>
          <span>Workout App</span>
        </div>
      </Link>

      <nav className="sidebar__nav">
        <NavItem view="FEED" label="Feed" icon={LayoutDashboard} current={currentView} link="feed" />
        <NavItem view="WORKOUTS" label="Workouts" icon={Dumbbell} current={currentView} link="workouts" />
        <NavItem view="STARTWORKOUT" label="Start Workout" icon={Timer} current={currentView} link="live-workout" />
        <NavItem view="WORKOUTPLAN" label="Workout Plan" icon={CalendarDays} current={currentView} link="workout-plan" />
        <NavItem view="EXERCISES" label="Exercises" icon={NotebookTabs} current={currentView} link="exercises" />
        <NavItem view="AICOACH" label="AI Coach" icon={Bot} current={currentView} link="ai-coach" />
      </nav>

      {isAuthenticated && user && (
        <div className="sidebar__footer">
          <Link to="/profile">
            <button
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
              <button>
                <LogIn />
                <span>Sign In</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </aside>
    </>
  );
};

export default Sidebar;
