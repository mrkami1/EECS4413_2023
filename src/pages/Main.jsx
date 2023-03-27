import React from "react";
import '../css/Main.css'
import { Navbar } from "./view/Navbar";
import { Products } from "./view/Products";

// main page for product display, ?profile review, ?cart display, ?order history, ?payment
export const Main = () => {
    return (
        <div className = 'wrapper'>
            <Navbar />
            <Products />
        </div>
    );
}
