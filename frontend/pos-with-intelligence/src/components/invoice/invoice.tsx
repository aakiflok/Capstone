// InvoiceList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Replace with your actual API endpoint
const INVOICES_API_ENDPOINT = 'http://localhost:3001/api/invoices';

const InvoiceList = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(INVOICES_API_ENDPOINT);
        setInvoiceList(response.data);
      } catch (error) {
        setError('Error fetching invoices');
        console.error('There was an error!', error);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, []);

  const handleAddInvoice = () => {
    // Navigate to the Add Invoice Form page
    // Replace with your routing logic, e.g., history.push('/invoices/new');
  };

  if (loading) return <p>Loading invoices...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Invoice List</h1>
      <button onClick={handleAddInvoice}>Add Invoice</button>
      <table>
        <thead>
          <tr>
            <th>Invoice Number</th>
            <th>Customer Name</th>
            <th>Delivery Status</th>
            <th>Invoice Value</th>
            <th>Sold By</th>
          </tr>
        </thead>
        <tbody>
          {invoiceList.map((invoice: any) => (
            <tr key={invoice._id}>
              <td>{invoice.invoiceNumber}</td>
              <td>{invoice.customerName}</td>
              <td>{invoice.deliveryStatus}</td>
              <td>${invoice. .toFixed(2)}</td>
              <td>{invoice.soldBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
