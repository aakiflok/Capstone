import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductTile from '../tiles/productTiles/productTile';
import Navbar from '../navigation/nav';
import axios from 'axios';
import './index.css';
import { Product } from '../../models/product.module';
import Cookies from 'js-cookie';
import { text } from 'stream/consumers';

// Define types for your filters
interface FilterState {
  category: {
    TV: boolean;
    AirCondition: boolean;
    WashingMachine: boolean;
    MicroWave: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const maxPrice = 10000;
  const [filters, setFilters] = useState<FilterState>({
    category: {
      TV: false,
      AirCondition: false,
      WashingMachine: false,
      MicroWave: false,
    },
    priceRange: { min: 0, max: Infinity },
  });

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

    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = products.filter((product) => {
        const matchesCategory = filters.category[product.category as keyof typeof filters.category] || !Object.values(filters.category).some(v => v);
        const matchesPrice = product.price >= filters.priceRange.min && product.price <= filters.priceRange.max;
        return matchesCategory && matchesPrice;
      });
      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filters, products]);

  const handleCategoryChange = (category: keyof FilterState['category']) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: {
        ...prevFilters.category,
        [category]: !prevFilters.category[category],
      },
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: { min, max },
    }));
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: { ...prevFilters.priceRange, max: value },
    }));
  };

  const openProductView = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeProductView = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
      <div style={{textAlign:"center"}}>
        {user && (
          <Link to="/addProduct" className="product-tile-link">
            <button className="add-product-button">Add Product</button>
          </Link>
        )}
      </div>
      <div className="products-container">
    
        <aside className="filter-sidebar">
          <h2>FILTERS</h2>
          <div className="filter-category">
            {/* Repeat this pattern for each category */}
            {Object.keys(filters.category).map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={filters.category[category as keyof typeof filters.category]}
                  onChange={() => handleCategoryChange(category as keyof typeof filters.category)}
                />
                {category}
              </label>
            ))}
          </div>
          <div className="filter-price-range">
            <label>
              Max Price: ${filters.priceRange.max}
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={filters.priceRange.max}
                onChange={handlePriceRangeChange}
              />
            </label>
            <button onClick={() => handlePriceChange(0, maxPrice)}>Clear All</button>
          </div>
        </aside>

        <div className="product-tiles-container">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product._id}`} // Pass the productId as a URL parameter
              key={product._id}
            >
              <ProductTile
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
