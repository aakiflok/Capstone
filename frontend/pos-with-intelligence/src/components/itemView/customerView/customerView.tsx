import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';

const CustomerView: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/customers/${id}`);

        if (isMounted) {
          setSelectedCustomer(response.data);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDeleteCustomer = async () => {
    try {
      // Implement the logic to delete the customer here
      // Send a DELETE request to your API
      await axios.delete(`http://localhost:3001/customers/${id}`);
      navigate('/customers'); // Redirect to the customers page after deletion
    } catch (error) {
      console.error(error);
    }
  };

  if (!selectedCustomer) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container fluid className="d-flex flex-column align-items-center">
        <h2 className="mt-4">Customer Details</h2>
        <Row className="w-100 align-items-center" style={{ justifyContent: 'space-evenly' }}>
          <Col md={8}>
            <Table
              striped
              bordered
              hover
              style={{
                maxWidth: '800px',
                width: '100%',
                margin: '0 auto',
              }}
            >
              <tbody>
                <tr>
                  <td>Customer ID</td>
                  <td>{selectedCustomer._id}</td>
                </tr>
                <tr>
                  <td>First Name</td>
                  <td>{selectedCustomer.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{selectedCustomer.last_name}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{selectedCustomer.address}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{selectedCustomer.email}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <div className="mt-4 d-flex justify-content-center align-items-center w-100">
          <Link to={`/customers/edit/${id}`}>
            <Button variant="primary">Edit Customer</Button>
          </Link>
          <Button variant="danger" onClick={handleDeleteCustomer} className="ml-3">
            Delete Customer
          </Button>
        </div>
      </Container>
    </>
  );
};

export default CustomerView;
