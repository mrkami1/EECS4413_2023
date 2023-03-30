import React, { useContext, useState } from "react";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { query, collection, orderBy, getDocs, addDoc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";

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
            <img url={product.url} alt={product.name} width={100} height={100} />
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
                    <button onClick={() => setDiscount(discount)} disabled={discount === product.discount}>
                        update
                    </button>
                </form>
            )}
            <hr />
            <p>Discounted price: {(product.price * (1 - discount / 100)).toFixed(2)}</p>
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
                <label htmlFor="">New on sale product id: </label>
                <input />
                <button onClick={handleAddItem}></button>
            </form>
        </div>
    );
}

async function Flyer({ isAdmin }) {
    const q1 = query(collection(db, "flyer"), orderBy("name"));
    const docs = await getDocs(q1);
    const saleItems = docs.map((doc) => doc.data());
    const endOfDay = { hour: 23, minute: 59, second: 59 };

    const [updated, setUpdated] = useState(false);
    const [onSale, setOnSale] = useState(saleItems);
    const [time, setTime] = useState(() => {
        if (saleItems) return saleItems[0].expire.toDate();
        else return new Date();
    });
    // todo
    const addSalesItem = (id, newPrice) => {};
    const removeItem = () => {};
    const saveAbove = () => {};
    return (
        <>
            <div>
                <ul>
                    {onSale.map((prod) => (
                        <li key={prod.id}>
                            <ProductBlock product={prod} isAdmin={isAdmin} handleDelete={removeItem} />
                        </li>
                    ))}
                    {isAdmin && (
                        <li key="blank">
                            <NewBlock handleAddItem={addSalesItem} />
                        </li>
                    )}
                </ul>
            </div>
            <br />
            <div>
                <h3>Valid until:</h3>
                <form>
                    <label>Year: </label>
                    <input placeholder={time.getFullYear()} />
                    <label>Month: </label>
                    <input placeholder={time.getMonth()} />
                    <label>Day: </label>
                    <label placeholder={time.getDate()} />
                    <button>Update Expiration</button>
                </form>
            </div>
            <hr />
            {isAdmin && (
                <button onClick={saveAbove} disabled={updated}>
                    Save Updates
                </button>
            )}
        </>
    );
}

export default function FlyersShow() {
    const { user } = useContext(UserFieldsContext);
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <Flyer isAdmin={user.isAdmin} />
        </div>
    );
}
