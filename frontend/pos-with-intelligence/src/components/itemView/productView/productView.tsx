import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './productView.css';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import img1 from '../../../LG_TV_1.jpg';
import Cookies from 'js-cookie';

const ProductView: React.FC = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Send a GET request to your API using the '_id' from the URL
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
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

  if (!product) {
    return <div>Loading...</div>;
  }

  // Function to upload an image
  const uploadImage = async (imageFile:any) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Make a POST request to the /upload endpoint
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      });

      // Handle the response
      if (response.status === 201) {
        console.log('Image uploaded successfully.');
        console.log('Image URL:', response.data.imageUrl);
      } else {
        console.error('Error uploading image:', response.data.message);
      }
    } catch (error) {
      console.error('API error:', error);
    }
  };

  // Usage example: call uploadImage with the selected file from an input field
  
  const handleImageUpload = async (event:any) => {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      await uploadImage(selectedFile);
    }
  };
  
  const handleSubmitMessage = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/products/${id}/messages/${user.id}`, {
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

  return (
    <>
      <Navbar />
      <div className="product-view">
        <div className="product-content">
          <div className="product-image">
            <img src={img1} alt={product.name} />
          </div>
          <div className="product-details">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <p className="description">{product.description}</p>
          </div>
        </div>
        <Link
            to={`/editProduct/${product.id}`} // Pass the productId as a URL parameter
            key={product.id}
          >
          <button className="add-product-button">Add Product</button>
        </Link>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
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
          <button onClick={handleSubmitMessage}>Submit</button>
        </div>
      </div>
    </>
  );
};

export default ProductView;
