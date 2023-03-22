import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const validate = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            const response = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(response);
            navigate("/");
        } catch (error) {
            console.log(error);
            setError(true);
        }

        // Add analysis for db response in case of admin
    };

    return (
        // add admin redirection
        <div className="login-container">
            <div className="login-wrapper">
                <form onSubmit={validate}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    {error && (
                        <span
                            style={{
                                color: "rgb(200,100,100)",
                                fontSize: 14 + "px",
                                textAlign: "center",
                            }}
                        >
                            Invalid Email and or Password
                        </span>
                    )}
                    <input type="submit" />
                </form>
                <Link className="signin-instead" to={"/register"}>
                    Sign up instead
                </Link>
            </div>
        </div>
    );
}

export default Login;
