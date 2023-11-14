import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import './invoice.css'
import { useNavigate } from 'react-router-dom';

const Invoice: React.FC = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('https://pos-crud.onrender.com/invoices');
        setInvoiceList(response.data);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

    fetchInvoices();
  }, []);

  const handleViewClick = (invoice: any) => {
    navigate(`/invoice/${invoice._id}`);
  };

  return (
    <>
      <Navbar />
      <div className="invoices-container">
        <div className="content">
          <h2>Invoice Content</h2>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Delivery Status</th>
                <th>Customer Name</th>
                <th>Total</th>
                <th>Date Issued</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice: any) => (
                <tr key={invoice._id}> {/* Ensure this key is unique */}
                  <td>
                    <input
                      type="checkbox"
                      checked={invoice.delivery_status}
                      disabled={true}
                    />
                  </td>
                  <td>{invoice.customerName}</td>
                  <td>${invoice.total}</td>
                  <td>{new Date(invoice.dateIssued).toLocaleDateString()}</td>
                  <td>{invoice.employeeName}</td>
                  <td>
                    <button onClick={() => handleViewClick(invoice)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
};

export default Invoice;
