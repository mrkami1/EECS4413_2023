import React, { useState } from "react";
import "../css/Main.css";
import { AllProducts } from "./view/AllProducts";
import { Button, Drawer } from "@mui/material";
import { Menu } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Chatbot } from "../components/Chatbot";

// main page for product display, ?profile review, ?cart display, ?order history, ?payment
export const Main = () => {

    const [sortType, setSortType] = useState("NameDescending");
    const [search, setSearch] = useState("");
    const [filterColor, setFilterColor] = useState("")
    const [filterRate, setFilterRate] = useState("")
    const [filterBrand, setFilterBrand] = useState("")
    const [filterPrice, setFilterPrice] = useState("")


    return (
        <>
            <div className="wrapper">
                <Navbar search={search} setSearch={setSearch} />
                <Sidebar sortType={sortType} setSortType={setSortType} 
                         filterColor={filterColor} setFilterColor={setFilterColor}
                         filterRate={filterRate} setFilterRate={setFilterRate}
                         filterBrand={filterBrand} setFilterBrand={setFilterBrand}
                         filterPrice={filterPrice} setFilterPrice={setFilterPrice}/>
                <AllProducts type={"products"} sortType={sortType} search={search} 
                             filterColor={filterColor} setFilterColor={setFilterColor}
                             filterRate={filterRate} setFilterRate={setFilterRate}
                             filterBrand={filterBrand} setFilterBrand={setFilterBrand}
                             filterPrice={filterPrice} setFilterPrice={setFilterPrice}/>
                <div className="chatbot_container">
                    <Chatbot />
                </div>                
            </div>
        </>
    );
};
