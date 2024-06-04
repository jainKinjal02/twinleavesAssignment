import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  console.log(location);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-box">
        <h1>{product.name}</h1>
        <div className="product-image-container">
          <img src={product.images.front} alt={product.name} className="product-image" />
        </div>
        <p className="description">{product.description}</p>
        <p className="price">{product.mrp ? `₹${product.mrp.mrp}` : 'Price Not Available'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;