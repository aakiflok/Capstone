import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductTile from '../tiles/productTiles/productTile';
import ProductView from '../itemView/productView/productView';
import Navbar from '../navigation/nav';
import axios from 'axios';
import './index.css';
import { Product } from '../../models/product.module';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    fetchProducts();
  }, []);

  const openProductView = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductView = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
      <div className="product-list">
      <Link to="/addProduct"> {/* Link to the product form route */}
          <button className="add-product-button">Add Product</button>
        </Link>
        {products.map((product) => (
          <Link
            to={`/product/${product.id}`} // Pass the productId as a URL parameter
            key={product.id}
          >
            <ProductTile
              key={product.id}
              product={product}
              onClick={openProductView}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Products;
