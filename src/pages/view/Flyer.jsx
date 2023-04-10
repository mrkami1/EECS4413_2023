import React, { useContext, useEffect, useReducer, useState } from "react";
import { db } from "../../firebase";
import Navbar from "../../components/Navbar";
import { collection, orderBy, getDocs, doc, getDoc, deleteDoc, Timestamp, setDoc, updateDoc } from "firebase/firestore";
import UserFieldsContext from "../../context/UserFieldsContext";
import { FlyerContext, FlyerDispatchContext } from "../../context/FlyerContext";
import {
    Card,
    CardContent,
    Button,
    Typography,
    Box,
    CardHeader,
    ImageList,
    Input,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";

// Yang
// for flyer components

// Individual Product card, showing product properties.
// Admin can change its current discout or delete for later submission
function ProductBlock({ serial, product, isAdmin }) {
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
        <Card sx={{ width: 300, ":hover": { boxShadow: 10 } }}>
            <CardHeader
                title={serial + ". " + product.name}
                subheader={"Expire on " + product.expire.toDate().toDateString()}
            ></CardHeader>
            <CardContent>
                <img src={product.img} alt={product.name} height={80} />
                <Typography variant="body1">Original price: CAD {product.price}</Typography>
                {isAdmin && (
                    <>
                        <Typography variant="body1">
                            Discount (%):{"  "}
                            <Input
                                type="number"
                                value={discount}
                                step={1}
                                min={1}
                                max={100}
                                sx={{ width: 50, marginRight: 1 }}
                                onChange={handleDiscChange}
                            />
                            <Button
                                variant="contained"
                                size="small"
                                onClick={updateDiscout}
                                disabled={discount === product.discount || !changed}
                            >
                                update
                            </Button>
                        </Typography>
                    </>
                )}
                <Typography>Discounted price: CAD {(product.price * (1 - discount / 100)).toFixed(2)}</Typography>
                {isAdmin && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Button variant="contained" size="small" onClick={removeItem}>
                            Delete Item
                        </Button>
                    </Box>
                )}
            </CardContent>
            <Box></Box>
        </Card>
    );
}

// A single add-new product block for admin use
function NewBlock({ timeStamp }) {
    const [error, setError] = useState("");
    const [id, setId] = useState("");
    const dispatch = useContext(FlyerDispatchContext);
    const onSale = useContext(FlyerContext);

    const addNewItem = async () => {
        const docRef = doc(db, "products", id);
        try {
            const snapShot = await getDoc(docRef);
            if (snapShot.exists()) {
                const newItem = snapShot.data();
                //console.log(newItem);
                //console.log(snapShot);
                if (!onSale.some((item) => item.id === newItem.id)) {
                    //console.log("got some new item: => " + id);
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
            setError("Unknown error");
            //console.log(e);
        }
    };
    return (
        <Card sx={{ width: 300, ":hover": { boxShadow: 10 } }}>
            <CardHeader title="Add new flyer item id"></CardHeader>
            <CardContent>
                <Input placeholder="New item ID" value={id} onChange={(e) => setId(e.target.value)} />
                <Button variant="contained" onClick={addNewItem} disabled={id === ""}>
                    Add new item
                </Button>
                <Typography sx={{ color: "red" }} disabled={error.length === 0}>
                    {error}
                </Typography>
            </CardContent>
        </Card>
    );
}

// Flyer item section
function Flyer({ isAdmin }) {
    const [updated, setUpdated] = useState(false);
    const [onSale, dispatch] = useReducer(saleReducer, []);
    //console.log("from flyer");
    //console.log(onSale);

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
                //console.log(error.message);
            });
    }, []);

    const [time, setTime] = useState(() => {
        if (onSale.length) {
            //console.log(onSale);
            return onSale[0].expire.toDate();
        } else {
            return new Date();
        }
    });

    useEffect(() => {
        setUpdated(true);
    }, [onSale, time]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateFormat = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const [timeChanged, setTimeChanged] = useState(false);
    const [year, setYear] = useState(time.getFullYear());
    const [mon, setMonth] = useState(time.getMonth());
    const [day, setDay] = useState(time.getDate());
    const days = new Date(year, mon, 0).getDate();

    const dayItems = [];
    for (let i = 0; i < days; i++) {
        dayItems.push(
            <MenuItem key={i} value={i + 1}>
                {i + 1}
            </MenuItem>
        );
    }

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
        docSnapshots.forEach(async (shot) => {
            // reset product discount to 0
            const productRef = doc(db, "products", shot.id);
            updateDoc(productRef, { discount: 0 });
            deleteDoc(shot.ref);
        });

        // add all current flyer items
        onSale.forEach(async (item) => {
            await setDoc(doc(db, "flyer", item.id), item);
            // reflect discount on products
            const pRef = doc(db, "products", item.id);
            updateDoc(pRef, { discount: item.discount });
        });
        setUpdated(false);
    };

    return (
        <>
            <Card>
                <CardHeader title="Glasses on Sale!"></CardHeader>
                <CardContent>
                    <Typography variant="body1">Valid until:</Typography>
                    {isAdmin && (
                        <>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                                <InputLabel id="month">Month</InputLabel>
                                <Select
                                    labelId="month"
                                    value={months[mon]}
                                    onChange={(e) => setMonth(months.indexOf(e.target.value))}
                                >
                                    {months.map((monthName) => (
                                        <MenuItem key={monthName} value={monthName}>
                                            {monthName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                                <InputLabel id="day">Day</InputLabel>
                                <Select labelId="day" value={day} onChange={(e) => setDay(e.target.value)}>
                                    {dayItems}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 60 }}>
                                <InputLabel id="year">Year</InputLabel>
                                <Input
                                    labelId="year"
                                    value={year}
                                    disabled
                                    onChange={(e) => setYear(Number(e.target.value))}
                                />
                            </FormControl>
                            <Box sx={{ paddingTop: 2 }}>
                                <Button variant="contained" onClick={updateTime} disabled={!timeChanged}>
                                    Update Expiration
                                </Button>
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
            <FlyerContext.Provider value={onSale}>
                <FlyerDispatchContext.Provider value={dispatch}>
                    <ImageList cols={4} sx={{ padding: 2 }}>
                        {onSale.map((prod, index) => (
                            <ProductBlock key={index} serial={index + 1} product={prod} isAdmin={isAdmin} />
                        ))}
                        {isAdmin && <NewBlock timeStamp={Timestamp.fromDate(time)} />}
                    </ImageList>
                    {isAdmin && (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "green",
                                }}
                                onClick={saveAll}
                                disabled={!updated}
                            >
                                Save Updates
                            </Button>
                        </Box>
                    )}
                </FlyerDispatchContext.Provider>
            </FlyerContext.Provider>
        </>
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
            <Navbar />
            <Flyer isAdmin={userFields?.level === "admin"} />
        </div>
    );
}
