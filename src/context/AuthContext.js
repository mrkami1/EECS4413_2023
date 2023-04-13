import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const userState = onAuthStateChanged(auth, (user) => {
            user ? setCurrentUser(user) : setCurrentUser(null);
        });

        if (auth.currentUser) {
            console.log("from authContext if");
            console.log(auth.currentUser);

            setCurrentUser(auth.currentUser);
        }

        return () => {
            if (userState) {
                userState();
            }
        };
    }, []);

    useEffect(() => {
        console.log("from authContext");
        console.log(currentUser);
    }, [auth.currentUser]);

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
