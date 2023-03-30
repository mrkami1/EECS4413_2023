import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Yang
// keep track of all the users who log in our system and display
export default function WebUsage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("at webusage: user" + user.name);
            if (user && !users.some((u) => u.id === user.uid)) {
                setUsers([
                    ...users,
                    {
                        id: user.uid,
                        name: user.name,
                        email: user.email,
                    },
                ]);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <div>
            <h1>Web usage</h1>
            <h2>Logged-in users:</h2>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>
                        {u.name}, {u.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}
