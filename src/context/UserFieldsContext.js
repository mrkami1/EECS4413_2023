import { createContext, useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { doc, onSnapshot } from "@firebase/firestore";

const UserFieldsContext = createContext();

export function UserFieldsProvider({ children }) {
    const [userFields, setUserFields] = useState();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        if (currentUser?.uid) {
            const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
                setUserFields(doc.data());
            });
            return () => {
                if (currentUser.uid) {
                    unsub();
                    console.log("updated");
                }
            };
        }
    }, [currentUser]);

    return <UserFieldsContext.Provider value={{ userFields }}>{children}</UserFieldsContext.Provider>;
}

export default UserFieldsContext;
