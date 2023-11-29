import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './addEditInventoryForm.css';
import Navbar from '../../navigation/nav';

import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap'; // Import Bootstrap components
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

interface Stock {
  _id: string;
  quantity: number;
  location: string;
}

interface UnitSerial {
  _id?: string;
  stock_id: string;
  serial_number: string;
  isAvailable: boolean;
}

const AddEditInventoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [stock, setStock] = useState<Stock>({
    _id: id || '0',
    quantity: 0,
    location: '',
  });
  
  stock.quantity = Number(stock.quantity);

  const [unitSerialsAvailable, setUnitSerialsAvailable] = useState<UnitSerial[]>([]);
  const [unitSerialsNotAvailable, setUnitSerialsNotAvailable] = useState<UnitSerial[]>([]);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);
  const [serialsAvailable, setSerialsAvailable] = useState<boolean>(true);
  const [stockChangesMade, setStockChangesMade] = useState<boolean>(false);

  // Track if any changes have been made to unitSerialsAvailable
  const [serialChangesMade, setSerialChangesMade] = useState<boolean>(false);


  const navigate = useNavigate();
  useEffect(() => {
    // Check for changes in stock-related fields whenever stock or originalQuantity change
    const hasStockChanges = stock.quantity !== originalQuantity;
    
    if (hasStockChanges) {
      console.log(typeof stock.quantity, typeof originalQuantity);
      console.log('stock', stock);
      console.log('originalQuantity', originalQuantity);
    }
  
    setStockChangesMade(hasStockChanges);
  }, [stock, originalQuantity]);
  

  useEffect(() => {
    // Check for changes in unitSerialsAvailable
    const hasSerialChanges =
      JSON.stringify(unitSerialsAvailable) !== JSON.stringify(unitSerialsAvailable);

    setSerialChangesMade(hasSerialChanges);
  }, [unitSerialsAvailable, unitSerialsAvailable]);

  useEffect(() => {

    if (isEditing) {
      axios
        .get(`http://localhost:3001/stock/${id}`)
        .then((response) => {
          setStock(response.data);
          setOriginalQuantity(response.data.quantity);
          axios
            .get(`http://localhost:3001/unit-serials-by-stock/${id}`)
            .then((res) => {
              const availableSerials = res.data.filter((serial: UnitSerial) => serial.isAvailable);
              const notAvailableSerials = res.data.filter((serial: UnitSerial) => !serial.isAvailable);

              setUnitSerialsAvailable(availableSerials);
              setUnitSerialsNotAvailable(notAvailableSerials);

              // Check if serials are available and update the state
              if (availableSerials.length === 0) {
                setSerialsAvailable(false);
              }
            })
            .catch((e) => {
              console.error('Error fetching Unit Serials:', e);
            });
        })
        .catch((error) => {
          console.error('Error fetching stock:', error);
        });
    }
  }, [id, isEditing]);

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value < originalQuantity && !serialsAvailable) {
        // Prevent reducing the quantity below the base value when serials are not available
        return;
      }

      const updatedSerials = Array.from({ length: value }, (_, index) => ({
        serial_number: unitSerialsAvailable[index]?.serial_number || '',
        stock_id: '0',
        isAvailable: true,
      }));
      setUnitSerialsAvailable(updatedSerials);
      handleStockChange(e);
    }
  };

  const handleSerialInputChange = (index: number, value: string) => {
    const updatedSerials = [...unitSerialsAvailable];
    updatedSerials[index].serial_number = value;
    setUnitSerialsAvailable(updatedSerials);
  };

  const handleAddSerial = async () => {
    const numberOfNewSerials = stock.quantity - originalQuantity;

    if (numberOfNewSerials > 0) {
      const newSerials = Array.from({ length: numberOfNewSerials }, () => ({
        stock_id: stock?._id,
        serial_number: '',
        isAvailable: true,
      }));

      try {
        const responses = await Promise.all(
          newSerials.map((newSerial) =>
            axios.post('http://localhost:3001/addUnitSerial', newSerial)
          )
        );

        console.log('Added new serials:', responses.map((response) => response.data));
      } catch (error) {
        console.error('Error adding new serials:', error);
      }

      const updatedSerials = [...unitSerialsAvailable, ...newSerials];
      setUnitSerialsAvailable(updatedSerials);
    }
  };

  const handleRemoveSerial = (rowNumber: number) => {
    try {

      const updatedSerials = unitSerialsAvailable.filter((_, idx) => idx !== rowNumber);
      setUnitSerialsAvailable(updatedSerials);

      if (updatedSerials.length === 0) {

        setSerialsAvailable(false);
      }

    } catch (error) {
      console.error('Error deleting serial:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Delete the old serial numbers related to the stock
        await axios.delete(`http://localhost:3001/unit-serials-by-stock/${id}`);

        // Add all the new serial numbers from the array to the unit serials
        console.log('unitSerialsAvailable', unitSerialsAvailable);
        await Promise.all(
          unitSerialsAvailable.map(async (newSerial) => {
            // Update the stock_id property
            newSerial.stock_id = id;
            try {
              const response = await axios.post('http://localhost:3001/addUnitSerial', newSerial);
              console.log('Added new serial:', response.data);
              return response.data;
            } catch (error) {
              console.error('Error adding new serial:', error);
              throw error; // Re-throw the error to handle it later if needed
            }
          })
        );

        stock.quantity = unitSerialsAvailable.length;

        // Update the stock data
        await axios.patch(`http://localhost:3001/stock/${id}`, stock);
        console.log('Stock updated:', stock);
      } else {
        // Add the stock data
        const response = await axios.post('http://localhost:3001/addStock', stock);
        console.log('Stock added:', response.data);

        // Add all the new serial numbers from the array to the unit serials
        await Promise.all(
          unitSerialsAvailable.map((newSerial) =>
            axios.post('http://localhost:3001/addUnitSerial', newSerial)
          )
        );
      }
      // Redirect or perform other actions after successful submission
      // For example, navigate to a different page
      navigate(-1);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="inventory-form-container">
        <Button onClick={() => navigate(-1)} className="back-button">
          Back
        </Button>
        <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label htmlFor="quantity">Quantity:</Form.Label>
            <Form.Control
              type="number"
              id="quantity"
              name="quantity"
              value={stock.quantity}
              min={Number(originalQuantity)} // Set the minimum value
              onChange={handleQuantityChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="location">Location:</Form.Label>
            <Form.Control
              type="text"
              id="location"
              name="location"
              value={stock.location}
              onChange={handleStockChange}
            />
          </Form.Group>

          <h3>Serial Numbers:</h3>
          {unitSerialsAvailable.map((serial, index) => (
            <div key={index}>
              <Form.Control
                type="text"
                value={serial.serial_number}
                onChange={(e) => handleSerialInputChange(index, e.target.value)}
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => handleRemoveSerial(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          {unitSerialsNotAvailable.map((serial, index) => (
            <div key={index}>
              <Form.Control
                type="text"
                value={serial.serial_number}
                readOnly // Make the input read-only for not available serials
              />
            </div>
          ))}
          <Button
            type="submit"
            variant={isEditing ? 'info' : 'primary'}
            disabled={!stockChangesMade && !serialChangesMade}
          >
            {isEditing ? 'Update' : 'Add'} Inventory
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default AddEditInventoryForm;
