import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const userState = onAuthStateChanged(auth, (user) => {
            getDoc(doc(db, "users", user.uid)).then(doc=>{
                let isAdmin = doc.exists() && doc.data().level === "admin";
                setCurrentUser({ ...user, isAdmin: isAdmin });
            }).catch((error)=>{console.log(error.message)})
        });

        return ()=>{userState();};
    }, []);

    console.log("running authcontext..")
    console.log(currentUser)
    return <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>;
};
