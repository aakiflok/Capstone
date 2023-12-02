import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './productView.css'; // Import your CSS file here
import Navbar from '../../navigation/nav';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const ProductView: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number | null>(null); // New state for quantity
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const [showAlert, setShowAlert] = useState(false); // State for displaying alert
  const [alertMessage, setAlertMessage] = useState(''); // Alert message
  
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);

        // Fetch the quantity of the product
        const quantityResponse = await axios.get(`http://localhost:3001/stock/quantity/${id}`);
        setQuantity(quantityResponse.data.quantity);
      } catch (err) {
        console.log("Error: ", err);
      }
    };



    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }

    fetchMessages();
    fetchProduct();
  }, [id]);

  if (!product || quantity === null) {
    return <div>Loading...</div>;
  }



  const handleSubmitMessage = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/products/${id}/messages/${user._id}`, {
        message: newMessage,
      });

      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

 
  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/products/${id}`);

      if (response.status === 200) {
        navigate('/products');
      } else {
        setAlertMessage(response.data.message);
        setShowAlert(true);
      }
    } catch (error:any) {
      setAlertMessage(error.response.data.message);
      setShowAlert(true);
    }
  };
  return (
    <>
      <Navbar />
      <Container className="mt-5">
        <Row>
          <Col lg={6}>
            <img src={product.image_uri} alt={product.name} className="img-fluid product-image" />
          </Col>
          <Col lg={6}>
            <div className="product-details">
              <h2 className="product-title">{product.name}</h2>
              <p className="text-primary product-price">${product.price}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-quantity">Quantity: {quantity}</p>
              <>
                <Link to={`/editProduct/${product._id}`} key={product._id} className="edit-link">
                  <Button variant="info" className="custom-button">Edit Product</Button>
                </Link>
                <Button variant="danger" onClick={handleDeleteProduct}>Delete Product</Button>
              </>
              <p className={`product-status ${product.discontinued ? 'discontinued' : 'available'}`}>
                {product.discontinued ? 'Discontinued' : ''}
              </p>
            </div>
          </Col>
        </Row>

        {/* Display an alert if showAlert is true */}
        {showAlert && (
          <Alert variant="danger" className="mt-3">
            {alertMessage}
          </Alert>
        )}

        {/* Discussion form section */}
        <div className="mt-5">
          <h3>Discussion Form</h3>
          <div className="message-list">
            {messages.map((message) => (
              <div key={message._id} className="message">
                {message.user_id && (<strong>{message.user_id.first_name} {message.user_id.last_name} ({message.user_id.role}):</strong>)} {message.message}
              </div>
            ))}
          </div>

          <Form className="message-form mt-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="custom-button-group mt-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
              <Button variant="primary" onClick={handleSubmitMessage}>Send</Button>
            </div>

          </Form>
        </div>
      </Container>
    </>
  );
};

export default ProductView;
