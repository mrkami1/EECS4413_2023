import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

// Yang
// keep track of all the users who log in our system and display
export default function WebUsage() {
    const [users, setUsers] = useState([]);
    // console.log(users);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // console.log("at webusage: user");
            // console.log(user);
            if (user && !users.some((u) => u.id === user.uid)) {
                setUsers([
                    ...users,
                    {
                        id: user.uid,
                        name: user.displayName,
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
            <h2>Logged-in users: {users.length}</h2>
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
