import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const createAccount = async (e) => {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const confirm = e.target[3].value;

        const level = "customer";
        const payment = "";
        const address = "";

        if (password !== confirm) {
            setError(true);
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            const userID = response.user.uid;
            await setDoc(doc(db, "users", response.user.uid), {
                userID,
                name,
                email,
                level,
                payment,
                address,
            });

            await updateProfile(response.user, {
                displayName: name,
            })
                .then((res) => {
                    console.log(res);
                })
                .catch((error) => {
                    console.log(error);
                });

            navigate("/");
        } catch (error) {
            console.log(error);
            setError(true);
        }
    };

    return (
        <div className="register-container">
            <div className="register-wrapper">
                <form onSubmit={createAccount}>
                    <input type="text" placeholder="First name" />
                    <input type="text" placeholder="Last name" />
                    <input type="email" placeholder="Enter an email" />
                    <input type="password" placeholder="Create a password" />
                    <input type="password" placeholder="Confirm password" />
                    <input type="submit" />
                    {error && (
                        <span
                            style={{
                                color: "rgb(200,100,100)",
                                fontSize: 14 + "px",
                                textAlign: "center",
                            }}
                        >
                            Invalid credentials
                        </span>
                    )}
                </form>
                <Link className="signin-instead" to="/login">
                    Sign in instead
                </Link>
            </div>
        </div>
    );
}

export default Register;
