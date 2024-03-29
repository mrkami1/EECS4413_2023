import { arrayUnion, doc, updateDoc, Timestamp, getDoc, setDoc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import UserFieldsContext from "../../context/UserFieldsContext";
import { db } from "../../firebase";
import { uuidv4 } from "@firebase/util";
import Navbar from "../../components/Navbar";
import { Alert, Button, Card, CardContent, Dialog, DialogTitle, Paper, Snackbar, Typography } from "@mui/material";
import { Box } from "@mui/system";

// for customer payment components
function Checkout() {
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);
    const [checkout, setCheckout] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(false);
    const [tempError, setTempError] = useState(false);
    const [cardError, setCardError] = useState(false);
    const [expiry, setExpiry] = useState(false);
    const [alertType, setAlertType] = useState("error");
    const [alertMsg, setAlertMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (userFields) {
            setCheckout(userFields.cartItems);
            const isExpired = userFields.payment.expiry < new Date().toISOString().split("T")[0];
            setExpiry(isExpired);
        }
    }, [userFields]);

    useEffect(() => {
        let totalCost = 0;
        checkout.forEach((item) => {
            totalCost += item.price * item.quantity;
        });
        setTempError(checkout.length === 0);
        setError(userFields?.address === "" || userFields?.payment.number === "" || userFields?.payment.expiry === "" || userFields?.payment.cvc === "")
        setTotal((Math.round(totalCost * 100) / 100).toFixed(2));
    }, [checkout]);

    const order = async () => {

        const completedOrder = {
            orderID: uuidv4(),
            customerID: currentUser.uid,
            date: Timestamp.now(),
            items: checkout,
            total: total,
        };

        const orderDoc = await getDoc(doc(db, "orders", currentUser.uid));

        if (!orderDoc.exists()) {
            await setDoc(doc(db, "orders", currentUser.uid), {
                customerOrders: [],
            });
        }

        await updateDoc(doc(db, "users", currentUser.uid), {
            ordersCompleted: userFields.ordersCompleted + 1
        })
        .then(async () => {
            const totalOrders = userFields.ordersCompleted;
            if (totalOrders % 3 === 0 && totalOrders !== 0) {
                setCardError(true);
                setTempError(true)
                setAlertType("error");
                setAlertMsg("Card declined or there was an error!")
            }
            else {
                await updateDoc(doc(db, "orders", currentUser.uid), {
                    customerOrders: arrayUnion(completedOrder),
                })
                .then(emptyCart);
            }
        });
    };

    const emptyCart = async () => {    
        await updateDoc(doc(db, "users", currentUser.uid), {
            cartItems: [],
        })
        .then(() => {
            setCardError(true);
            setTempError(true);
            setAlertType("success");
            setAlertMsg("Order complete!")
        });
    };

    const titleCard = () => (
        <Card sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }} raised>
            <CardContent>
                <Box sx={{ m: 2, borderBottom: "1px solid lightgray" }}>
                    <Typography variant="h4">Shipping address</Typography>
                    <Typography variant="h6" sx={{ wordBreak: "break-word", mb: 2 }}>
                        {userFields?.address.address}
                    </Typography>
                    {userFields?.address === "" &&
                        <Typography color="error" variant="h6" sx={{ wordBreak: "break-word", mb: 2 }}>
                            Address not set
                        </Typography>
                    }
                </Box>
                <Box sx={{ m: 2, mt: 4, borderBottom: "1px solid lightgray" }}>
                    <Typography variant="h4">Payment method</Typography>
                    <Typography variant="h6">{userFields?.payment.name}</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Card ending in{" "}
                        {userFields?.payment.number.substring(
                            userFields?.payment.number.length - 4
                        )}
                    </Typography>
                    {userFields?.payment.number === "" &&
                        <Typography color="error" variant="h6" sx={{ wordBreak: "break-word", mb: 2 }}>
                            Card not set
                        </Typography>
                    }
                    {expiry && (
                        <Typography variant="body1" sx={{ mb: 2 }} color="error">
                            Card expired or invalid
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    const itemCard = () => (
        <Card sx={{ mt: 5, ml: "auto", mr: "auto", maxWidth: "70%" }}>
            <CardContent>
                <Box sx={{ m: 2, mb: 4, borderBottom: "1px solid lightgray" }}>
                    <Typography variant="h4">Review items</Typography>
                </Box>
                {checkout.map((item, i) => {
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
                        </Paper>
                    );
                })}
                <Box sx={{ m: 2, mt: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        TOTAL : CAD ${total}
                    </Typography>
                    {error &&
                        <Typography color="error" variant="body1" sx={{ fontWeight: "bold" }}>
                            Invalid payment method or shipping address
                        </Typography>
                    }
                    <Button disabled={error || tempError} onClick={order} variant="contained" sx={{ mt: 2 }}>
                        Place your order
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    const cardSnackbar = () => (
        <Snackbar
            open={cardError}
            autoHideDuration={6000}
            onClose={() => setCardError(false)}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        >   
            <Alert severity={alertType} variant="filled">
                {alertMsg}
            </Alert>
        </Snackbar>
    )

    return (
        <div>
            <Navbar />
            {titleCard()}
            {itemCard()}
            {cardSnackbar()}
        </div>
    );
}

export default Checkout;
