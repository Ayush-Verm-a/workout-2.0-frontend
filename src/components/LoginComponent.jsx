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
            <div className="row">
                <div className="card">
                    <h3>Login</h3>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </form>
                        <button onClick={handleLogin}>Login</button>
                        <div>
                            <Link to="/register">
                                Don't have an account? Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
