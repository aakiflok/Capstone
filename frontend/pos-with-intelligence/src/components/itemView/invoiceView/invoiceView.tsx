import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './invoiceView.css'

const InvoiceView: React.FC = () => {
  const [invoiceData, setInvoiceData] =  useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/invoices/${id}`);
        setInvoiceData(response.data);
      } catch (err) {
        console.error("Error fetching invoice data:", err);
      }
    };

    fetchInvoiceData();
  }, [id]);

  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  // Format the invoice date
  const invoiceDate = new Date(invoiceData?.date).toLocaleDateString('en-US');

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <div className="invoice-details">
          <p><strong>Name:</strong> {invoiceData?.customerName}</p>
          <p><strong>Delivery Status:</strong> {invoiceData?.deliveryStatus}</p>
          <p><strong>Sales Staff:</strong> {invoiceData.salesStaff}</p>
          <p><strong>Date:</strong> {invoiceDate}</p>
          <p><strong>Payment Status:</strong> {invoiceData.paymentStatus}</p>
        </div>
        <div className="invoice-contact">
          <p><strong>Address:</strong> {invoiceData.address}</p>
          <p><strong>Phone:</strong> {invoiceData.phone}</p>
          <p><strong>Email:</strong> {invoiceData.email}</p>
        </div>
      </div>

      <div className="invoice-body">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          {/* <tbody>
            {invoiceData.items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>

      <div className="invoice-summary">
        <div className="invoice-totals">
          <p><strong>Tax:</strong> ${invoiceData.tax}</p>
          <p><strong>Total:</strong> ${invoiceData.total}</p>
        </div>
      </div>

      <div className="invoice-actions">
        <button>Edit Invoice</button>
      </div>
    </div>
  );
};

export default InvoiceView;
