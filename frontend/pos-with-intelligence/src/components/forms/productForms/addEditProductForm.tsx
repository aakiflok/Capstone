import React, { useState, useEffect } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link, useParams } from 'react-router-dom';
import './addEditProductForm.css';

const AddEditProductForm = () => {
  const { id } = useParams(); // Get the product ID from the route params
  const isEditing = !!id; // Determine if it's an edit operation
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);

  const [product, setProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image_uri: '',
    discontinued: false,
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
  const handleRadioChange = (e: any) => {
    const { name, value } = e.target;
    
    let finalValue = value;
    
    // If the changed element is the discontinued radio, parse the value to boolean
    if (name === 'discontinued') {
      finalValue = value === 'true';
    }
  
    setProduct({
      ...product,
      [name]: finalValue,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Submitting product:', product);
    if (isEditing) {
      // If it's an edit operation, send a PUT request to update the product
      axios.put(`https://pos-crud.onrender.com/products/${id}`, product)
        .then((response) => {
          // Handle success
          alert('The product has been updated successfully');
          navigate('/product/' + id);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadingImage(true);
  
      axios.get<{ signature: string; timestamp: number }>('https://pos-crud.onrender.com/get-signature')
        .then(response => {
          const { signature, timestamp } = response.data;
          const formData = new FormData();
          formData.append('file', files[0]);
          formData.append('timestamp', timestamp.toString());
          formData.append('signature', signature);
          formData.append('api_key', '278171197627713'); // Make sure to replace with your actual API key
  
          // Post to Cloudinary upload URL
          axios.post('https://api.cloudinary.com/v1_1/dxrohnluu/image/upload', formData)
            .then(uploadResponse => {
              const { secure_url } = uploadResponse.data;
              setProduct({ ...product, image_uri: secure_url });
              setUploadingImage(false);
            })
            .catch(uploadError => {
              console.error('Error uploading image:', uploadError);
              setUploadingImage(false);
            });
        })
        .catch(signatureError => {
          console.error('Error fetching signature:', signatureError);
          setUploadingImage(false);
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
            <label htmlFor="image">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p>Uploading image...</p>}
          </div>
          <div className="form-group">
            {product.image_uri && (
              <>
                <label>Image Preview</label>
                <img src={product.image_uri} alt="Product" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </>
            )}
          </div>
          <div className="form-group">
            <label>Discontinued</label>
              <input
                type="radio"
                id="discontinued-yes"
                name="discontinued"
                value="true"
                checked={product.discontinued === true}
                onChange={handleRadioChange}
              />
              <label htmlFor="discontinued-yes">Yes</label>

              <input
                type="radio"
                id="discontinued-no"
                name="discontinued"
                value="false"
                checked={product.discontinued === false}
                onChange={handleRadioChange}
              />
              <label htmlFor="discontinued-no">No</label>
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