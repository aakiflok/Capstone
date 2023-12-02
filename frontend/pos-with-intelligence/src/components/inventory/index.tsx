import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, FormControl } from 'react-bootstrap'; // Import React-Bootstrap components
import './inventory.css';

const Inventory: React.FC = () => {
  const [stockList, setStockList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await axios.get('https://pos-crud.onrender.com/stock');
      setStockList(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleViewClick = (stock: any) => {
    setSelectedProduct(stock);
    navigate(`/inventory/${stock._id}`);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredStock = stockList.filter((stock: any) =>
    stock.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Container className="inventory-container">
        <Container className="content">
          <h2>Inventory Content</h2>
          <div className="search-container">
            <FormControl
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Table striped bordered hover className="stock-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((stock: any) => (
                <tr key={stock._id}>
                  <td>{stock.product_name}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.location}</td>
                  <td>
                    <Button onClick={() => handleViewClick(stock)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
};

export default Inventory;
