import { addDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { doc, query, onSnapshot, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from "../../firebase"
import Navbar from "../../components/Navbar"
import UserFieldsContext from '../../context/UserFieldsContext';
import { AuthContext } from '../../context/AuthContext';

export const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const { userFields } = useContext(UserFieldsContext)
    const { currentUser } = useContext(AuthContext)

    const addToCart = async () => {

        const newItem = {
            image: product.img,
            itemID: id,
            name: product.name,
            price: product.price,
            quantity: 1
        }

        if (userFields && currentUser) {

            let currentItems = userFields.get("cartItems");
            let itemInCart = false;

            currentItems.forEach(async (item) => {
                if (item.itemID === newItem.itemID) {
                    item.quantity += 1;
                    itemInCart = true;
                }
            })
            
            if (!itemInCart) {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: arrayUnion(newItem)
                })
                .then((msg) => {
                    console.log(msg)
                    console.log("added new item to cart")
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else {
                await updateDoc(doc(db, "users", currentUser.uid), {
                    cartItems: currentItems
                })
                .then((msg) => {
                    console.log(msg)
                    console.log("updated item quantity")
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    }

    function GetSpecifiedProduct() {

        useEffect(()=> {
            const getProduct = async () => {
                const docRef = doc(db, "products", id)
                const docSnap = await getDoc(docRef)
                setProduct(docSnap.data())
            };
            getProduct()
        }, [])
        return product
    }
    GetSpecifiedProduct();

  return (
    <div>
    <div>
        <Navbar />
    </div>
    <div>ProductDetail
        {product ? <div>
            <div>
            <img src={product.img} />
            </div>
            <div>
                <p>{product.name}</p>
                <p>Brand: {product.brand}</p>
                <p>Gender: {product.gender}</p>
                <p>Review: {product.rate} stars</p>
                <p>CAD: ${product.price}</p>
                <p>Color: {product.color}</p>
                <br/>
                <p>Description: {product.description}</p>
                <div className='buy-cart'>
                    <button className="btn">Buy Now</button>
                    <button className="btn" onClick={addToCart}>Add to cart</button>
                </div>
            </div>
        </div> : <div>Loading...</div>

        }
    </div>
    </div>
  )
}
