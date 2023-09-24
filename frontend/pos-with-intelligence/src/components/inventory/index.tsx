import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import {useNavigate } from 'react-router-dom';

const Inventory: React.FC = () => {
  const [stockList, setStockList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // State to hold the selected product
  const navigate = useNavigate ();
  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/stock');
      setStockList(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleViewClick = (stock: any) => {
    setSelectedProduct(stock); 
    navigate(`/inventory/${stock.product_id}`);
  };

  const closeModal = () => {
    setSelectedProduct(null); // Close the modal
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="inventory-container">
        <div className="content">
          <h2>Inventory Content</h2>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((stock: any) => (
                <tr key={stock.product_id}>
                  <td>{stock.product_id}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.location}</td>
                  <td>
                    <button onClick={() => handleViewClick(stock)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Inventory;
