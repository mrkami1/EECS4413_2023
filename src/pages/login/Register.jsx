import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Box, Card, Button, CardContent, TextField, Typography } from "@mui/material";

function Register() {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const navigate = useNavigate();

    const handleInput = (e) => {
        const type = e.target.name;
        const value = e.target.value;
        switch (type) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirm":
                setConfirm(value);
                break;
            default:
                break;
        }
    };

    const createAccount = async () => {
        const level = "customer";
        const payment = {
            name: name,
            number: "",
            expiry: "",
            cvc: "",
        };
        const address = "";
        const cartItems = [];

        if (password !== confirm) {
            setErrorMessage("Passwords do not match");
            setError(true);
            return;
        }

        const nameRegex = /^[a-zA-Z0-9 ]{2,50}$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*]).{8,20}$/;

        if (!nameRegex.test(name)) {
            setErrorMessage("Account names must be 2-50 alphanumeric characters");
            setError(true);
            return;
        }

        if (!passwordRegex.test(password)) {
            setErrorMessage(
                "Password must be 8-20 characters, one upper case and lower case, and one of ~!@#$%^&*"
            );
            setError(true);
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userID = response.user.uid;
            await setDoc(doc(db, "users", response.user.uid), {
                userID,
                name,
                email,
                level,
                payment,
                address,
                cartItems,
                ordersCompleted: 0
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
            setErrorMessage("Email already in use or an error occurred");
            setError(true);
        }
    };

    const registerCard = () => (
        <Card
            variant="outlined"
            sx={{ positon: "absolute", maxWidth: 500, ml: "auto", mr: "auto", mt: "25vh" }}
        >
            <CardContent>
                <Box sx={{ m: 5 }}>
                    <Typography variant="h5" textAlign="center">
                        Register
                    </Typography>
                    <Typography variant="h6" textAlign="center">
                        Create your Glasses Account
                    </Typography>
                </Box>
                <Box sx={{ m: 5, gap: 3, display: "flex", flexDirection: "column" }}>
                    <TextField
                        type="text"
                        fullWidth
                        label="Account name"
                        name="name"
                        onChange={handleInput}
                    ></TextField>
                    <TextField
                        type="email"
                        fullWidth
                        label="Email"
                        name="email"
                        onChange={handleInput}
                    ></TextField>
                    <TextField
                        type="password"
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={handleInput}
                    ></TextField>
                    <TextField
                        type="password"
                        fullWidth
                        label="Confirm"
                        name="confirm"
                        onChange={handleInput}
                    ></TextField>
                    {error && (
                        <Typography color="error" variant="body1">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", ml: 5, mr: 5 }}>
                    <Button variant="text" onClick={() => navigate("/login")}>
                        Sign in instead
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!(email.length > 5 && password.length > 6)}
                        onClick={createAccount}
                    >
                        sign in
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return <div className="register-container">{registerCard()}</div>;
}

export default Register;
