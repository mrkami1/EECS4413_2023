import React, { useContext, useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import UserFieldsContext from "../../context/UserFieldsContext";
import Navbar from "../../components/Navbar";

// Mashhood
// for user profile card components
function Profile() {
    const { currentUser } = useContext(AuthContext);
    const { userFields } = useContext(UserFieldsContext);

    const [showEdit, setShowEdit] = useState(false);
    const [newFields, setNewFields] = useState({});
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPayment, setNewPayment] = useState("");
    const [newAddress, setNewAddress] = useState("");

    const editProfile = () => {
        setShowEdit(true);
    };

    const saveProfile = async () => {
        await updateDoc(doc(db, "users", currentUser.uid), {
            email: newFields.email ? newFields.email : userFields.email,
            payment: newFields.payment ? newFields.payment : userFields.payment,
            address: newFields.address ? newFields.address : userFields.address,
        }).then(() => {
            updateProfile(auth.currentUser, {
                displayName: newFields.name ? newFields.name : userFields.displayName,
            })
                .then(() => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    };

    const updateFields = (e) => {
        switch (e.target.name) {
            case "name":
                setNewName(e.target.value);
                break;
            case "email":
                setNewEmail(e.target.value);
                break;
            case "payment":
                setNewPayment(e.target.value);
                break;
            case "address":
                setNewAddress(e.target.value);
                break;
        }
    };

    useEffect(() => {
        setNewFields({
            name: newName,
            email: newEmail,
            payment: newPayment,
            address: newAddress,
        });
    }, [newName, newEmail, newPayment, newAddress]);

    useEffect(() => {
        if (userFields) {
            setNewFields({
                name: userFields.name,
                email: userFields.email,
                payment: userFields.payment,
                address: userFields.address,
            });
        }
    }, [userFields]);
    console.log(userFields);
    return (
        <div>
            <Navbar />
            {userFields && (
                <>
                    <p>
                        Name: {userFields?.name}
                        {showEdit && (
                            <input type="text" placeholder="New name" name="name" onChange={updateFields}></input>
                        )}
                    </p>
                    <p>
                        Email: {userFields?.email}
                        {showEdit && (
                            <input type="text" placeholder="New email" name="email" onChange={updateFields}></input>
                        )}
                    </p>
                    <p>Account type: {userFields?.level}</p>
                    <p>
                        Payment: {userFields?.payment}
                        {showEdit && (
                            <input type="text" placeholder="New payment" name="payment" onChange={updateFields}></input>
                        )}
                    </p>
                    <p>
                        Address: {userFields?.address}
                        {showEdit && (
                            <input type="text" placeholder="New address" name="address" onChange={updateFields}></input>
                        )}
                    </p>
                    <p>User ID: {currentUser.uid}</p>
                </>
            )}
            {!showEdit && <button onClick={editProfile}>Edit profile</button>}
            {showEdit && <button onClick={saveProfile}>Save</button>}
            {showEdit && <button onClick={() => setShowEdit(false)}>Cancel</button>}
        </div>
    );
}

export default Profile;
