import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './productView.css'; // Import your CSS file here
import Navbar from '../../navigation/nav';
import axios from 'axios';
import img1 from '../../../LG_TV_1.jpg';
import Cookies from 'js-cookie';

const ProductView: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number | null>(null); // New state for quantity
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://pos-crud.onrender.com/products/${id}`);
        setProduct(response.data);
        
        // Fetch the quantity of the product
        const quantityResponse = await axios.get(`https://pos-crud.onrender.com/stock/quantity/${id}`);
        setQuantity(quantityResponse.data.quantity);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://pos-crud.onrender.com/products/${id}/messages`);
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
    // ...
  };

  return (
    <>
      <Navbar />
      <div className="product-view-container">
        <div className="product-content">
          <div className="product-image">
            <img src={img1} alt={product.name} />
          </div>
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="product-price">Price: ${product.price}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-quantity">Quantity: {quantity}</p>
          </div>
        </div>
        {user && user.role === 'admin' && (
          <Link to={`/editProduct/${product.id}`} key={product.id}>
            <button className="edit-product-button">Edit Product</button>
          </Link>
        )}
        {/* List of messages */}
        <div className="message-list">
          {messages.map((message) => (
            <div key={message._id} className="message">
              <p>{message.message}</p>
            </div>
          ))}
        </div>
  
        {/* Form to submit a new message */}
        <div className="message-form">
          <textarea
            placeholder="Add your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="submit-message-button" onClick={handleSubmitMessage}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductView;
