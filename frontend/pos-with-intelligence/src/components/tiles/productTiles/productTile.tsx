import React from 'react';
import './productTile.css';
import {Product} from '../../../models/product.module'
import img1 from '../../../LG_TV_1.jpg'
interface ProductTileProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductTile: React.FC<ProductTileProps> = ({ product, onClick }) => {
  return (
    <div className="product-tile">
      <div className="product-image">
        <img src={product.image_uri} alt={product.name} />
      </div>
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>Price: ${product.price}</p>
        <button className="view-button">View Details</button>
      </div>
    </div>
  );
};

export default ProductTile;