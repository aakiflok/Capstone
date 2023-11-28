import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';

const InventoryView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { id } = useParams();
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/stock/${id}`);

        if (isMounted) {
          setSelectedProduct(response.data);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };

    fetchData();
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDeleteProduct = async () => {
    try {
      // Implement the logic to delete the product here
      // Send a DELETE request to your API
      await axios.delete(`http://localhost:3001/stock/${id}`);
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error(error);
    }
  };

  if (!selectedProduct) {
    return (
      <>
        <Navbar />
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container fluid className="d-flex flex-column align-items-center">
        <h2 className="mt-4">Inventory Details</h2>
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
                  <td>Product Name</td>
                  <td>{selectedProduct.product_name}</td>
                </tr>
                <tr>
                  <td>Product ID</td>
                  <td>{selectedProduct.product_id}</td>
                </tr>
                <tr>
                  <td>Quantity</td>
                  <td>{selectedProduct.quantity}</td>
                </tr>
                <tr>
                  <td>Location of Storage</td>
                  <td>{selectedProduct.location}</td>
                </tr>
                <tr>
                  <td>Cost per unit</td>
                  <td>{selectedProduct.price}</td>
                </tr>
                <tr>
                  <td>Stock Value</td>
                  <td>{selectedProduct.price * selectedProduct.quantity}</td>
                </tr>
                <tr>
                  <td>Discontinue?</td>
                  <td>{selectedProduct.discontinued ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <div className="mt-4 d-flex justify-content-center align-items-center w-100">
          <Link to={`/editInventory/${id}`}>
            <Button variant="primary">Edit Inventory</Button>
          </Link>
          {user && user.role === 'admin' && (
            <Button variant="danger" onClick={handleDeleteProduct} className="ml-3">
              Delete Product
            </Button>
          )}
        </div>
      </Container>
    </>
  );
};

export default InventoryView;
