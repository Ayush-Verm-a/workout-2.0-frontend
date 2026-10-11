import { useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import { useLocation, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail } from "lucide-react";
import "../styles/login-style.scss";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError } from "../store/slices/userSlice";

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated, error } = useSelector((store) => store.user);
    const redirectTo = location.state?.from || "/feed";

    const handleLogin = (e) => {
        e.preventDefault();
        setSubmitting(true);
        dispatch(AuthService.login({ email, password }))
            .catch(() => {})
            .finally(() => setSubmitting(false));
    };

    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectTo]);

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
                <form className="auth-card__form" onSubmit={handleLogin}>
                    {error && <div className="form-error">{error}</div>}
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
                            />
                        </div>
                    </div>
                    <button className="btn-auth" type="submit" disabled={submitting}>
                        {submitting ? "Signing in…" : "Login"}
                        <ArrowRight />
                    </button>
                </form>

                <div className="auth-card__footer">
                    <p className="auth-card__footer-text">
                        Don't have an account?{" "}
                        <button type="button" onClick={() => navigate("/register")}>
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
