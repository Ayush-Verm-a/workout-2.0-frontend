import { Award, Mail, Shield, UserIcon } from "lucide-react";
import "../styles/profile-style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import WorkoutService from "../services/WorkoutService";

const Profile = () => {
    const { user } = useSelector((store) => store.user);
    const { workouts } = useSelector((store) => store.workout);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(WorkoutService.getAllWorkouts());
    }, [dispatch]);

    const stats = useMemo(() => {
        const total = workouts.length;
        const uniqueDays = new Set(
            workouts
                .map((w) => w.date && new Date(w.date).toISOString().slice(0, 10))
                .filter(Boolean),
        );
        const level = Math.max(1, Math.floor(total / 5) + 1);
        return { total, uniqueDays: uniqueDays.size, level };
    }, [workouts]);

    return (
        <div className="profile">
            <header className="profile__header">
                <h2>My Profile</h2>
                <p>Your account and training snapshot.</p>
            </header>
            <div className="profile__body">
                <div className="profile__cover">
                    <div className="profile__cover-overlay"></div>
                </div>

                <div className="profile__main">
                    <div className="profile__title-section">
                        <div className="profile__title-inner">
                            <div className="profile__avatar">
                                <div className="profile__avatar-inner">
                                    <span>
                                        {user && user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="profile__title-info">
                                <h3>{user && user.name}</h3>
                                <p>Free user</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile__content">
                        <div className="account-details">
                            <h4 className="account-details__header">Account details</h4>
                            <div className="account-details__body">
                                <div className="account-details__field">
                                    <label>Full Name</label>
                                    <div className="account-details__value">
                                        <UserIcon />
                                        <span>{user && user.name}</span>
                                    </div>
                                </div>
                                <div className="account-details__field">
                                    <label>Email Address</label>
                                    <div className="account-details__value">
                                        <Mail />
                                        <span>{user && user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="stats-section">
                            <h4 className="stats-section__header">
                                Stats & Achievements
                            </h4>
                            <div className="stats-section__body">
                                <div className="stat-card">
                                    <div className="stat-card__icon stat-card__icon--streak">
                                        <Award />
                                    </div>
                                    <div>
                                        <span className="stat-card__value">{stats.total}</span>
                                        <span className="stat-card__label">
                                            Workouts logged
                                        </span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__icon stat-card__icon--level">
                                        <Shield />
                                    </div>
                                    <div>
                                        <span className="stat-card__value">Lvl {stats.level}</span>
                                        <span className="stat-card__label">
                                            {stats.uniqueDays} active days
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
