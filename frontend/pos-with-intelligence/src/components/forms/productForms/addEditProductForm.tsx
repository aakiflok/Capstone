import React, { useState, useEffect } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Link, useParams } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; // Import React-Bootstrap components
import './addEditProductForm.css';
export const categoryOptions = [
  'Television',
  'Refrigerator',
  'Sound Bar',
  'DishWasher',
  'Washing Machine',
  'Air Conditioner',
  'Microwave Oven',
  'Vacuum Cleaner',
  'Oven',
  'Cooktop',
];

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

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

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
    if (isEditing) {
      // If it's an edit operation, send a PUT request to update the product
      axios.put(`https://pos-crud.onrender.com/products/${id}`, product)
      navigate("/products");
    } else {
      // If it's not an edit operation, send a POST request to create a new product
      axios.post('https://pos-crud.onrender.com/products', product)
      navigate("/products");
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
          formData.append('api_key', '278171197627713');

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
      <Container className="product-form-container">
        <button onClick={handleGoBack} className="back-button">
          Back
        </button>
        <h2>{isEditing ? 'Edit Product' : 'Add a Product'}</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
          <Col>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={product.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a Category</option>
                {categoryOptions.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
            <Col>
              <Form.Group>
                <Form.Label>Discontinued</Form.Label>
                <Form.Check
                  type="radio"
                  name="discontinued"
                  value="true"
                  checked={product.discontinued === true}
                  onChange={handleRadioChange}
                  label="Yes"
                />
                <Form.Check
                  type="radio"
                  name="discontinued"
                  value="false"
                  checked={product.discontinued === false}
                  onChange={handleRadioChange}
                  label="No"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              required
            />
            {uploadingImage && <p>Uploading image...</p>}
            {product.image_uri && (
              <div>
                <Form.Label>Image Preview</Form.Label>
                <br />
                <img src={product.image_uri} alt="Product" style={{ maxWidth: '200px', maxHeight: '200px' }} />
              </div>
            )}
          </Form.Group>
          <Button type="submit" className="submit-button">
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddEditProductForm;
