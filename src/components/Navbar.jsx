import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import UserFieldsContext from "../context/UserFieldsContext";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Button, FormControl, IconButton, MenuItem, Select, TextField, Toolbar } from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";

function Navbar() {
    const { currentUser } = useContext(AuthContext);
    const { userFields } = useContext(UserFieldsContext);

    const [userTitle, setUserTitle] = useState("Your Account");
    const [itemCount, setItemCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        if (currentUser) {
            signOut(auth).then(() => {
                window.location.reload();
            });
        }
    };

    const goToCart = () => {
        navigate("/user/cart");
    };

    const goToPage = (e) => {
        const val = e.target.value;

        if (currentUser) {
            switch (val) {
                case "home":
                    navigate("/");
                    break;
                case "profile":
                    navigate("/user/profile");
                    break;
                case "orders":
                    navigate("/user/orderhistory");
                    break;
                case "wishlist":
                    navigate("/user/wishlist");
                    break;
                case "admin":
                    navigate("/admin/portal");
                    break;
                case "flyer":
                    navigate("/flyer");
                    break;
                case "signout":
                    logout();
                    break;
                default:
                    break;
            }
        } else if (!currentUser && val === "home") {
            navigate("/");
        } else navigate("/login");
    };

    useEffect(() => {
        if (currentUser !== null && Object.keys(currentUser).length !== 0) {
            setUserTitle(currentUser.displayName);
        }

        if (userFields) {
            setItemCount(userFields.cartItems.length);
        }
    }, [currentUser, userFields]);

    const [input, setInput] = useState("");

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar
                    sx={{ justifyContent: "space-between", backgroundColor: "#cfcfcf", color: "black" }}
                >
                    <Button
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="home"
                        aria-haspopup="true"
                        sx={{ mr: 2 }}
                        variant="text"
                        onClick={() => navigate("/")}
                    >
                        Glasses
                    </Button>
                    <TextField 
                        label="Search" 
                        variant="outlined" 
                        size="small" 
                        sx={{
                            input: {width: "50vw"}
                        }}
                    >
                    </TextField>
                    <FormControl>
                        <Select 
                            value="userTitle"
                            size="small"
                            onChange={goToPage}
                            fullWidth
                        >
                            <MenuItem value="userTitle" disabled>{userTitle}</MenuItem>
                            <MenuItem value="profile">Your Profile</MenuItem>
                            <MenuItem value="orders">Your Orders</MenuItem>
                            {currentUser && <MenuItem value="signout">Sign out</MenuItem>}
                            {!currentUser && <MenuItem value="signin">Sign in</MenuItem>}
                            {userFields?.level === "admin" && <MenuItem value="admin">Admin Portal</MenuItem>}
                        </Select>
                    </FormControl>
                    <IconButton onClick={goToCart}>
                        <ShoppingCart />
                        {itemCount}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </>
    );

    /*
    return (
        <div className="navbar-container">
            <ul className="navbar-items">
                <li>
                    <button className="site-button" onClick={goToPage} value="home">
                        Glasses Website
                    </button>
                </li>
                <li>
                    {location.pathname !== "/flyer" && (
                        <button onClick={goToPage} value="flyer">
                            Check our flyer!
                        </button>
                    )}
                </li>
                <li>
                    {location.pathname === "/" && (
                        <div>
                            <input type="text" placeholder="Search by Brand / Color" onChange={handleChange}></input>

                            <a href={`/search/${input}`}>
                                <button className="details-btn">Search</button>
                            </a>
                        </div>
                    )}
                </li>
                <li>
                    <select onChange={goToPage} defaultValue="name">
                        <option value="name" disabled>
                            {userTitle}
                        </option>
                        <option value="profile">Your Profile</option>
                        <option value="orders">Your Orders</option>
                        <option value="wishlist">Your Wishlist</option>
                        {userFields?.level === "admin" && <option value="admin">Admin Portal</option>}
                        {currentUser && <option value="signout">Sign out</option>}
                        {!currentUser && <option value="signin">Sign in</option>}
                    </select>
                </li>
                <li>{location.pathname === "/user/profile" && <button onClick={logout}>Sign out</button>}</li>
                <li>
                    <button onClick={goToCart}>
                        <i className="fi fi-bs-shopping-cart"></i>
                        {itemCount}
                    </button>
                </li>
            </ul>
        </div>
    );*/
}

export default Navbar;
