import React from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth";

// Mashhood
// for user profile card components
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

// detailed user profile display & edit on-site
export default function Profile() {
    return <div></div>;
}
