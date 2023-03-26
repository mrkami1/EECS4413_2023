import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase";

// Mashhood
// for user profile card components
function Profile() {

    const { currentUser } = useContext(AuthContext);

    return (
        <div>
            <p>this is the profile page of {currentUser.displayName}</p>
        </div>
    );
}

export default Profile;
