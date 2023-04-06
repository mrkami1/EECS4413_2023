import React from "react";
import { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "@firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";
import Product from "./Product";
import Navbar from "../../components/Navbar";
import { ImageList, ImageListItem, ImageListItemBar, Card, Paper, Button } from "@mui/material";

//Ying
//list all the products with sort functionality
export const AllProducts = (props) => {
    console.log("the type is: " + props.type);
    const [products, setProducts] = useState([]);
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

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

    useEffect(() => {
        switch (props.sortType) {
            case "PriceAscending":
                setProducts(numAscending);
                break;
            case "PriceDescending":
                setProducts(numDescending);
                break;
            case "NameAscending":
                setProducts(strDescending);
                break;
            case "NameDescending":
                setProducts(strAscending);
                break;
            default:
                break;
        }
    }, [props?.sortType])

    const addToCart = async (product) => {
        const newItem = {
            image: product.img,
            itemID: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        };

        if (userFields && currentUser) {
            let currentItems = userFields.cartItems;
            let itemInCart = false;

            currentItems.forEach(async (item) => {
                if (item.itemID === newItem.itemID) {
                    item.quantity += 1;
                    itemInCart = true;
                }
            });

            if (!itemInCart) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: arrayUnion(newItem),
                })
                    .then(() => {
                        console.log("added new item to cart");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: currentItems,
                })
                    .then(() => {
                        console.log("updated item quantity");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } else {
            navigate("/login");
        }
    };

    useEffect(() => {
        if (props.search) {

        }
    }, [props.search])

    console.log(products)
    const imageList = () => (
        <ImageList cols={3} sx={{margin: 3}}>
            {products?.map((product, i) => (
                product.name.toLowerCase().includes(props?.search) && 
                <Paper
                    key={i} 
                    elevation={3} 
                    sx={{margin: 2, ':hover': {boxShadow: 10}}}
                >
                    <ImageListItem sx={{margin: 5}}>
                        <img 
                            src={product.img}
                            alt={product.name}
                            loading="lazy"
                            onClick={() => navigate("/product/" + product.id)}
                            style={{cursor: "pointer"}}
                        />
                        <ImageListItemBar
                            title={product.name}
                            subtitle={product.brand}
                            position="below"
                        />
                        <ImageListItemBar
                            title={"CAD $" + product.price}
                            position="below"
                        />
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button variant="outlined" onClick={() => addToCart(product)}>add to cart</Button>
                            &emsp;
                            <Button variant="outlined">try on</Button>
                        </div>
                    </ImageListItem>
                </Paper>
            ))}
        </ImageList>
    )

    return (
        <div className="allproduct">
            <div className="allproduct-container">
                {imageList()}
            </div>
        </div>
    );
};
