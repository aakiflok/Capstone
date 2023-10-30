import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './addEditInventoryForm.css'
import Navbar from '../../navigation/nav';

interface Stock {
  quantity: number;
  location: string;
}

interface UnitSerial {
  Unit_Serial_id: number;
  stock_id: number;
  serial_number: string;
  isAvailable: boolean;
}

const AddEditInventoryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [stock, setStock] = useState<Stock>({
    quantity: 0,
    location: '',
  });

  const [unitSerials, setUnitSerials] = useState<UnitSerial[]>([]);

  useEffect(() => {
    if (isEditing) {
      // Get the stock and its associated serial numbers
      axios.get(`http://localhost:3001/stocks/${id}`)
        .then((response) => {
          setStock(response.data);
          axios.get(`http://localhost:3001/unit-serials-by-stock/${id}`)
            .then((res) => {
              setUnitSerials(res.data);
            })
            .catch((e) => {
              console.error('Error fetching Unit Serials:', e);
            })
        })
        .catch((error) => {
          console.error('Error fetching stock:', error);
        });
    }
  }, [id, isEditing]);

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStock(prev => ({ ...prev, [name]: value }));
  };

  const handleSerialChange = (index: number, field: keyof UnitSerial, value: string | number | boolean) => {
    const updatedSerials = [...unitSerials];
    updatedSerials[index][field] = value as never;
    setUnitSerials(updatedSerials);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://localhost:3001/updateStock/${id}`, stock)
        .then(response => {
          console.log('Stock updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating stock:', error);
        });
    } else {
      axios.post('http://localhost:3001/addStock', stock)
        .then(response => {
          console.log('Stock added:', response.data);
        })
        .catch(error => {
          console.error('Error adding stock:', error);
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="inventory-form-container">
        <h2>{isEditing ? 'Edit Inventory' : 'Add Inventory'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Count</label>
            <span>{parseInt(id ?? '', 10) || 'New'}</span>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={stock.quantity}
              onChange={handleStockChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={stock.location}
              onChange={handleStockChange}
              required
            />
          </div>
          {unitSerials.map((serial, index) => (
            <div key={serial.Unit_Serial_id} className="form-group">
              <label htmlFor={`serial_number_${index}`}>Serial Number {index + 1}</label>
              <input
                type="text"
                id={`serial_number_${index}`}
                value={serial.serial_number}
                onChange={e => handleSerialChange(index, 'serial_number', e.target.value)}
                required
                disabled={!serial.isAvailable} // disable input if isAvailable is false
              />
            </div>
          ))}
          <button type="submit">{isEditing ? 'Update Inventory' : 'Add Inventory'}</button>
        </form>
      </div>
    </>
  );
}

export default AddEditInventoryForm;
