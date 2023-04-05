import React, { useState } from "react";
import "../css/Main.css";
import { AllProducts } from "./view/AllProducts";
import { Button, Drawer } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

// main page for product display, ?profile review, ?cart display, ?order history, ?payment
export const Main = () => {

    return (
        <>
            <div className="wrapper">
                <Navbar />
                <Sidebar />
                <AllProducts type={"products"} />
            </div>
        </>
    );
};
