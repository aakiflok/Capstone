import React, { useState, useEffect } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './addEditProductForm.css';

const AddEditProductForm = () => {
  const { id } = useParams(); // Get the product ID from the route params
  const isEditing = !!id; // Determine if it's an edit operation

  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    description: '',
    image_uri: '',
  });

  useEffect(() => {
    // If it's an edit operation (ID is available in params), fetch the product data
    if (isEditing) {
      axios.get(`https://pos-crud.onrender.com/products/${id}`)
        .then((response) => {
          // Set the form fields with existing product data
          setProduct(response.data);
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (isEditing) {
      // If it's an edit operation, send a PUT request to update the product
      axios.put(`https://pos-crud.onrender.com/products/${id}`, product)
        .then((response) => {
          // Handle success
          console.log('Product updated:', response.data);
        })
        .catch((error) => {
          // Handle error
          console.error('Error updating product:', error);
        });
    } else {
      // If it's not an edit operation, send a POST request to create a new product
      axios.post('https://pos-crud.onrender.com/products', product)
        .then((response) => {
          // Handle success
          console.log('Product added:', response.data);
        })
        .catch((error) => {
          // Handle error
          console.error('Error adding product:', error);
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="product-form-container">
        <h2>{isEditing ? 'Edit Product' : 'Add a Product'}</h2>
        <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="id">ID</label>
            <input
              type="text"
              id="id"
              name="id"
              value={product.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_uri">Image URI</label>
            <input
              type="url"
              id="image_uri"
              name="image_uri"
              value={product.image_uri}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddEditProductForm;