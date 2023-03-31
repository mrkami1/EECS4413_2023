import { arrayUnion, doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import React, { useContext } from "react";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Product.css";
import { useNavigate } from "react-router-dom";

const Product = (product) => {
    const { userFields } = useContext(UserFieldsContext);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const addToCart = async () => {
        const newItem = {
            image: product.product.img,
            itemID: product.product.id,
            name: product.product.name,
            price: product.product.price,
            quantity: 1,
        };

        if (userFields && currentUser) {
            let currentItems = userFields.cartItems;
            let itemInCart = false;

            currentItems.forEach(async (item) => {
                if (item.itemID === newItem.itemID) {
                    item.quantity += 1;
                    itemInCart = true;
                }
            });

            if (!itemInCart) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: arrayUnion(newItem),
                })
                    .then(() => {
                        console.log("added new item to cart");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: currentItems,
                })
                    .then(() => {
                        console.log("updated item quantity");
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="product-container">
            <img className="img" src={product.product.img} />
            <div className="product-details">
                <p className="product-brand">{product.product.brand}</p>
                <p className="product-name">{product.product.name}</p>
                <div className="price-container">
                    <p className="CAD">
                        CAD:{" "}
                        <span className="rate">
                            {(product.product.price * (1 - product.product.discount / 100)).toFixed(2)}
                        </span>
                    </p>
                    {/* <p className='saleprice'>Discount Price:<p className="rate"></p></p> */}
                </div>
                <div>
                    <a href={`/product/${product.product.id}`}>
                        <button className="details-btn">More Details &gt;</button>
                    </a>
                </div>
                <div>
                    <button className="btn" onClick={addToCart}>
                        Add to cart
                    </button>
                </div>
            </div>
            <br />
        </div>
    );
};

export default Product;
