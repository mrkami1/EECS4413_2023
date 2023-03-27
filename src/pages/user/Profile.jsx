import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import  UserFieldsContext from "../../context/UserFieldsContext";
import { auth } from "../../firebase";
import Navbar from "../../components/Navbar";

// Mashhood
// for user profile card components
function Profile() {
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);

    return (
        <div>
            <Navbar />
            {userFields &&
                <>
                    <p>Name: {currentUser.displayName}</p>
                    <p>Email: {userFields.email.stringValue}</p>
                    <p>Account type: {userFields.level.stringValue}</p>
                    <p>Payment: {userFields.payment.stringValue}</p>
                    <p>Address: {userFields.shippingAddr.stringValue}</p>
                    <p>User ID: {userFields.userID.stringValue}</p>
                </>
            } 
        </div>
    );
}

export default Profile;
