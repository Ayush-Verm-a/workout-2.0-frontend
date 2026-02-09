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
        if(isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated]);

    return (
        <div className="login__container">
            <div className="bg1" />
            <div className="bg2" />
            <div className="authbody">
                <div className="bodytop">
                    <div className="icon">
                        <Activity />
                    </div>
                    <h1 className="topheader">Workout App</h1>
                    <p className="topcopy">Welcome back! Ready to crush it?</p>
                </div>
                <form className="bodycred">
                    <div className="credcontainer">
                        <label>Email</label>
                        <div className="cred">
                            <Mail />
                            <input
                                type="email"
                                value={email}
                                placeholder="your@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="credcontainer">
                        <label>Password</label>
                        <div className="cred">
                            <Lock />
                            <input
                                type="password"
                                value={password}
                                placeholder="*********"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="auth-btn" onClick={handleLogin}>
                        Login
                        <ArrowRight />
                    </button>
                </form>

                <div className="bodybottom">
                    <p className="bottomcopy">
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
