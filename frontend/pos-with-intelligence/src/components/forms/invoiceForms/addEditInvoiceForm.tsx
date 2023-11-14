import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../navigation/nav';
import './invoiceForm.css';

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
  customer: Customer;
  user: User;
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
    customer: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
    },
    user: {
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
      axios.get(`/invoices/${id}`)
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
          {/* Form fields for invoice */}
          {/* Example: */}
          <input type="text" name="customer_id" value={invoice?.customer.first_name} onChange={handleChange} placeholder="Customer ID" />
          <input type="text" name="user_id" value={invoice.user.first_name} onChange={handleChange} placeholder="Sales Staff ID" />
          <input type="date" name="date" value={invoice?.date} onChange={handleChange} />
          <input type="text" name="delivery_status" value={invoice.delivery_status ? 'Delivered' : 'In Progress'} onChange={handleChange} placeholder="Delivery Status" />
          <input type="text" name="payment_status" value={invoice.payment_status? 'Paid': 'Pending'} onChange={handleChange} placeholder="Payment Status" />
          <input type="number" name="tax" value={invoice.tax} onChange={handleChange} placeholder="Tax" />
          <input type="number" name="total" value={invoice.total} onChange={handleChange} placeholder="Total" />
          {invoice.items.map((item, index) => (
            <div key={index}>
              <input type="text" name="product_id" value={item.product_id} onChange={(e) => handleItemChange(index, e)} />
              <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
              <button type="button" onClick={() => removeItem(index)}>Remove Item</button>
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>

          <button type="submit">{isEditing ? 'Update Invoice' : 'Add Invoice'}</button>
        </form>
      </div>
    </>  
  );
};

export default AddEditInvoiceForm;