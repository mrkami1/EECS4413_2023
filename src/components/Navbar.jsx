import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        signOut(auth);
    };

    const goToProfile = () => {
        navigate("user/profile");
    }

    return (
        <div className="navbar-container">
            <ul className="navbar-items">
                <li>{location.pathname === "/" && <input type='text' placeholder="Search"></input>}</li>
                <li>{location.pathname === "/" && <button onClick={goToProfile}>{currentUser.displayName}</button>}</li>
                <li>{location.pathname === "/user/profile" && <button onClick={logout}>Sign out</button>}</li>
            </ul>
        </div>
    );
}

export default Navbar;
