import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {

    const { currentUser } = useContext(AuthContext);
    const [titleName, setTitleName] = useState("Sign in");

    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        signOut(auth);
    };

    const goToProfile = () => {
        if (currentUser) navigate("user/profile");
        else navigate("/login");
    }

    useEffect(() => {
        
        if (currentUser !== null && Object.keys(currentUser).length !== 0) {
            setTitleName(currentUser.displayName)
        }
    }, [currentUser])

    console.log(currentUser)

    return (
        <div className="navbar-container">
            <ul className="navbar-items">
                <li>{location.pathname === "/" && <input type='text' placeholder="Search"></input>}</li>
                <li>{location.pathname === "/" && <button onClick={goToProfile}>{titleName}</button>}</li>
                <li>{location.pathname === "/user/profile" && <button onClick={logout}>Sign out</button>}</li>
            </ul>
        </div>
    );
}

export default Navbar;
