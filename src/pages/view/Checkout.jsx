import { arrayUnion, doc, updateDoc, Timestamp, getDoc, setDoc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import UserFieldsContext from "../../context/UserFieldsContext";
import { db } from "../../firebase";
import { uuidv4 } from "@firebase/util";
import Navbar from "../../components/Navbar";

// for customer payment components
function Checkout() {
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);
    const [checkout, setCheckout] = useState([]);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (userFields) {
            setCheckout(userFields.cartItems);
        }
    }, [userFields]);

    useEffect(() => {
        let totalCost = 0;
        checkout.forEach((item) => {
            totalCost += item.price * item.quantity;
        });

        setTotal(totalCost);
    }, [checkout]);

    const order = async () => {
        if (userFields?.address === "" || userFields?.payment === "") {
            setError(true);
            return;
        }

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

        await updateDoc(doc(db, "orders", currentUser.uid), {
            customerOrders: arrayUnion(completedOrder),
        }).then(emptyCart);
    };

    const emptyCart = async () => {
        await updateDoc(doc(db, "users", currentUser.uid), {
            cartItems: [],
        }).then(() => {
            console.log("completed order");
            navigate("/");
        });
    };

    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div>
                <p>Shipping address: {userFields?.address.address}</p>
                <p>Payment method: {userFields?.payment.number}</p>
                <p>Review items: </p>
                <br />
                {checkout.map((item) => {
                    return (
                        <div key={item.itemID}>
                            <p>Item image: {item.image}</p>
                            <p>Item name: {item.name}</p>
                            <p>Item ID: {item.itemID}</p>
                            <p>Price: {item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <br />
                        </div>
                    );
                })}
                <p>Order Total: {total}</p>
                <button onClick={order}>Place your order</button>
                {error && <p>Invalid shipping address or payment method</p>}
            </div>
        </div>
    );
}

export default Checkout;
