import { getDoc } from "firebase/firestore";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, setDoc, updateDoc, arrayUnion, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import UserFieldsContext from "../../context/UserFieldsContext";
import TryOn from "../../components/TryOn";
import { AuthContext } from "../../context/AuthContext";
import "../../css/ProductDetail.css";
import {
    Button,
    Box,
    Card,
    CardContent,
    IconButton,
    Typography,
    CardActions,
    TextField,
    MenuItem,
} from "@mui/material";
import { Star } from "@mui/icons-material";

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [rating, setRating] = useState("5");
    const [message, setMessage] = useState("");
    const [reviews, setReviews] = useState([]);

    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);

    const addToCart = async () => {
        const newItem = {
            image: product.img,
            itemID: id,
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
        }
    };

    useEffect(() => {
        const getReviews = async () => {
            if (currentUser && id) {
                const reviewsDoc = await getDoc(doc(db, "reviews", id));

                if (reviewsDoc.exists()) {
                    const r = reviewsDoc.data().customerReviews;
                    setReviews(r);
                } else {
                    //console.log("no doc exists");
                }
            }
        };
        
        getReviews();
        
    }, [currentUser, id]);

    //console.log(reviews);

    const createReview = async () => {
        const newReview = {
            date: Timestamp.now(),
            itemID: id,
            itemName: product.name,
            reviewerID: currentUser.uid,
            reviewerName: userFields?.name,
            message: message,
            rating: rating,
        };

        const reviewDoc = await getDoc(doc(db, "reviews", id));
        if (!reviewDoc.exists()) {
            await setDoc(doc(db, "reviews", id), {
                customerReviews: [],
            });
        }

        await updateDoc(doc(db, "reviews", id), {
            customerReviews: arrayUnion(newReview),
        }).then(() => {
            window.location.reload();
        });
    };

    function GetSpecifiedProduct() {
        useEffect(() => {
            const getProduct = async () => {
                const docSnap = await getDoc(doc(db, "products", id));
                let content = docSnap.data();
                setProduct({ ...content, newPrice: (content.price * (1 - content.discount / 100)).toFixed(2) });
            };
            getProduct();
        }, []);
        return product;
    }
    GetSpecifiedProduct();

    const productCard = () => (
        <Card
            sx={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 5,
                display: "flex",
                maxWidth: "70%",
            }}
            raised
        >
            <Box
                sx={{
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: "auto",
                    marginBottom: "auto",
                }}
            >
                <img src={product.img} loading="eager" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1" }}>
                    <Typography variant="h4">{product.name + " - " + product.color}</Typography>
                    <Typography variant="h5">{product.brand}</Typography>
                    <Typography variant="h6">{"CAD $" + product.newPrice}</Typography>
                    {product.discount !== 0 && (
                        <Typography variant="h6" style={{ textDecoration: "line-through" }}>
                            original: {product.price}
                        </Typography>
                    )}
                    <IconButton
                        size="small"
                        edge="start"
                        disabled
                        sx={{ "&:disabled": { color: "black" }, color: "black" }}
                    >
                        <Star sx={{ color: "#ffc400" }} />
                        {product.rate}
                    </IconButton>
                    <Typography variant="body1">{product.description}</Typography>
                </CardContent>
                <CardActions sx={{ marginBottom: 2 }}>
                    <Button variant="contained" onClick={addToCart}>
                        add to cart
                    </Button>
                    <TryOn imgSrc={product.img} imgName={product.name} />
                </CardActions>
            </Box>
        </Card>
    );

    const writeReviewCard = () => (
        <Card
            sx={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 5,
                maxWidth: "70%",
            }}
        >
            <CardContent>
                <Typography variant="h5" marginBottom={3}>
                    Review this product
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                    <TextField
                        label="Add a written review"
                        sx={{ flexGrow: 3 }}
                        multiline
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <TextField select label="Rating" value={rating} onChange={(e) => setRating(e.target.value)}>
                        <MenuItem value={5}>5 stars</MenuItem>
                        <MenuItem value={4}>4 stars</MenuItem>
                        <MenuItem value={3}>3 stars</MenuItem>
                        <MenuItem value={2}>2 stars</MenuItem>
                        <MenuItem value={1}>1 star</MenuItem>
                    </TextField>
                </Box>
            </CardContent>
            <CardActions>
                <Box sx={{ marginBottom: 1, marginRight: 1, marginLeft: "auto", display: "flex" }}>
                    <Button variant="contained" onClick={createReview}>
                        Submit
                    </Button>
                </Box>
            </CardActions>
        </Card>
    );

    const reviewsCard = () => (
        <>
            <Card
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 5,
                    maxWidth: "70%",
                }}
            >
                <CardContent>
                    <Box>
                        <Typography variant="h5" marginBottom={3}>
                            Customer reviews
                        </Typography>
                        {reviews?.map((r, i) => {
                            return (
                                <Box key={i} margin={2}>
                                    <Typography variant="h6">{r.reviewerName}</Typography>
                                    <IconButton
                                        size="small"
                                        edge="start"
                                        disabled
                                        sx={{ "&:disabled": { color: "black" }, color: "black" }}
                                    >
                                        <Star sx={{ color: "#ffc400" }} />
                                        {r.rating}
                                        &emsp;
                                        <Typography variant="body1">
                                            Reviewed on {r?.date?.toDate()?.toDateString()}
                                        </Typography>
                                    </IconButton>
                                    <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                                        {r.message}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </CardContent>
            </Card>
        </>
    );

    return (
        <div>
            <Navbar />
            {productCard()}
            {writeReviewCard()}
            {reviewsCard()}
        </div>
    );
};
