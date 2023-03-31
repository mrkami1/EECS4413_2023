// Mashhood
// for customer purchase history components
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";

function OrderHistory() {

    const { currentUser } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const getOrders = async () => {
            if (currentUser.uid) {
                const orderDoc = await getDoc(doc(db, "orders", currentUser.uid))
                if (orderDoc.exists()) {
                    setOrders(orderDoc.data().customerOrders);
                }
            }
        }

        return () => {
            getOrders();
        }
    }, [currentUser])

    const cancelOrder = async (e) => {
        console.log(e.target.name)

        orders.splice(e.target.name, 1);
        
        if (currentUser.uid) {
            await updateDoc(doc(db, "orders", currentUser.uid), {
                customerOrders: orders
            })
            .then(() => {
                window.location.reload();
            })
        }
    }

    console.log(orders)
    return (
        <div>
            <Navbar />
            <h1>Order history</h1>
            {
                orders?.map((o, i) => {
                    return (
                        <div key={i}>
                            <hr />
                            <h2>Order {i+1}</h2>
                            <div>
                                {
                                    o.items?.map((item, k) => {
                                        return (
                                            <div key={k}>
                                                <h3>Item {k+1}</h3>
                                                <img src={item.image} width={250} height={150}></img>
                                                <p>Item id: {item.itemID}</p>
                                                <p>Name: {item.name}</p>
                                                <p>Quantity: {item.quantity}</p>
                                                <p>Price: {item.price}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <h3>Ordered on: {o.date.toDate().toDateString()}</h3>
                            <h3>Order total: {o.total}</h3>
                            <button name={i} onClick={cancelOrder}>Cancel order</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OrderHistory;
