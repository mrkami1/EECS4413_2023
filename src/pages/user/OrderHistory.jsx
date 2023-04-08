// Mashhood
// for customer purchase history components
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { Button, Box, Card, CardContent, Paper, Typography } from "@mui/material";

function OrderHistory() {
    const { currentUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            if (currentUser.uid) {
                const orderDoc = await getDoc(doc(db, "orders", currentUser.uid));
                if (orderDoc.exists()) {
                    setOrders(orderDoc.data().customerOrders);
                }
            }
        };

        return () => {
            getOrders();
        };
    }, [currentUser]);

    const cancelOrder = async (e) => {
        console.log(e.target.name);

        orders.splice(e.target.name, 1);

        if (currentUser.uid) {
            await updateDoc(doc(db, "orders", currentUser.uid), {
                customerOrders: orders,
            }).then(() => {
                window.location.reload();
            });
        }
    };

    const titleCard = () => (
        <Card sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }} raised>
            <CardContent>
                <Typography variant="h4">Your Orders</Typography>
            </CardContent>
        </Card>
    );

    const orderCard = () => (
        <>
            {orders?.map((o, i) => {
                return (
                    <Card key={i} sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }}>
                        <Typography variant="h6" sx={{ margin: 2 }}>
                            ORDER # {o.orderID}
                        </Typography>
                        {o.items?.map((item, k) => {
                            return (
                                <Paper
                                    key={k}
                                    sx={{
                                        margin: 2,
                                        display: "flex",
                                        flexDirection: "row",
                                        ":hover": { boxShadow: 10 },
                                        minHeight: 200,
                                    }}
                                    elevation={3}
                                >
                                    <img src={item.image} style={{ margin: 20 }} />
                                    <Box sx={{ flex: "1", margin: 2 }}>
                                        <Typography variant="h4">{item.name}</Typography>
                                        <Typography variant="body1">
                                            Quantity : {item.quantity}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                            CAD ${item.price}
                                        </Typography>
                                    </Box>
                                </Paper>
                            );
                        })}
                        <Box margin={2}>
                            <Typography variant="body1">
                                Order placed : {o.date.toDate().toDateString()}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                TOTAL : {o.total}
                            </Typography>
                            <Button
                                name={i}
                                onClick={cancelOrder}
                                variant="contained"
                                sx={{ mt: 5 }}
                            >
                                Cancel order
                            </Button>
                        </Box>
                    </Card>
                );
            })}
        </>
    );

    return (
        <div>
            <Navbar />
            {titleCard()}
            {orderCard()}
        </div>
    );
}

export default OrderHistory;
