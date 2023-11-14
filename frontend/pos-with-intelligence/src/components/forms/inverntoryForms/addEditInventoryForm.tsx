import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './addEditInventoryForm.css';
import Navbar from '../../navigation/nav';

interface Stock {
  _id: string,
  quantity: number;
  location: string;
}

interface UnitSerial {
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

  const [unitSerials, setUnitSerials] = useState<UnitSerial[]>([]);
  const [originalQuantity, setOriginalQuantity] = useState<number>(0);


  useEffect(() => {
    if (isEditing) {
      axios.get(`https://pos-crud.onrender.com//stock/${id}`)
        .then((response) => {
          setStock(response.data);
          setOriginalQuantity(response.data.quantity);
          axios.get(`https://pos-crud.onrender.com//unit-serials-by-stock/${id}`)
            .then((res) => {
              setUnitSerials(res.data);
            })
            .catch((e) => {
              console.error('Error fetching Unit Serials:', e);
            });
        })
        .catch((error) => {
          console.error('Error fetching stock:', error);
        });

      const totalRows = stock.quantity;
      while (unitSerials.length < totalRows) {
        unitSerials.push({
          serial_number: '',
          stock_id: '0',
          isAvailable: false,
        });
      }
    }
  }, [id, isEditing]);

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStock(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    const updatedSerials = [...unitSerials];
    while (updatedSerials.length < value) {
      updatedSerials.push({
        serial_number: '',
        stock_id: '0',
        isAvailable: false,
      });
    }
    if (updatedSerials.length > value) {
      updatedSerials.length = value;
    }
    setUnitSerials(updatedSerials);
    handleStockChange(e);
  };

  const handleSerialInputChange = (index: number, value: string) => {
    const updatedSerials = [...unitSerials];
    updatedSerials[index].serial_number = value;
    setUnitSerials(updatedSerials);
  };

  const handleAddSerial = async () => {
    const numberOfNewSerials = stock.quantity - originalQuantity;

    for (let i = 0; i < numberOfNewSerials; i++) {
      const newSerial: Partial<UnitSerial> = {
        stock_id: stock?._id,
        serial_number: unitSerials[unitSerials.length - numberOfNewSerials + i]?.serial_number,
        isAvailable: true,
      };
      try {
        const response = await axios.post('https://pos-crud.onrender.com//addUnitSerial', newSerial);
        console.log('Added new serial:', response.data);
      } catch (error) {
        console.error('Error adding new serial:', error);
      }
    }
  };

  const handleRemoveSerial = async (rowNumber: number) => {
    try {
      const serialToDelete = unitSerials[rowNumber];
      const response = await axios.delete(`https://pos-crud.onrender.com//unit-serial/${serialToDelete}`);
      console.log('Deleted serial:', response.data);
      setUnitSerials(prev => prev.filter((_, idx) => idx !== rowNumber));
    } catch (error) {
      console.error('Error deleting serial:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      axios.patch(`https://pos-crud.onrender.com//stock/${id}`, stock)
        .then(response => {
          console.log('Stock updated:', response.data);
        })
        .catch(error => {
          console.error('Error updating stock:', error);
        });
    } else {
      axios.post('https://pos-crud.onrender.com//addStock', stock)
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
          <div>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={stock.quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={stock.location}
              onChange={handleStockChange}
            />
          </div>

          <h3>Serial Numbers:</h3>
          {unitSerials.map((serial, index) => (
            <div key={index}>
              <input
                type="text"
                value={serial.serial_number}
                onChange={(e) => handleSerialInputChange(index, e.target.value)}
              />
              <button type="button" onClick={() => handleRemoveSerial(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSerial} disabled={stock.quantity <= originalQuantity}>
            Add Serial
          </button>
          <div>
            <button type="submit">{isEditing ? 'Update' : 'Add'} Inventory</button>
          </div>
        </form>
      </div>
    </>
  );
}


export default AddEditInventoryForm;
