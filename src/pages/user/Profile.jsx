import React, { useContext, useEffect, useState } from "react";
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

    const [showEdit, setShowEdit] = useState(false);
    const [newFields, setNewFields] = useState({})
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPayment, setNewPayment] = useState("");
    const [newAddress, setNewAddress] = useState("");

    const editProfile = () => {
        setShowEdit(true)
    }

    const saveProfile = () => {
        setShowEdit(false)

        
    }

    const updateFields = (e) => {
        switch (e.target.name) {
            case "name": setNewName(e.target.value); break;
            case "email": setNewEmail(e.target.value); break;
            case "payment": setNewPayment(e.target.value); break;
            case "address": setNewAddress(e.target.value); break;
        }
    }

    useEffect(() => {
        setNewFields({
            name: newName,
            email: newEmail,
            payment: newPayment,
            address: newAddress
        })
    }, [newName, newEmail, newPayment, newAddress])

    console.log(newFields)

    return (
        <div>
            <Navbar />
            {userFields &&
                <>
                    <p>
                        Name: {currentUser?.displayName}
                        {showEdit && <input type='text' placeholder="New name" name="name" onChange={updateFields}></input>}
                    </p>
                    <p>
                        Email: {userFields.email?.stringValue}
                        {showEdit && <input type='text' placeholder="New email" name="email" onChange={updateFields}></input>}
                    </p>
                    <p>Account type: {userFields.level?.stringValue}</p>
                    <p>
                        Payment: {userFields.payment?.stringValue}
                        {showEdit && <input type='text' placeholder="New payment" name="payment" onChange={updateFields}></input>}
                    </p>
                    <p>
                        Address: {userFields.shippingAddr?.stringValue}
                        {showEdit && <input type='text' placeholder="New address" name="address" onChange={updateFields}></input>}
                    </p>
                    <p>User ID: {userFields.userID?.stringValue}</p>
                </>
            }
            {!showEdit && <button onClick={editProfile}>Edit profile</button>}
            {showEdit && <button onClick={saveProfile}>Save</button>}
            {showEdit && <button onClick={() => setShowEdit(false)}>Cancel</button>}
        </div>
    );
}

export default Profile;
