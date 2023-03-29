import React from "react";
import '../css/Main.css'
import { TempNavbar } from "./view/TempNavbar";
import { Products } from "./view/Products";
import { AllProducts } from "../components/AllProducts";

// main page for product display, ?profile review, ?cart display, ?order history, ?payment
export const Main = () => {
    return (
        <div className = 'wrapper'>
            <TempNavbar />
            <AllProducts type={'products'}/>
        </div>
    );
}
