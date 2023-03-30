import { addDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { collection, doc, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from "../../firebase"
import Navbar from "../../components/Navbar";
import Product from './Product';

// Ying
// Search product by color / brand with sort functionality
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

    // sort price low to hight
    const numAscending = [...products].sort((a, b) => a.price - b.price);

  // sort price high to low
    const numDescending = [...products].sort((a, b) => b.price - a.price);
    
  // sort name a - z
    const strAscending = [...products].sort((a, b) => 
                          a.name > b.name ? 1 : -1) 
  
  // sort name z - a 
    const strDescending = [...products].sort((a, b) => 
                          a.name > b.name ? -1 : 1) 
      
    const onSelect = (e) => {        
          const val = e.target.value;
   
          switch (val) {
              case "Sort Product": break; 
              case "PriceAscending": setProducts(numAscending); break; 
              case "PriceDescending": setProducts(numDescending); break;
              case "NameAscending": setProducts(strAscending); break;
              case "NameDescending": setProducts(strDescending); break;
              default: break;
              }
      }

  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div>   
            <select onChange={onSelect} defaultValue="Sort Product">
                <option value="Sort Product">Sort Products</option>
                <option value="PriceAscending">Sort Price from Low to High</option>
                <option value="PriceDescending">Sort Price from high to Low</option>
                <option value="NameAscending">Sort Name from A to Z</option>
                <option value="NameDescending">Sort Name from Z to A</option>
            </select>
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