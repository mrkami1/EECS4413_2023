import React from "react";
import { db, auth } from "../../firebase";
import { ProfileCard } from "../users/Profile";
// for item detail components

export default function ItemView() {
    return (
        <div>
            <ProfileCard></ProfileCard>
            <>
                1. picture, description, price, add to cart. 2. try-on by upload
                picture. 3. customer review display section
            </>
        </div>
    );
}
