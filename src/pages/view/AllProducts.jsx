import React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { arrayUnion, doc, updateDoc } from "@firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";
import { ImageList, ImageListItem, ImageListItemBar, Paper, Button } from "@mui/material";
import { Star } from "@mui/icons-material";

//Ying
//list all the products with sort functionality
export const AllProducts = (props) => {
    console.log("this is the prop: "+props.sortType);
    console.log("rate: "+props.filterRate+" "+typeof(props.filterRate))
    console.log("the type is: " + props.type);
    const [products, setProducts] = useState([]);
    const [priceRange, setPriceRange] = useState(true);
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
                        let content = doc.data();
                        productsArray.push({
                            ...content,
                            id: doc.id,
                            newPrice: (content.price * (1 - content.discount / 100)).toFixed(2),
                        });
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
    const numAscending = [...products].sort((a, b) => a.newPrice - b.newPrice);

    // sort price high to low
    const numDescending = [...products].sort((a, b) => b.newPrice - a.newPrice);

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
    }, [props?.sortType]);


    function priceCondition(price, value) { // handle price filter
        if (value.includes("1")) {
            return (price < 25);
        }
        else if (value.includes("2")) {
            return ((price >= 25) && (price <= 50));
        }
        else if (value.includes("3")) {
            return ((price >= 50) && (price <= 100));
        }
        else if (value.includes("4")) {
            return (price >= 100);
        }
        else {
            return true;
        }
    }


    const addToCart = async (product) => {
        const newItem = {
            image: product.img,
            itemID: product.id,
            name: product.name,
            price: product.newPrice,
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
    }, [props.search]);

    console.log(products);
    const imageList = () => (
        <ImageList cols={3} sx={{ margin: 3 }}>
            {products?.map(
                (product, i) =>
                    product.name.toLowerCase().includes(props?.search) && 
                    product.color.toLowerCase().includes(props?.filterColor) &&
                    product.brand.toLowerCase().includes(props?.filterBrand) &&
                    product.rate.toString().includes(props?.filterRate) &&
                    priceCondition(product.price, props?.filterPrice) && 
                    (
                        <Paper key={i} elevation={3} sx={{ margin: 2, ":hover": { boxShadow: 10 } }}>
                            <ImageListItem sx={{ margin: 5 }}>
                                <img
                                    src={product.img}
                                    alt={product.name}
                                    loading="eager"
                                    onClick={() => navigate("/product/" + product.id)}
                                    style={{ cursor: "pointer" }}
                                />
                                <ImageListItemBar title={product.name} subtitle={product.brand} position="below" />
                                <ImageListItemBar
                                    title={"CAD $" + product.newPrice}
                                    subtitle={
                                        product.discount !== 0 && (
                                            <p style={{ display: "inline", textDecoration: "line-through" }}>
                                                original ${product.price}
                                            </p>
                                        )
                                    }
                                    position="below"
                                />
                                <ImageListItemBar
                                    title={product.rate}
                                    actionIcon={<Star sx={{ color: "#ffc400" }} />}
                                    actionPosition="left"
                                    position="below"
                                    sx={{ lineHeight: "3" }}
                                />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button variant="outlined" onClick={() => addToCart(product)}>
                                        add to cart
                                    </Button>
                                    &emsp;
                                    <Button variant="outlined">try on</Button>
                                </div>
                            </ImageListItem>
                        </Paper>
                    )
            )}
        </ImageList>
    );

    return (
        <div className="allproduct">
            <div className="allproduct-container">{imageList()}</div>
        </div>
    );
};
