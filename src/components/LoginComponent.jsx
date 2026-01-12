import { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, Link } from "react-router-dom";

const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const credentials = { email, password };

        AuthService.login(credentials).then((res) => {
            console.log("Login Successful!");

            const token = res.data.accessToken;
            localStorage.setItem("token", token);

            navigate("/home");
        });
    };

    return (
        <div className="login__container">
            <div className="login__row">
                <div className="login__image">
                    <div className="image__overlay">
                        <h2>
                            Breaking PRs, <br /> Building strength
                        </h2>
                    </div>
                </div>
                <div className="login__form">
                    <h1>Login to your account</h1>
                    <div>
                        Don't have an account?
                        <Link to="/register">Sign Up</Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <input
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    placeholder="Enter your password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </form>
                        <button className="primary-btn" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
