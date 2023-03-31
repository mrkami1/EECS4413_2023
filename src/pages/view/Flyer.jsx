import React, { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { collection, orderBy, getDocs, doc, getDoc, Timestamp } from "firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";

// Yang
// for flyer components

// Individual Product card, showing product properties.
// Admin can change its current discout for later submission
function ProductBlock({ product, isAdmin, handleDiscount, handleDelete }) {
    const [discount, setDiscount] = useState(product.discount);
    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => {
        if (e.target.value > 100) {
            setDiscount(100);
        } else if (e.target.value < 1) {
            setDiscount(1);
        } else {
            setDiscount(e.target.value);
        }
        setDisabled(e.target.value === product.discount);
    };

    const handleClick = (e) => {
        setDiscount(discount);
        setDisabled(true);
        handleDiscount(discount);
    };

    const removeProd = () => {};

    return (
        <div>
            <h3>{product.name}</h3>
            <p>Expire on {product.expire.toDate().toDateString()}</p>
            <img src={product.img} alt={product.name} width={150} height={90} />
            <p>Original price: {product.price}</p>
            {isAdmin && (
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>Discount (%): </label>
                    <input type="number" value={discount} step={1} min={1} max={100} onChange={handleChange} />
                    <button onClick={handleClick} disabled={disabled}>
                        update
                    </button>
                </form>
            )}
            <p>Discounted price: {(product.price * (1 - discount / 100)).toFixed(2)}</p>
            {isAdmin && <button onClick={handleDelete}>Delete Item</button>}
            <hr />
            <hr />
        </div>
    );
}

// A single add-new product block for admin use
function NewBlock({ handleAddItem }) {
    const [id, setId] = useState("");
    console.log("from newblock " + id);
    return (
        <div>
            <h3>Add new flyer item here</h3>
            <form>
                <label>For sale new product id: </label>
                <input onChange={(e) => setId(e.target.value)} />
                <button onClick={() => handleAddItem(id)}>Add new item</button>
            </form>
        </div>
    );
}

function Flyer({ isAdmin }) {
    const [updated, setUpdated] = useState(false);
    const [onSale, setOnSale] = useState([]);
    const [error, setError] = useState("");
    // let months = ["Jan", "Feb", "Mar", "Apri", "May", "Jun",
    //     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    console.log("from flyer");
    console.log(onSale);

    useEffect(() => {
        const currentFlyer = [];
        getDocs(collection(db, "flyer"), orderBy("name"))
            .then((snapShots) => {
                snapShots.forEach((doc) => {
                    currentFlyer.push(doc.data());
                });
                setOnSale(currentFlyer);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, []);

    const [time, setTime] = useState(() => {
        if (onSale.length) {
            console.log(onSale);
            return onSale[0].expire.toDate();
        } else {
            return new Date();
        }
    });

    const [year, setYear] = useState(time.getFullYear());
    const [mon, setMon] = useState(time.getMonth() + 1);
    const [day, setDay] = useState(time.getDate());

    const updateTime = (e) => {
        e.preventDefault();
        setTime(Timestamp.fromDate(new Date(year, mon - 1, day)));
    };

    const addNewItem = (id) => {
        getDoc(doc(db, "products", id))
            .then((shot) => {
                if (shot.exists()) {
                    const newItem = shot.data();
                    if (!onSale.some((item) => item.id === newItem.id)) {
                        console.log("got some new item: => " + id);
                        setOnSale([
                            ...onSale,
                            {
                                discount: newItem.discount,
                                expire: newItem.expire,
                                id: newItem.id,
                                img: newItem.img,
                                name: newItem.name,
                                price: newItem.price,
                            },
                        ]);
                    } else {
                        setError("This new item exists!");
                    }
                } else {
                    setError("This item ID doesn't exist!");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const updateDiscout = () => {};

    const removeItem = () => {};

    const saveAbove = () => {
        getDocs(collection(db, "flyer"));
    };

    return (
        <>
            <div>
                <h2>Glasses on Sale!</h2>
                <div>
                    <h3>Valid until:</h3>
                    <form>
                        <label>Year: </label>
                        {isAdmin ? <input value={year} onChange={(e) => setYear(e.target.value)} /> : year}
                        <label> Month: </label>
                        {isAdmin ? <input value={mon} onChange={(e) => setMon(e.target.value)} /> : mon}
                        <label> Day: </label>
                        {isAdmin ? <input value={day} onChange={(e) => setDay(e.target.value)} /> : day}
                        {isAdmin && <button onClick={updateTime}>Update Expiration</button>}
                    </form>
                </div>
                <hr />
                <ol>
                    {onSale.map((prod, index) => (
                        <li key={index}>
                            <ProductBlock
                                product={prod}
                                isAdmin={isAdmin}
                                handleDiscount={updateDiscout}
                                handleDelete={removeItem}
                            />
                        </li>
                    ))}
                </ol>
                {isAdmin && <NewBlock handleAddItem={addNewItem} />}
                {error && <p>{error}</p>}
            </div>
            <hr />
            {isAdmin && <button onClick={saveAbove}>Save Updates</button>}
            <hr />
        </>
    );
}

export default function FlyersShow() {
    const { userFields } = useContext(UserFieldsContext);
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <Flyer isAdmin={userFields?.level === "admin"} />
        </div>
    );
}
