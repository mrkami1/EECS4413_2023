import { addDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { doc, query, onSnapshot, getDocs, setDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from "../../firebase"
import Navbar from "../../components/Navbar"
import UserFieldsContext from '../../context/UserFieldsContext';
import { AuthContext } from '../../context/AuthContext';
import { uuidv4 } from '@firebase/util';
import '../../css/ProductDetail.css'

export const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [rating, setRating] = useState("5");
    const [message, setMessage] = useState("");
    const [reviews, setReviews] = useState([]);

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
                .then(() => {
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
                .then(() => {
                    console.log("updated item quantity")
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
    }

    useEffect(() => {
        const getReviews = async () => {
            if (currentUser && id) {
               
                const reviewsDoc = await getDoc(doc(db, "reviews", id))

                if (reviewsDoc.exists()){
                    const r = reviewsDoc.data().customerReviews;
                    setReviews(r);
                    
                }
                else {
                    console.log("no doc exists")
                }
            }
        }
        return () => {
            getReviews();
            
        }

    }, [currentUser, id])

    console.log(reviews)

    const createReview = async () => {
        const newReview = {
            date: Timestamp.now(),
            itemID: id,
            itemName: product.name,
            reviewerID: currentUser.uid,
            reviewerName: currentUser.displayName,
            message: message,
            rating: rating,
        }

        const reviewDoc = await getDoc(doc(db, "reviews", id));
        if (!reviewDoc.exists()) {
            await setDoc(doc(db, "reviews", id), {
                customerReviews: []
            })
        }
  
        await updateDoc(doc(db, "reviews", id), {
            customerReviews: arrayUnion(newReview)
        })
        .then(() => {window.location.reload()})
        
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
            <img className='img' src={product.img} />
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
                <div className="review-container">
                    <div>
                        <p>Write a review:</p>
                        <input type="text" onChange={(e) => {setMessage(e.target.value)}}></input>
                        <select onChange={(e) => {setRating(e.target.value)}}>
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 star</option>
                        </select>
                        <p><button className='btn' onClick={createReview}>Submit review</button></p>
                    </div>
                    <div className="user-reviews">
                        {
                            reviews?.map((r, i) => {
                                return (
                                    <div key={i}>
                                        <hr />
                                        <p>{r.reviewerName}</p>
                                        <p>{r.rating} stars</p>
                                        <p>Reviewed on {r?.date?.toDate()?.toDateString()}</p>
                                        <p>{r.message}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        </div> : <div>Loading...</div>

        }
    </div>
    </div>
  )
}
