import { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail, UserIcon } from "lucide-react";
import "../styles/login-style.scss";
import { useDispatch, useSelector } from "react-redux";

const RegisterComponent = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { isAuthenticated } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegister = (e) => {
        e.preventDefault();
        const user = { name: userName, email, password };

        dispatch(AuthService.register(user));
        navigate("/login");
    };

    return (
        <div className="auth-page">
            <div className="auth-page__bg-1" />
            <div className="auth-page__bg-2" />
            <div className="auth-card">
                <div className="auth-card__header">
                    <div className="auth-card__icon">
                        <Activity />
                    </div>
                    <h1 className="auth-card__title">Workout App</h1>
                    <p className="auth-card__subtitle">Start your fitness journey today.</p>
                </div>
                <form className="auth-card__form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="form-input">
                            <UserIcon />
                            <input
                                type="text"
                                value={userName}
                                placeholder="John Doe"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="form-input">
                            <Mail />
                            <input
                                type="email"
                                value={email}
                                placeholder="your@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="form-input">
                            <Lock />
                            <input
                                type="password"
                                value={password}
                                placeholder="*********"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn-auth" onClick={handleRegister}>
                        Create Account
                        <ArrowRight />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="auth-card__footer-text">
                        Already have an account?{" "}
                        <button onClick={() => navigate("/login")}>
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
