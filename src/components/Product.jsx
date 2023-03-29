import React from "react";

const Product = (product) => {
    return (
        <div className='product-container'>
            <img src={product.product.img} />
            <div className='product-details'>
                <p className="product-brand">{product.product.brand}</p>
                <p className="product-name">{product.product.name}</p>
                <div className="price-container">
                    <p className="CAD">CAD: <p className="rate">{product.product.price}</p></p>
                    {/* <p className='saleprice'>Discount Price:<p className="rate"></p></p> */}
                </div>
                <div className='buy-cart'>
                    <button className="btn">Buy Now</button>
                    <button className="btn">Add to cart</button>
                </div>
            </div>
            <br/>
        </div>
    )
}

export default Product