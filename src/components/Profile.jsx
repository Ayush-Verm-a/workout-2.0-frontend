import { Award, Mail, Shield, UserIcon } from "lucide-react";
import "../styles/profile-style.scss";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, isAuthenticated } = useSelector((store) => store.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/home");
        }
        console.log(user);
    }, [user, isAuthenticated]);

    return (
        <div className="profile">
            <header className="profile__header">
                <h2>My Profile</h2>
                <p>Manage your account settings and preferences.</p>
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
                                        <span className="stat-card__value">5</span>
                                        <span className="stat-card__label">
                                            Streak Days
                                        </span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card__icon stat-card__icon--level">
                                        <Shield />
                                    </div>
                                    <div>
                                        <span className="stat-card__value">Lvl 1</span>
                                        <span className="stat-card__label">
                                            Beginner
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
