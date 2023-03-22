import React from "react";
import { ProfileCard } from "../users/Profile";

// Anubhav
// for customer cart components

function CartItem({ item }) {
    // render each item
    return (
        <>
            <button>// delete item from cart</button>
        </>
    );
}

export function Cart() {
    var items; // item object list of this customer
    return (
        <>
            {items.map((item) => {
                <CartItem item={item}></CartItem>;
            })}
        </>
    );
}

export default function CartPage() {
    return (
        <div>
            <ProfileCard></ProfileCard>
            <Cart></Cart>
            <button>// link to redirect to payment pages</button>
        </div>
    );
}
