import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail, UserIcon } from "lucide-react";
import "../styles/login-style.scss";
import { useDispatch, useSelector } from "react-redux";

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((store) => store.user);

    const handleLogin = (e) => {
        e.preventDefault();
        const credentials = { email, password };

        dispatch(AuthService.login(credentials));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated]);

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
                    <p className="auth-card__subtitle">Welcome back! Ready to crush it?</p>
                </div>
                <form className="auth-card__form">
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
                    <button className="btn-auth" onClick={handleLogin}>
                        Login
                        <ArrowRight />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="auth-card__footer-text">
                        Don't have an account?{" "}
                        <button onClick={() => navigate("/register")}>
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
