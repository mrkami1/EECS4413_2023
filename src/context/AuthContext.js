import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const userState = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => {
            userState();
        };
    }, []);

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
