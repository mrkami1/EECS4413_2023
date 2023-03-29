import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { collection, getDoc, doc } from "@firebase/firestore";


const UserFieldsContext = createContext();

export function UserFieldsProvider({children}) {
    const [userFields, setUserFields] = useState();
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        
        const getFields = async () => {
            try {
                const docSnap = await getDoc(doc(db, "users", currentUser.uid))

                if (docSnap.exists()) {
                    setUserFields(docSnap._document.data.value.mapValue.fields);
                }
            }
            catch (error) {
                
            }
        }

        return () => {
            if (currentUser) getFields();
        } 

    }, [currentUser])

    return (
        <UserFieldsContext.Provider value={{userFields}}>
            {children}
        </UserFieldsContext.Provider>
    );
}

export default UserFieldsContext;