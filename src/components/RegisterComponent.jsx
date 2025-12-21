import { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

const RegisterComponent = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const user = { name, email, password };

        AuthService.register(user)
            .then((res) => {
                console.log("Registration Successful!");
                navigate("/login");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="register__container">
            <div className="row">
                <div className="card">
                    <h3>Sign Up</h3>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
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
                            <button onClick={handleRegister}>Register</button>
                            <div>
                                <Link to="/login">
                                    Already have an account? Login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
