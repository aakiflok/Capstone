import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap'; // Import React-Bootstrap components
import './customers.css';

const Customers: React.FC = () => {
  const [customerList, setCustomerList] = useState([]);
  const navigate = useNavigate();

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

  const handleViewClick = (customer: any) => {
    navigate(`/customers/${customer._id}`);
  };

  return (
    <>
      <Navbar />
      <Container >
        <Container className="content">
          <h2>Customer Content</h2>
          <Table striped bordered hover className="customer-table">
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
                <th>Actions</th>
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
                    <Button onClick={() => handleViewClick(customer)}>
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

export default Customers;
