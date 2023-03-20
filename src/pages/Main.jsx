import React, { useContext, useEffect } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore';

function Main() {

    const {currentUser} = useContext(AuthContext);

    const logout = async () => {
        signOut(auth);
    }

    return (
        <div>
            <h1>Welcome to the main page, {currentUser.displayName} </h1>
            <button onClick={logout}>Log out</button>
        </div>
    )
}

export default Main
