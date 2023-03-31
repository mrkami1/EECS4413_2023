import React from "react";
import "../css/Main.css";
import { AllProducts } from "./view/AllProducts";

// main page for product display, ?profile review, ?cart display, ?order history, ?payment
export const Main = () => {
    return (
        <div className="wrapper">
            <AllProducts type={"products"} />
        </div>
    );
};
