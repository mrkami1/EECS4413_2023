import React from "react";
import { db, auth } from "../../firebase";
import ItemDetails from "./Item";

// Ying
// for ItemMini components display according to filter/sort/?search
export default function Products() {
    return (
        <div>
            <>
                1. picture, description, price, add to cart. 2. try-on by upload
                picture. 3. customer review display section
            </>
        </div>
    );
}