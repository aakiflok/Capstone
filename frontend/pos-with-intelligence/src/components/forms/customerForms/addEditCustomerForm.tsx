import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../../navigation/nav';
import './addEditCustomerForm.css'
import { useNavigate } from 'react-router-dom';
interface Customer {
    first_name: string;
    last_name: string;
    address?: string;
    city?: string;
    email?: string;
    phone_number?: string;
    state?: string;
    zip_code?: string;
}

const AddEditCustomerForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer>({
        first_name: '',
        last_name: '',
    });

    useEffect(() => {
        if (isEditing) {
            axios.get(`https://pos-crud.onrender.com/customers/${id}`)
                .then((response) => {
                    setCustomer(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching customer:', error);
                });
        }
    }, [id, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEditing) {
            await axios.patch(`https://pos-crud.onrender.com/customers/${id}`, customer)
            navigate("/customers");
        } else {
            await axios.post('https://pos-crud.onrender.com/customers', customer)
            navigate("/customers");
        }
    };
    // ... (rest of the imports and component setup)

    return (
        <>
            <Navbar />
            <div className="customer-form-container">
                <h2 className="form-title">{isEditing ? 'Edit Customer' : 'Add Customer'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">First Name:</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={customer.first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="last_name">Last Name:</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={customer.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={customer.address || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={customer.city || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={customer.state || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="zip_code">Zip Code:</label>
                        <input
                            type="text"
                            id="zip_code"
                            name="zip_code"
                            value={customer.zip_code || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={customer.email || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number:</label>
                        <input
                            type="text"
                            id="phone_number"
                            name="phone_number"
                            value={customer.phone_number || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-action">
                        <button type="submit" className="submit-button">{isEditing ? 'Update' : 'Add'} Customer</button>
                    </div>
                </form>
            </div>
        </>
    );
};
export default AddEditCustomerForm;