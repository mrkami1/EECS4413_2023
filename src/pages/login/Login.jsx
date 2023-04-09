import React, { useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import { Box, display } from "@mui/system";

function Login() {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleInput = (e) => {
        const type = e.target.name;
        const value = e.target.value;
        switch (type) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const validate = async (e) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            navigate("/");
        } catch (error) {
            console.log(error);
            setError(true);
        }
    };

    const loginCard = () => (
        <Card
            variant="outlined"
            sx={{ positon: "absolute", maxWidth: 500, ml: "auto", mr: "auto", mt: "25vh" }}
        >
            <CardContent>
                <Box sx={{ m: 5 }}>
                    <Typography variant="h5" textAlign="center">
                        Sign in
                    </Typography>
                    <Typography variant="h6" textAlign="center">
                        Use your Glasses Account
                    </Typography>
                </Box>
                <Box sx={{ m: 5, gap: 3, display: "flex", flexDirection: "column" }}>
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
                    {error && (
                        <Typography color="error" variant="body1" textAlign="center">
                            Invalid email and or password
                        </Typography>
                    )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", ml: 5, mr: 5 }}>
                    <Button variant="text" onClick={() => navigate("/register")}>
                        Create an account
                    </Button>
                    <Button
                        variant="contained"
                        disabled={!(email.length > 5 && password.length > 6)}
                        onClick={validate}
                    >
                        sign in
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return <div className="login-container">{loginCard()}</div>;
}

export default Login;
