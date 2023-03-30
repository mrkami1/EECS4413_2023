import { addDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { collection, doc, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from "../../firebase"
import Navbar from "../../components/Navbar";
import Product from './Product';

export const SearchPage = (props) => {
    const { key } = useParams()
    const [value, setValue] = useState("");
     const [products, setProducts] = useState([]);

    useEffect(()=> {
      const getProducts = ()=> {
          const productsSearchArray = [];
          const path = `${props.type}`
          console.log("this is: "+path)
          getDocs(collection(db, path)).then((querySnapshot)=>{
              querySnapshot.forEach((doc)=>{
                let searchQuery = key.toLowerCase()
                console.log("SearchQuery is: "+searchQuery)
                console.log(doc.data().color)
                console.log(doc.data().brand)
                if ( doc.data().brand.includes(searchQuery) || doc.data().color.includes(searchQuery))
                  productsSearchArray.push({...doc.data(),id:doc.id})
                  console.log("SearchQuery is: "+searchQuery)
                  console.log(doc.id, " => ", doc.data())
              })
              setProducts(productsSearchArray)
          }).catch((error)=>{
              console.log(error.message);
          })
      }
      getProducts()
    },[])


  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div className='allproduct-container'>
        <p className='Search-result'>Search Result</p>
            {products.map((product)=>(
                <Product 
                    key = {product.id}
                    product={product}/>
            ))}
        </div>
    </div>
  )
};