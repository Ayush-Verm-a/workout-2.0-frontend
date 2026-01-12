import { useState } from "react";
import AuthService from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";

const RegisterComponent = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const fullName = `${firstName} ${lastName}`.trim();
        const user = { name: fullName, email, password };

        AuthService.register(user)
            .then((res) => {
                console.log("Registration Successful!");
                navigate("/login");
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="register__container">
            <div className="register__row">
                <div className="register__image">
                    <div className="image__overlay">
                        <h2>
                            Breaking PRs, <br /> Building strength
                        </h2>
                    </div>
                </div>
                <div className="register__form">
                    <h1>Create an account</h1>
                    <div>
                        Already have an account?
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <div className="name-row">
                                    <input
                                        placeholder="First name"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                    />
                                    <input
                                        placeholder="Last name"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

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
                            <button
                                className="primary-btn"
                                onClick={handleRegister}
                            >
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;
