import { arrayUnion, doc, updateDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import React, { useContext } from "react";
import UserFieldsContext from "../../context/UserFieldsContext";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Product.css";
import { useNavigate } from "react-router-dom";

const Product = (product) => {

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
            </div>
            <br />
        </div>
    );
};

export default Product;
