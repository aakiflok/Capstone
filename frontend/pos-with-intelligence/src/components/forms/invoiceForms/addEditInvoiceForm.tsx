import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../navigation/nav';
import './addEditInvoiceForm.css'

// Define types for your invoice state
interface InvoiceItem {
  product_id: string;
  quantity: number;
}

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface Invoice {
  customer_id: Customer;
  user_id: User;
  date: string;
  delivery_status: boolean;
  items: InvoiceItem[];
  payment_status: boolean;
  total: number;
  tax: number;
}

const AddEditInvoiceForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<Invoice>({
    customer_id: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
    },
    user_id: {
      first_name: '',
      last_name: '',
      email: '',
    },
    date: '',
    delivery_status: false,
    items: [],
    payment_status: false,
    total: 0,
    tax: 0,
  });

  useEffect(() => {
    if (isEditing && id) {
      axios.get(`http://localhost:3001/invoices/${id}`)
        .then(response => {
          const fetchedInvoice: Invoice = response.data;
          setInvoice({
            ...fetchedInvoice,
            date: new Date(fetchedInvoice.date).toISOString().split('T')[0],
          });
        })
        .catch(error => console.error('Error fetching invoice:', error));
    }
  }, [id, isEditing]);

  const handleNestedChange = (e: ChangeEvent<HTMLInputElement>, section: keyof Invoice) => {
    const { name, value } = e.target;
    setInvoice(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [name]: value
      }
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemIndex: number, e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItems = [...invoice.items];
    const updatedItem = { ...updatedItems[itemIndex], [name]: value };
    updatedItems[itemIndex] = updatedItem as any;
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: 1 }]
    }));
  };

  const removeItem = (itemIndex: number) => {
    const filteredItems = invoice.items.filter((_, index) => index !== itemIndex);
    setInvoice(prev => ({ ...prev, items: filteredItems }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const endpoint = isEditing && id ? `/invoices/${id}` : '/invoices';
    const method = isEditing ? axios.put : axios.post;

    method(endpoint, invoice)
      .then(() => navigate(isEditing && id ? `/invoice/${id}` : '/'))
      .catch(error => console.error('Error submitting invoice:', error));
  };

  const invoiceDate = new Date(invoice?.date).toLocaleDateString('en-US');
  return (
    <>
      <Navbar />
      <div className="invoice-form-container">
        <h2>{isEditing ? 'Edit Invoice' : 'Add an Invoice'}</h2>
        <form className="invoice-form" onSubmit={handleSubmit}>
          {/* Customer Information */}
          <section className="customer-info">
            <h3>Customer Information</h3>
            <label>
              Name:
              <input
                type="text"
                name="first_name"
                value={invoice.customer_id.first_name}
                onChange={(e) => handleNestedChange(e, 'customer_id')}
                placeholder="First Name"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={invoice.customer_id.email}
                onChange={(e) => handleNestedChange(e, 'customer_id')}
                placeholder="Email"
              />
            </label>
            {/* Add other customer fields here */}
          </section>

          {/* Sales Staff Information */}
          <section className="user-info">
            <h3>Sales Staff Information</h3>
            <label>
              Sales Staff:
              <input
                type="text"
                name="first_name"
                value={invoice.user_id.first_name}
                onChange={(e) => handleNestedChange(e, 'user_id')}
                placeholder="First Name"
              />
            </label>
            {/* Add other user fields here */}
          </section>

          {/* Invoice Details */}
          <section className="invoice-details">
            <h3>Invoice Details</h3>
            <label>
              Date:
              <input type="date" name="date" value={invoice.date} onChange={handleChange} />
            </label>
            <label>
              Delivery Status:
              <input
                type="text"
                name="delivery_status"
                value={invoice.delivery_status ? 'Delivered' : 'In Progress'}
                onChange={handleChange}
              />
            </label>
            <label>
              Payment Status:
              <input
                type="text"
                name="payment_status"
                value={invoice.payment_status ? 'Paid' : 'Pending'}
                onChange={handleChange}
              />
            </label>
          </section>

          {/* Product List */}
          <section className="product-list">
            <h3>Products</h3>
            {invoice.items.map((item, index) => (
              <div key={index} className="product-item">
                <input
                  type="text"
                  name="product_id"
                  value={item.product_id}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Product ID"
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  placeholder="Quantity"
                />
                {/* Add Price field here */}
                <button type="button" onClick={() => removeItem(index)}>
                  Remove Item
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem}>Add Item</button>
          </section>

          <button type="submit">{isEditing ? 'Update Invoice' : 'Add Invoice'}</button>
        </form>
      </div>
    </>
  );
};

export default AddEditInvoiceForm;