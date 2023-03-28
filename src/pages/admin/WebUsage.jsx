import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Yang
export default function WebUsage() {
    const [users, setUsers] = useState({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsers({
                    ...users,
                    [user.uid]: { name: user.name, email: user.email },
                });
            } else {
                setUsers({});
            }
        });

        return unsubscribe;
    }, []);

    return (
        <div>
            <h1>Logged-in users:</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.uid}>{user.displayName}</li>
                ))}
            </ul>
        </div>
    );
}
