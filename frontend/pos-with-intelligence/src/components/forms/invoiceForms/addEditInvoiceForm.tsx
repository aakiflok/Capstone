import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../navigation/nav';
import './addEditInvoiceForm.css'
import { Product } from '../../../models/product.module';
import { Button, Form, Table } from 'react-bootstrap';
// Define types for your invoice state
interface InvoiceItem {
  product_id: Product;
  quantity: number;
}

interface Customer {
  _id: string;
  id: string;
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
  _id: string;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Invoice {
  _id: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [orginalDeliveryStatus, setOrginalDeliveryStatus] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    customer: '',
    user: '',
    date: '',
    delivery_status: '',
    payment_status: '',
    items: '',
  });

  const [invoice, setInvoice] = useState<Invoice>({
    _id: '',
    customer_id: {
      _id: '',
      id: '',
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
      _id: '',
      id: '',
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
    axios.get('https://pos-crud.onrender.com/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });


    if (isEditing && id) {
      axios.get(`https://pos-crud.onrender.com/invoices/${id}`)
        .then(response => {
          const fetchedInvoice: Invoice = response.data;
          setInvoice({
            ...fetchedInvoice,
            date: new Date(fetchedInvoice.date).toISOString().split('T')[0],
          });
          setOrginalDeliveryStatus(fetchedInvoice.delivery_status);
        })
        .catch(error => console.error('Error fetching invoice:', error));
    }
  }, [id, isEditing]);

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  useEffect(() => {
    axios.get('https://pos-crud.onrender.com/customers')
      .then(response => {
        setAllCustomers(response.data); // Store all customers in state
        setFilteredCustomers(response.data); // Also set all customers as initially filtered
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('https://pos-crud.onrender.com/users')
      .then(response => {
        setAllUsers(response.data); // Store all users in state
        setFilteredUsers(response.data); // Also set all users as initially filtered
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
    setFilteredUsers(filtered); // Update the filtered users
  }, [userSearchTerm, allUsers]);

  // Function to handle the selection of a user
  const handleSelectUser = (user: User) => {
    setInvoice(prevInvoice => ({
      ...prevInvoice,
      user_id: user // Assuming the user_id in the invoice should hold the entire user object
    }));
    setUserSearchTerm(''); // Clear the search term after selection
  };

  useEffect(() => {
    // Only filter from allCustomers when the search term changes
    const filtered = allCustomers.filter(customer =>
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(customerSearchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered); // Update the filtered customers
  }, [customerSearchTerm, allCustomers]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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

  const handleAddItem = (product_id: string) => {
    // Check if the product is already in the invoice items
    const existingItemIndex = invoice.items.findIndex(item => item.product_id._id === product_id);

    if (existingItemIndex !== -1) {
      // Product already exists, so increase the quantity
      const updatedItems = invoice.items.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 }; // Increase the quantity
        }
        return item;
      });

      setInvoice(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Product not in the invoice, add it as a new item
      const productToAdd = products.find(product => product._id === product_id);

      if (productToAdd) {
        const newItem = {
          product_id: productToAdd,
          quantity: 1,
          final_price: productToAdd.price
        };

        setInvoice(prev => ({
          ...prev,
          items: [...prev.items, newItem]
        }));
      } else {
        console.error('Product not found');
      }
    }
  };

  const handleItemQuantityChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value, 10);

    if (newQuantity >= 1) {
      const updatedItems = invoice.items.map((item, i) => {
        if (i === index) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setInvoice({ ...invoice, items: updatedItems });
    }
  };


  const removeItem = (itemIndex: number) => {
    const filteredItems = invoice.items.filter((_, index) => index !== itemIndex);
    setInvoice(prev => ({ ...prev, items: filteredItems }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Perform form validation
    // if (!validateForm()) {
    //   console.error('Validation failed.');
    //   return;
    // }

    // Prepare data for submission
    const invoiceData = {
      _id: invoice?._id,
      customer_id: invoice.customer_id._id,
      user_id: invoice.user_id._id,
      date: invoice.date,
      delivery_status: invoice.delivery_status,
      payment_status: invoice.payment_status,
      total: calculateTotal(),
      items: invoice.items.map(item => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        final_price: item.product_id.price * item.quantity
      }))
    };

    try {
      // Determine if it's an edit or add operation
      if (isEditing) {
        // Update existing invoice
        await axios.put(`https://pos-crud.onrender.com/invoices/${id}`, invoiceData);

        navigate(`/invoice/${id}`);
      } else {
        // Create new invoice
        try {
          const response = await axios.post('https://pos-crud.onrender.com/invoices', invoiceData);
          navigate(`/invoice/${id}`);
          // handle success
        } catch (error: any) {
          console.error('Error submitting invoice:', error.response || error);
        }
      }

      // Redirect or handle UI update after successful operation
      // navigate(isEditing ? `/invoice/${id}` : '/invoices');
    } catch (error) {
      console.error('Error submitting invoice:', error);
      // Handle error in UI, e.g., showing an error message
    }
  };

  // Function to calculate the total invoice amount
  const calculateTotal = () => {
    return invoice.items.reduce((acc, item) => acc + item.quantity * item.product_id.price, 0);
  };

  const handleCustomerSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomerSearchTerm(event.target.value);
  };

  const handleUserSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserSearchTerm(event.target.value);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setInvoice(prevInvoice => ({
      ...prevInvoice,
      customer_id: customer // Assign the selected customer object to customer_id
    }));
    setCustomerSearchTerm(''); // Clear the search term after selection
  };

  const renderProductRow = (item: InvoiceItem, index: number) => (
    <tr key={index}>
      <td>{item.product_id.name}</td>
      <td>
        <Form.Control
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e: any) => handleItemQuantityChange(index, e)}
          disabled={orginalDeliveryStatus}
        />
      </td>
      <td>${item.product_id.price.toFixed(2)}</td>
      <td>${(item.quantity * item.product_id.price).toFixed(2)}</td>
      <td>
        <Button
          variant="danger"
          onClick={() => removeItem(index)}
          disabled={orginalDeliveryStatus}>
          Remove
        </Button>
      </td>
    </tr>
  );

  const invoiceDate = new Date(invoice?.date).toLocaleDateString('en-US');
  const handleChangeCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setInvoice(prev => ({ ...prev, [name]: checked }));
  };

  function handlePaymentClick(): void {
    navigate(`/payment/${id}`);
  }

  return (
    <>
      <Navbar />
      <div className="invoice-form-container" style={{ textAlign: 'center' }}>
        <h2>{isEditing ? 'Edit Invoice' : 'Add an Invoice'}</h2>
        <form className="invoice-form" onSubmit={handleSubmit}>
          {/* Customer Information */}
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search Customers"
              value={customerSearchTerm}
              onChange={handleCustomerSearchChange}
              disabled={orginalDeliveryStatus}
            // onBlur={() => setErrors({ ...errors, customer: validateCustomer(invoice.customer_id) })}
            />
            <div className="error-message">{errors.customer}</div>
            {customerSearchTerm && (
              <div className="search-results-container">
                {filteredCustomers.map(customer => (
                  <div key={customer.id} className="search-result-item">
                    {`${customer.first_name} ${customer.last_name}`}
                    <button className="add-button" onClick={() => handleSelectCustomer(customer)}>Add</button>
                  </div>
                ))}
              </div>
            )}
            {invoice.customer_id && invoice.customer_id.first_name && ( // Check if a customer has been selected
              <div className="selected-customer-details">
                <h3>Selected Customer</h3>
                <p>Name: {invoice.customer_id.first_name} {invoice.customer_id.last_name}</p>
                <p>Email: {invoice.customer_id.email}</p>
                <p>Phone: {invoice.customer_id.phone_number}</p>
                <p>Address: {invoice.customer_id.address}</p>
                <p>City: {invoice.customer_id.city}</p>
                <p>State: {invoice.customer_id.state}</p>
                <p>Zip Code: {invoice.customer_id.zip_code}</p>
                {/* If there are additional details, continue listing them here */}
              </div>
            )}

          </div>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search Users"
              value={userSearchTerm}
              onChange={handleUserSearchChange}
              disabled={orginalDeliveryStatus}
          
            />
            <div className="error-message">{errors.user}</div>
            {userSearchTerm && (
              <div className="search-results-container">
                {filteredUsers.map(user => (
                  <div key={user.id} className="search-result-item">
                    {`${user.first_name} ${user.last_name}`}
                    <button className="add-button" onClick={() => handleSelectUser(user)}>Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display selected user's details */}
          {invoice.user_id && invoice.user_id.first_name && (
            <div className="selected-user-details">
              <h3>Selected User</h3>
              <p>Name: {invoice.user_id.first_name} {invoice.user_id.last_name}</p>
              <p>Email: {invoice.user_id.email}</p>
            </div>
          )}

          {/* Invoice Details */}
          <section className="invoice-details">
            <h3>Invoice Details</h3>
            <label>
              Date:
              <input type="date" name="date" value={invoice.date} disabled={orginalDeliveryStatus} onChange={handleChange} />
            </label><br />
            <label>
              Delivery Status:
              <input
                type="checkbox"
                name="delivery_status"
                checked={invoice.delivery_status}
                onChange={handleChangeCheckbox}
              />
              {invoice.delivery_status ? ' Delivered' : ' In Progress'}
            </label>
            <br />
            <label>
              Payment Status:
              <input
                type="checkbox"
                name="payment_status"
                checked={invoice.payment_status}
                onChange={handleChangeCheckbox}
                disabled={orginalDeliveryStatus}
              />
              {invoice.payment_status ? ' Paid' : ' Pending'}
            </label><br />
          </section>

          <div className="search-container">
            <h3 style={{ textAlign: 'center' }}>Search Products </h3>
            <input
              className="search-input"
              type="text"
              placeholder="Search Products"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={orginalDeliveryStatus}
            />
            {searchTerm && ( // This line ensures the product list only appears when searchTerm is not empty
              <div className="product-list-container">
                {filteredProducts.map(product => (
                  <div key={product._id} className="product-item">
                    {product.name}
                    <Button type="button" disabled={orginalDeliveryStatus} className="add-button" onClick={() => handleAddItem(product._id)}>Add</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Product List */}
          <section className="product-list">
            <h3>Products</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map(renderProductRow)}
              </tbody>
            </Table>
          </section>
          {!invoice.payment_status && <Button onClick={() => handlePaymentClick()}>
            Pay
          </Button>}
          <Button type="submit" disabled={orginalDeliveryStatus}>{isEditing ? 'Update Invoice' : 'Add Invoice'}</Button>
        </form >
      </div >
    </>
  );
};

export default AddEditInvoiceForm;