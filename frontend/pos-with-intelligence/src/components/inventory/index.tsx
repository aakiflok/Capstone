import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Modal } from 'react-bootstrap'; // Import React-Bootstrap components
import './inventory.css';

const Inventory: React.FC = () => {
  const [stockList, setStockList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // State to hold the selected product
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      // Make a GET request to the '/stock' route
      const response = await axios.get('http://localhost:3001/stock');
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
    setSelectedProduct(null); // Close the modal
  };

  return (
    <>
     <Navbar />
      <Container className="inventory-container">
        <Container className="content">
          <h2>Inventory Content</h2>
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
              {stockList.map((stock: any) => (
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
