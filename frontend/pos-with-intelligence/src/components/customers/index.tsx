import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import {useNavigate } from 'react-router-dom';


const Customers: React.FC = () => {
  const [customerList, setCustomerList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // State to hold the selected product
  const navigate = useNavigate ();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/customers');
      setCustomerList(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
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
          <h2>Customer Content</h2>
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>State</th>
                <th>Zip Code</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer: any) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.first_name}</td>
                  <td>{customer.last_name}</td>
                  <td>{customer.address}</td>
                  <td>{customer.city}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone_number}</td>
                  <td>{customer.state}</td>
                  <td>{customer.zip_code}</td>
                  <td>
                    <button onClick={() => handleViewClick(customer)}>
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

export default Customers;
