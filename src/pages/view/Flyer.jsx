import React, { useState } from "react";
import { db, auth } from "../../firebase";
import { ProfileCard } from "../user/Profile";
import { query, collection, orderBy, getDocs } from "firebase/firestore";

// Yang
// for flyer components

function ProductBlock(product) {
    const prodID = product.name + "_discount";
    const [discount, setDiscount] = useState(product.discount);

    const handleChange = (event) => {
        setDiscount(event.target.value);
    };

    return (
        <div>
            <h3>{product.name}</h3>
            <img
                url={product.url}
                alt={product.name}
                width={100}
                height={100}
            />
            <p>Original price: {product.price}</p>
            <form>
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
                <button type="submit" onClick={setDiscount(discount)}>
                    update
                </button>
            </form>
            <br />
            <p>Discounted price: {product.price * (1 - discount / 100)}</p>
            <hr />
            <button onClick={removeProd}>delete &#x1f5d1</button>
        </div>
    );
}

function NewBlock() {
    return (
        <div>
            <h3>Add new flyer item here</h3>
            <form>
                <label>SKU</label>
                <input />
                <button type></button>
            </form>
        </div>
    );
}

function Flyer({ saleItems }) {
    return (
        <>
            <ul>
                {saleItems.map((prod) => (
                    <li key={prod.sku}>
                        <ProductBlock {...prod} />
                    </li>
                ))}
                <li key="blank">
                    <NewBlock />
                </li>
            </ul>
            <button>Save all changes</button>
        </>
    );
}

export default async function FlyersShow() {
    const q = query(collection(db, "flyer"), orderBy("name"));
    const docs = await getDocs(q);
    var saleItems = [];
    docs.forEach((doc) => {
        saleItems.push(doc.data());
    });

    const user = auth.currentUser;
    return (
        <>
            <ProfileCard></ProfileCard>
            <Flyer saleItems={saleItems} />
            <hr />
            <button onClick={saveAbove}>Save Updates</button>
        </>
    );
}

function addSalesItem(sku, newPrice) {}
