import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Product from "./Product";
import Navbar from "../../components/Navbar";

//Ying
//list all the products with sort functionality
export const AllProducts = (props) => {
    console.log("the type is: " + props.type);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = () => {
            const productsArray = [];
            const path = `${props.type}`;
            // console.log("this is: "+path)
            getDocs(collection(db, path))
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        productsArray.push({ ...doc.data(), id: doc.id });
                        console.log(doc.id, " => ", doc.data());
                    });
                    setProducts(productsArray);
                })
                .catch((error) => {
                    console.log(error.message);
                });
        };
        getProducts();
    }, []);

    //   const [sortState, setSortState] = useState("Sort Products");
    //   console.log("products: "+products)
    //   products.forEach((product)=>{
    //     console.log("product: "+product.id)
    //   })

    // sort price low to hight
    const numAscending = [...products].sort((a, b) => a.price - b.price);

    // sort price high to low
    const numDescending = [...products].sort((a, b) => b.price - a.price);

    // sort name a - z
    const strAscending = [...products].sort((a, b) => (a.name > b.name ? 1 : -1));

    // sort name z - a
    const strDescending = [...products].sort((a, b) => (a.name > b.name ? -1 : 1));

    const onSelect = (e) => {
        const val = e.target.value;

        switch (val) {
            case "Sort Product":
                break;
            case "PriceAscending":
                setProducts(numAscending);
                break;
            case "PriceDescending":
                setProducts(numDescending);
                break;
            case "NameAscending":
                setProducts(strAscending);
                break;
            case "NameDescending":
                setProducts(strDescending);
                break;
            default:
                break;
        }
    };

    return (
        <div className="allproduct">
            <div>
                <select onChange={onSelect} defaultValue="Sort Product">
                    <option value="Sort Product">Sort Products</option>
                    <option value="PriceAscending">Sort Price from Low to High</option>
                    <option value="PriceDescending">Sort Price from high to Low</option>
                    <option value="NameAscending">Sort Name from A to Z</option>
                    <option value="NameDescending">Sort Name from Z to A</option>
                </select>
            </div>
            <div className="heading">
                <p>results for {props.type}</p>
            </div>
            <div className="allproduct-container">
                {products.map((product) => (
                    <Product key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};
