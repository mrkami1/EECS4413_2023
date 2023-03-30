import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import UserFieldsContext from "../../context/UserFieldsContext";

// Anubhav
// for customer cart components

function Cart() {
    const { userFields } = useContext(UserFieldsContext)
    const navigate = useNavigate();
    
    const [items, setItems] = useState([])
    const [total, setTotal] = useState();

    useEffect(() => {
        if (userFields) {
            setItems(userFields.get("cartItems"))
        }
    }, [userFields])

    useEffect(() => {
        if (items) {
            let total = 0;

            if (items.length > 0) {
                items.forEach((item) => {
                    total += (item.price * item.quantity);
                })
            }
    
            setTotal(total)
        }
    }, [items])

    return (
        <div>
            <Navbar />
            Current items in cart:
            {
                items.map((item) => {
                    return (
                        <div key={item.itemID}>
                            <p>Item image: {item.image}</p>
                            <p>Item name: {item.name}</p>
                            <p>Item ID: {item.itemID}</p>
                            <p>Price: {item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <br />
                        </div>
                    )
                })
            }
            <p>Total: {total}</p>
            <button onClick={() => navigate("/view/checkout")}>Check out</button>
        </div>
    );
}

export default Cart