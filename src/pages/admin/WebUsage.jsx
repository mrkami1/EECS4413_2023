import { useState, useEffect } from "react";
import { auth } from "../../firebase";
// Yang
function WebUsage() {
    const [users, setUsers] = useState([]);
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
