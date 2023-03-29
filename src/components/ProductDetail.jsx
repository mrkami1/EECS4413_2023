import { getDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from "../firebase";

export const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')



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
                    <button className="btn">Add to cart</button>
                </div>
            </div>
        </div> : <div>Loading...</div>

        }
    </div>
  )
}
