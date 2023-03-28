import { onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            setCurrentUser({ ...user, isAdmin: checkAdmin(user) });
        });

        return unSub;
    }, []);

    return (
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
};

async function checkAdmin(user) {
    const q = query(collection(db, "users", user.uid));
    const doc1 = await getDoc(q);
    return doc1.exists() && doc1.data().level === "admin";
}
