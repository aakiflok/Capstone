import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './productView.css'; // Import your CSS file here
import Navbar from '../../navigation/nav';
import axios from 'axios';
import img1 from '../../../LG_TV_1.jpg';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const ProductView: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number | null>(null); // New state for quantity
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

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

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error(error);
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

  // Function to upload an image
  const uploadImage = async (imageFile: any) => {
    // ...
  };

  const handleImageUpload = async (event: any) => {
    // ...
  };

  const handleSubmitMessage = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/products/${id}/messages/${user._id}`, {
        message: newMessage,
      });
  
      // Add the new message to the state
      setMessages([...messages, response.data]);
  
      // Clear the message input field
      setNewMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      navigate('/products');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-view-container">
        <div className="product-header">
          <img src={img1} alt={product.name} className="product-main-image" />
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="product-price">${product.price}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-quantity">Quantity: {quantity}</p>
            
            <p>{product.discontinued}</p>
          </div>
        </div>
        
        {/* Discussion form section */}
        <div className="discussion-section">
          <h3>Discussion Form</h3>
          <div className="message-list">
            {messages.map((message) => (
              <div key={message._id} className="message">
                <strong>{message.user} ({message.role}):</strong>
                <p>{message.message}</p>
              </div>
            ))}
          </div>
  
          <div className="message-form">
            <textarea
              placeholder="Add your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="submit-message-button" onClick={handleSubmitMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
