import React from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";

// for user profile page components
export function ProfileCard() {
    return (
        <div>
            // top left or right corner?
            <div>// display user/admin name</div>
            <Link>// link to show detailed profile page</Link>
            <button>// logout</button>
        </div>
    );
}

export default function Profile() {
    return <div></div>;
}
