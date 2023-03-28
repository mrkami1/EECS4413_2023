import React, { useContext, useState } from "react";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import {
    query,
    collection,
    orderBy,
    getDocs,
    addDoc,
    getDoc,
    deleteDoc,
} from "firebase/firestore";
import { AuthContextProvider } from "../../context/AuthContext";

// Yang
// for flyer components

// Individual Product card, showing product properties.
// Admin can change its current discout for later submission
function ProductBlock({ product, isAdmin, handleDelete }) {
    const prodID = product.name + "_discount";
    const [discount, setDiscount] = useState(product.discount);

    const handleChange = (event) => {
        event.preventDefault();
        setDiscount(event.target.value);
    };

    const removeProd = () => {};

    return (
        <div>
            <h3>{product.name}</h3>
            <p>Expire on {product.expire}</p>
            <img
                url={product.url}
                alt={product.name}
                width={100}
                height={100}
            />
            <p>Original price: {product.price}</p>
            {isAdmin && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <label for={prodID}>Discount (%): </label>
                    <input
                        id={prodID}
                        type="number"
                        value={discount}
                        step={1}
                        min={1}
                        max={100}
                        onChange={handleChange}
                    />
                    <button
                        onClick={() => setDiscount(discount)}
                        disabled={discount == product.discount}
                    >
                        update
                    </button>
                </form>
            )}
            <hr />
            <p>
                Discounted price:{" "}
                {(product.price * (1 - discount / 100)).toFixed(2)}
            </p>
            {isAdmin && <button onClick={handleDelete}>delete &#x1f5d1</button>}
        </div>
    );
}

// A single add-new product block for admin use
function NewBlock({ handleAddItem }) {
    return (
        <div>
            <h3>Add new flyer item here</h3>
            <form>
                <label>SKU</label>
                <input />
                <button onClick={handleAddItem}></button>
            </form>
        </div>
    );
}

async function Flyer({ isAdmin }) {
    const q1 = query(collection(db, "flyer"), orderBy("name"));
    const docs = await getDocs(q1);
    var saleItems = [];
    docs.forEach((doc) => {
        saleItems.push(doc.data());
    });
    const [newSales, setNewSales] = useState(Array());
    // todo
    const addSalesItem = (sku, newPrice) => {};
    const removeItem = () => {};
    return (
        <>
            <ul>
                {saleItems.map((prod) => (
                    <li key={prod.sku}>
                        <ProductBlock
                            product={prod}
                            isAdmin={isAdmin}
                            handleDelete={removeItem}
                        />
                    </li>
                ))}
                {isAdmin && (
                    <li key="blank">
                        <NewBlock handleAddItem={addSalesItem} />
                    </li>
                )}
            </ul>
            <button>Save all changes</button>
        </>
    );
}

export default async function FlyersShow() {
    const user = useContext(AuthContextProvider);
    const q2 = query(collection(db, "users", user.uid));
    const doc1 = await getDoc(q2);
    const isAdmin = doc1.exists() && doc1.data().level === "admin";
    // Todo
    const saveAbove = () => {};
    return (
        <>
            <Navbar />
            <Flyer isAdmin={isAdmin} />
            <hr />
            {isAdmin && <button onClick={saveAbove}>Save Updates</button>}
        </>
    );
}
