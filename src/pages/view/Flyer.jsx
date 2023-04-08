import React, { useContext, useEffect, useReducer, useState } from "react";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { collection, orderBy, getDocs, doc, getDoc, deleteDoc, Timestamp, addDoc, updateDoc } from "firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";
import { FlyerContext, FlyerDispatchContext } from "../../context/FlyerContext";

// Yang
// for flyer components

// Individual Product card, showing product properties.
// Admin can change its current discout or delete for later submission
function ProductBlock({ product, isAdmin }) {
    const [discount, setDiscount] = useState(product.discount === 0 ? 1 : product.discount);
    const [changed, setChanged] = useState(false);
    const dispatch = useContext(FlyerDispatchContext);

    const handleDiscChange = (e) => {
        if (e.target.value > 100) {
            setDiscount(100);
        } else if (e.target.value < 1) {
            setDiscount(1);
        } else {
            setDiscount(e.target.valueAsNumber);
        }
        setChanged(true);
    };

    const updateDiscout = () => {
        dispatch({ type: "change1", item: { ...product, discount: discount } });
    };

    const removeItem = () => {
        dispatch({ type: "delete", id: product.id });
    };

    // const exp = product.expire ? product.expire.toDate().toDateString() : new Date().toDateString();

    return (
        <div>
            <h3>{product.name}</h3>
            <p>Expire on {product.expire.toDate().toDateString()}</p>
            <img src={product.img} alt={product.name} width={150} height={90} />
            <p>Original price: {product.price}</p>
            {isAdmin && (
                <>
                    <label>Discount (%): </label>
                    <input type="number" value={discount} step={1} min={1} max={100} onChange={handleDiscChange} />
                    <button onClick={updateDiscout} disabled={discount === product.discount || !changed}>
                        update
                    </button>
                </>
            )}
            <p>Discounted price: {(product.price * (1 - discount / 100)).toFixed(2)}</p>
            {isAdmin && <button onClick={removeItem}>Delete Item</button>}
            <hr />
            <hr />
        </div>
    );
}

// A single add-new product block for admin use
function NewBlock({ timeStamp }) {
    const [error, setError] = useState("");
    const [id, setId] = useState("");
    const dispatch = useContext(FlyerDispatchContext);
    const onSale = useContext(FlyerContext);
    console.log("from newblock " + id);

    const addNewItem = async () => {
        const docRef = doc(db, "products", id);
        try {
            const snapShot = await getDoc(docRef);
            if (snapShot.exists()) {
                const newItem = snapShot.data();
                console.log(newItem);
                console.log(snapShot);
                if (!onSale.some((item) => item.id === newItem.id)) {
                    console.log("got some new item: => " + id);
                    dispatch({
                        type: "add",
                        item: {
                            discount: newItem.discount,
                            expire: timeStamp,
                            id: snapShot.id,
                            img: newItem.img,
                            name: newItem.name,
                            price: newItem.price,
                        },
                    });
                    setId("");
                } else {
                    setError("This new item exists!");
                }
            } else {
                setError("This item ID doesn't exist!");
            }
        } catch (e) {
            setError("Unknow error");
            console.log(e);
        }
    };
    return (
        <div>
            <label>Add new flyer item id:</label>
            <input placeholder="New item ID" value={id} onChange={(e) => setId(e.target.value)} />
            <button onClick={addNewItem} disabled={id === ""}>
                Add new item
            </button>
            <label disabled={error.length === 0}>{error}</label>
        </div>
    );
}

// Flyer item section
function Flyer({ isAdmin }) {
    const [updated, setUpdated] = useState(false);
    const [onSale, dispatch] = useReducer(saleReducer, []);
    const [time, setTime] = useState(() => {
        if (onSale.length) {
            console.log(onSale);
            return onSale[0].expire.toDate();
        } else {
            return new Date();
        }
    });
    console.log("from flyer");
    console.log(onSale);

    useEffect(() => {
        const currentFlyer = [];
        getDocs(collection(db, "flyer"), orderBy("name"))
            .then((snapShots) => {
                snapShots.forEach((doc) => {
                    currentFlyer.push(doc.data());
                });
                dispatch({ type: "init", init: currentFlyer });
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, []);

    useEffect(() => {
        setUpdated(true);
    }, [onSale, time]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateFormat = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const [timeChanged, setTimeChanged] = useState(false);
    const [year, setYear] = useState(time.getFullYear());
    const [mon, setMonth] = useState(time.getMonth());
    const [day, setDay] = useState(time.getDate());

    useEffect(() => {
        setTime(new Date(year, mon, day));
        setTimeChanged(true);
    }, [year, mon, day]);

    const updateTime = () => {
        dispatch({
            type: "changeTime",
            newExpire: Timestamp.fromDate(time),
        });
        setTimeChanged(false);
    };

    const saveAll = async () => {
        // delete all prev flyer items
        const colRef = collection(db, "flyer");
        const docSnapshots = await getDocs(colRef);
        docSnapshots.forEach(async (doc) => {
            // reset product discount to 0
            const productRef = doc(db, "products", doc.id);
            try {
                await updateDoc(productRef, { discount: 0 });
            } catch (e) {
                console.log(e);
            }
            deleteDoc(doc.ref);
        });

        // add all current flyer items
        onSale.forEach(async (item) => {
            await addDoc(colRef, item);
            // reflect discount on products
            const pRef = doc(db, "products", item.id);
            try {
                await updateDoc(pRef, { discount: item.discount });
            } catch (e) {
                console.log(e);
            }
        });
        setUpdated(false);
    };

    return (
        <div>
            <h2>Glasses on Sale!</h2>
            <div>
                <h3>Valid until:</h3>
                {isAdmin ? (
                    <>
                        <label>Year: </label>
                        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
                        <label> Month: </label>
                        <input value={months[mon]} onChange={(e) => setMonth(months.indexOf(e.target.value))} />
                        <label> Day: </label>
                        <input type="number" value={day} onChange={(e) => setDay(e.target.value)} />
                        <button onClick={updateTime} disabled={!timeChanged}>
                            Update Expiration
                        </button>
                    </>
                ) : (
                    time.toLocaleDateString(undefined, dateFormat)
                )}
            </div>
            <hr />
            <FlyerContext.Provider value={onSale}>
                <FlyerDispatchContext.Provider value={dispatch}>
                    <ol>
                        {onSale.map((prod, index) => (
                            <li key={index}>
                                <ProductBlock product={prod} isAdmin={isAdmin} />
                            </li>
                        ))}
                    </ol>
                    {isAdmin && <NewBlock timeStamp={Timestamp.fromDate(time)} />}
                    <hr />
                    {isAdmin && (
                        <button onClick={saveAll} disabled={!updated}>
                            Save Updates
                        </button>
                    )}
                </FlyerDispatchContext.Provider>
            </FlyerContext.Provider>
        </div>
    );
}

// flyer section dispatch pattern function
function saleReducer(onSale, action) {
    switch (action.type) {
        case "init": {
            return action.init;
        }
        case "add": {
            return [...onSale, action.item];
        }
        case "change1": {
            return onSale.map((s) => {
                if (s.id === action.item.id) {
                    return action.item;
                } else {
                    return s;
                }
            });
        }
        case "changeTime": {
            return onSale.map((s) => {
                return {
                    ...s,
                    expire: action.newExpire,
                };
            });
        }
        case "delete": {
            return onSale.filter((s) => s.id !== action.id);
        }
        default: {
            throw Error("Unknow action: " + action.type);
        }
    }
}

// flyer page
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
