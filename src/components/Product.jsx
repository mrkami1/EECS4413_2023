import React from "react";

const Product = (product) => {
    return (
        <div className='product-container'>
            <img src={product.product.img} />
            <div className='product-details'>
                <p className="product-brand">{product.product.brand}</p>
                <p className="product-name">{product.product.name}</p>
                <div className="price-container">
                    <p className="CAD">CAD: <span className="rate">{product.product.price}</span></p>
                    {/* <p className='saleprice'>Discount Price:<p className="rate"></p></p> */}
                </div>
                <div>                
                    <a href={`/product/${product.product.id}`}>
                        <button className="details-btn">More Details &gt;</button>
                    </a>
                </div>
                <div>
                    <button className="btn">Add to cart</button>
                </div>
            </div>
            <br/>
        </div>
    )
}

export default Product