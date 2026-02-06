import { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail, UserIcon } from "lucide-react";
import "../styles/login-style.scss";

const RegisterComponent = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const user = { name: userName, email, password };

        AuthService.register(user)
            .then((res) => {
                console.log("Registration Successful!");
                navigate("/login");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="register__container">
            <div className="bg1" />
            <div className="bg2" />
            <div className="authbody">
                <div className="bodytop">
                    <div className="icon">
                        <Activity />
                    </div>
                    <h1 className="topheader">Workout App</h1>
                    <p className="topcopy">Start your fitness journey today.</p>
                </div>
                <form className="bodycred">
                    <div className="credcontainer">
                        <label>Full Name</label>
                        <div className="cred">
                            <UserIcon />
                            <input
                                type="text"
                                value={userName}
                                placeholder="John Doe"
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                    </div>
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
                    <button className="auth-btn" onClick={handleRegister}>
                        Create Account
                        <ArrowRight />
                    </button>
                </form>

                <div className="bodybottom">
                    <p className="bottomcopy">
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
