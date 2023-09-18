import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';

const Inventory: React.FC = () => {
  const [stockList, setStockList] = useState([]);

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
            <th>Stock ID</th>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stockList.map((stock: any) => (
            <tr key={stock.stock_id}>
              <td>{stock.stock_id}</td>
              <td>{stock.product_id}</td>
              <td>{stock.quantity}</td>
              <td>{stock.location}</td>
              <td>
                  <button onClick={() => handleViewClick(stock)}>
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
