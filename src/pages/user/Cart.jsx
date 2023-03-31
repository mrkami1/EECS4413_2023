import { updateDoc, doc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import UserFieldsContext from "../../context/UserFieldsContext";
import { db } from "../../firebase";

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

            setTotal(total);
        }
    }, [items]);

    const deleteItem = async (e) => {
        const deleteID = e.target.name;

        let updatedItems = [];
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
    };

    return (
        <div>
            <Navbar />
            Current items in cart:
            {items.map((item) => {
                return (
                    <div key={item.itemID}>
                        <p>Item image: {item.image}</p>
                        <p>Item name: {item.name}</p>
                        <p>Item ID: {item.itemID}</p>
                        <p>Price: {item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={deleteItem} name={item.itemID}>
                            Delete
                        </button>
                        <br />
                    </div>
                );
            })}
            <p>Total: {total}</p>
            <button onClick={() => navigate("/view/checkout")}>Checkout</button>
        </div>
    );
}

export default Cart;
