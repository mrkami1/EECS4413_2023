import { updateDoc, doc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import UserFieldsContext from "../../context/UserFieldsContext";
import { db } from "../../firebase";
import { Card, CardContent, Paper, Typography, Button, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { Delete } from "@mui/icons-material";

// Anubhav
// for customer cart components

function Cart() {
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState();

    useEffect(() => {
        if (userFields) {
            setItems(userFields.cartItems);
        }
    }, [userFields]);

    useEffect(() => {
        if (items) {
            let total = 0;

            if (items.length > 0) {
                items.forEach((item) => {
                    total += item.price * item.quantity;
                });
            }

            setTotal((Math.round(total * 100) / 100).toFixed(2));
        }
    }, [items]);

    const deleteItem = async (e, id) => {
        const deleteID = id;
        let updatedItems = [];
        if (deleteID) {
            items.forEach((item) => {
                if (item.itemID !== deleteID) {
                    updatedItems.push(item);
                }
            });
            await updateDoc(doc(db, "users", currentUser.uid), {
                cartItems: updatedItems,
            }).then(() => {
                setItems(updatedItems);
                console.log("deleted item");
            });
        }
    };

    const titleCard = () => (
        <Card sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }} raised>
            <CardContent>
                <Typography variant="h4">Your Cart</Typography>
            </CardContent>
        </Card>
    );

    const itemsCard = () => (
        <Card sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }}>
            <CardContent>
                {items.map((item, i) => {
                    return (
                        <Paper
                            key={i}
                            elevation={3}
                            sx={{
                                margin: 2,
                                display: "flex",
                                flexDirection: "row",
                                ":hover": { boxShadow: 10 },
                                minHeight: 200,
                            }}
                        >
                            <img src={item.image} style={{ margin: 20 }} />
                            <Box sx={{ flex: "1", margin: 2 }}>
                                <Typography variant="h4">{item.name}</Typography>
                                <Typography variant="body1">Quantity : {item.quantity}</Typography>
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    CAD ${item.price}
                                </Typography>
                            </Box>
                            <Box sx={{m: 2, mt: "auto"}} >
                                <IconButton size="large" onClick={(e) => deleteItem(e, item.itemID)}>
                                    <Delete fontSize="large" />
                                </IconButton>
                            </Box>
                        </Paper>
                    );
                })}
                <Box sx={{ ml: 2, mt: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        TOTAL : CAD ${total}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/view/checkout")}
                        sx={{ mt: 2 }}
                        disabled={items.length === 0}
                    >
                        Checkout
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <div>
            <Navbar />
            {titleCard()}
            {itemsCard()}
        </div>
    );
}

export default Cart;
