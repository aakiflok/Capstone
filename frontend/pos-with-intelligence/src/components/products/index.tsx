import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductTile from '../tiles/productTiles/productTile';
import ProductView from '../itemView/productView/productView';
import Navbar from '../navigation/nav';
import axios from 'axios';
import './index.css'; // You can create an external CSS file and import it here
import { Product } from '../../models/product.module';
import Cookies from 'js-cookie';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://pos-crud.onrender.com/products");
        setProducts(response.data);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    fetchProducts();

    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
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
        {user && user.role === 'admin' && (
          <Link to="/addEmployee" className="product-tile-link">
            <button className="add-employee-button">Add Employee</button>
          </Link>
        )}
        
        <div className="product-tiles-container">
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
      </div>
    </>
  );
};

export default Products;
