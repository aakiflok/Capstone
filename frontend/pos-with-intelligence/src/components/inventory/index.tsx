import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from '../navigation/nav';
import './inventory.css';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.get('https://pos-crud.onrender.com/stock');
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
          <table className="stock-table">
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
