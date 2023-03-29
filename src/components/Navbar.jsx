import React, { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {

    const { currentUser } = useContext(AuthContext);
    const [userTitle, setUserTitle] = useState("Your Account");

    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        if (currentUser) {
            signOut(auth)
            .then(() => {
                window.location.reload();
            })
        }
    };

    const goToPage = (e) => {
        const val = e.target.value;

        if (currentUser) {
            switch (val) {
                case "home": navigate("/"); break; 
                case "profile": navigate("/user/profile"); break; 
                case "orders": navigate("/user/orderhistory"); break;
                case "wishlist": navigate("/user/wishlist"); break;
                case "signout": logout(); break;
                default: break;
            }
        }
        else navigate("/login");
    }

    useEffect(() => {
        
        if (currentUser !== null && Object.keys(currentUser).length !== 0) {
            setUserTitle(currentUser.displayName)
        }
    }, [currentUser])

    console.log(currentUser)

    return (
        <div className="navbar-container">
            <ul className="navbar-items">
                <li><button className="site-button" onClick={goToPage} value="home">Glasses Website</button></li>
                <li>{location.pathname === "/" && <input type='text' placeholder="Search"></input>}</li>
                <li>
                    <select onChange={goToPage} defaultValue="name">
                        <option value="name" disabled>{userTitle}</option>
                        <option value="profile">Your Profile</option>
                        <option value="orders">Your Orders</option>
                        <option value="wishlist">Your Wishlist</option>
                        {currentUser && <option value="signout">Sign out</option>}
                        {!currentUser && <option value="signin">Sign in</option>}
                    </select>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;
