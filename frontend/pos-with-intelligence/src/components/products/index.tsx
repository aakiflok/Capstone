import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductTile from '../tiles/productTiles/productTile';
import Navbar from '../navigation/nav';
import axios from 'axios';
import { Product } from '../../models/product.module';
import Cookies from 'js-cookie';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { categoryOptions } from '../forms/productForms/addEditProductForm';

// Define types for your filters
interface FilterState {
  category: {
    [category: string]: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

const Products: React.FC = () => {
  const maxPrice = 10000;
  const initialFilters = {
    category: {
      Television: false,
      Refrigerator: false,
      'Sound Bar': false,
      Dishwasher: false,
      'Washing Machine': false,
      'Air Conditioner': false,
      'Microwave Oven': false,
      'Vacuum Cleaner': false,
      'Coffee Maker': false,
      Blender: false,
      Toaster: false,
      Oven: false,
      Cooktop: false,
      'Range Hood': false,
      'Food Processor': false,
      'Hair Dryer': false,
      Iron: false,
      Juicer: false,
      'Water Heater': false,
      'Smart Home': false,
      'Fitness Equipment': false,
    },
    priceRange: { min: 0, max: maxPrice },
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

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

  return (
    <>
      <Navbar />

      <Container fluid className="mt-4">
        <Row>
          <Col md={3}>
            <h2>FILTERS</h2>
            <div className="mb-3">
              {categoryOptions.map((category) => (
                <Form.Check
                  type="checkbox"
                  id={`filter-${category}`}
                  label={category}
                  checked={filters.category[category as keyof typeof filters.category]}
                  onChange={() => handleCategoryChange(category as keyof typeof filters.category)}
                  key={category}
                />
              ))}
            </div>
            <div className="mb-3">
              <Form.Label htmlFor="priceRange">
                Max Price: ${filters.priceRange.max}
              </Form.Label>
              <Form.Control
                type="range"
                id="priceRange"
                min={0}
                max={maxPrice}
                value={filters.priceRange.max}
                onChange={handlePriceRangeChange}
              />
              <Button variant="outline-secondary" size="sm" onClick={() => handlePriceChange(0, maxPrice)}>
                Clear All
              </Button>
              {user && (
                <Link to="/addProduct" className="d-block mt-2">
                  <Button variant="primary" size="sm">Add Product</Button>
                </Link>
              )}
            </div>
          </Col>

          <Col md={9}>
            <Container fluid>
              <Row>
                {filteredProducts.map((product) => (
                  <Col md={6} lg={4} className="mb-3" key={product._id}>
                    <Link to={`/product/${product._id}`} className="d-block w-100">
                      <ProductTile product={product} onClick={() => openProductView(product)} />
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Products;
