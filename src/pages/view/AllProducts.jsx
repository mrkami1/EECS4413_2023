import React from 'react'
import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from "../../firebase";
// import { Item } from '../pages/view/Item'
import Product from './Product'
import Navbar from '../../components/Navbar';

export const AllProducts = (props) => {
  console.log("the type is: "+props.type);
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    const getProducts = ()=> {
        const productsArray = [];
        const path = `${props.type}`
        // console.log("this is: "+path)
        getDocs(collection(db, path)).then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                productsArray.push({...doc.data(),id:doc.id})
                console.log(doc.id, " => ", doc.data())
            })
            setProducts(productsArray)
        }).catch((error)=>{
            console.log(error.message);
        })
    }
    getProducts()
  },[])
  return (
    <div className='allproduct'>
        <div>
            <Navbar />
        </div>
        <div className='heading'>
            <p>results for {props.type}</p>
        </div>
        <div className='allproduct-container'>
            {products.map((product)=>(
                <Product 
                    key = {product.id}
                    product={product}/>
            ))}
        </div>
    </div>
  )
}
