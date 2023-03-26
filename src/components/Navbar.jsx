import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = async () => {
        signOut(auth);
    };

    const goToProfile = () => {
        navigate("user/profile");
    }

    return (
        <div className="navbar-container">
            <ul className="navbar-items">
                <li><input type='text' placeholder="Search"></input></li>
                <li><button onClick={goToProfile}>{currentUser.displayName}</button></li>
                <li><button onClick={logout}>Log out</button></li>
            </ul>
        </div>
    );
}

export default Navbar;
