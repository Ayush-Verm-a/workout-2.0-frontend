import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail, UserIcon } from "lucide-react";
import "../styles/login-style.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../store/slices/userSlice";

const RegisterComponent = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { error } = useSelector((store) => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    const handleRegister = (e) => {
        e.preventDefault();
        setSubmitting(true);
        dispatch(AuthService.register({ name: userName, email, password }))
            .then(() => navigate("/login", { replace: true }))
            .catch(() => {})
            .finally(() => setSubmitting(false));
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
                <form className="auth-card__form" onSubmit={handleRegister}>
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="form-input">
                            <UserIcon />
                            <input
                                type="text"
                                value={userName}
                                placeholder="John Doe"
                                onChange={(e) => setUserName(e.target.value)}
                                required
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
                                required
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
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                    <button className="btn-auth" type="submit" disabled={submitting}>
                        {submitting ? "Creating…" : "Create Account"}
                        <ArrowRight />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="auth-card__footer-text">
                        Already have an account?{" "}
                        <button type="button" onClick={() => navigate("/login")}>
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
