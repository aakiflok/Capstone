import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, FormControl } from 'react-bootstrap';
import './customers.css';

interface Customer {
  _id: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  email: string;
  phone_number: string;
  state: string;
  zip_code: string;
}

const Customers: React.FC = () => {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<Customer[]>('https://pos-crud.onrender.com/customers');
      setCustomerList(response.data);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const handleViewClick = (customer: Customer) => {
    navigate(`/customers/${customer._id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredCustomers = customerList.filter((customer) =>
  (customer.first_name && customer.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (customer.last_name && customer.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
);

  return (
    <>
      <Navbar />
      <Container>
        <Container className="d-flex justify-content-center mt-5">
          <Link to="/addCustomer" className="customer-tile-link">
            <Button className="add-customer-button">Add Customer</Button>
          </Link>
        </Container>
        <Container className="content">
          <h2>Customer Content</h2>
          <div className="search-container">
            <FormControl
              type="text"
              placeholder="Search customer..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Table striped bordered hover className="customer-table">
            <thead>
              <tr>
                <th>#</th>
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
              {filteredCustomers.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{index + 1}</td>
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
