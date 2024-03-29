import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './invoiceView.css'
import Navbar from '../../navigation/nav';

const InvoiceView: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await axios.get(`https://pos-crud.onrender.com/invoices/${id}`);
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
  const calculateTotal = (items: any[]): number => {
    return items.reduce((acc, current) => acc + (current.quantity * current.final_price), 0);
  };

  // Format the invoice date
  const invoiceDate = new Date(invoiceData?.date).toLocaleDateString('en-US');

  return (
    <>
      <Navbar></Navbar>
      <div className="invoice-container">
        <div className="invoice-header">
          <div className="invoice-details">
            <p><strong>Name:</strong> {invoiceData?.customer_id.first_name}</p>
            <p><strong>Delivery Status:</strong> {invoiceData?.delivery_status ? 'Delivered' : 'In Progress'}</p>
            <p><strong>Sales Staff:</strong> {invoiceData.user_id.first_name} {invoiceData.user_id.last_name}</p>
            <p><strong>Date:</strong> {invoiceDate}</p>
            <p><strong>Payment Status:</strong> {invoiceData.payment_status ? 'Paid' : 'Pending'}</p>
          </div>
          <div className="invoice-contact">
            <p><strong>Address:</strong> {invoiceData.customer_id.address} {invoiceData.customer_id.state} {invoiceData.customer_id.city} {invoiceData.customer_id.zip_code}</p>
            <p><strong>Phone:</strong> {invoiceData.customer_id.phone_number}</p>
            <p><strong>Email:</strong> {invoiceData.customer_id.email}</p>
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
            <tbody>
              {invoiceData.items.map((item: any) => (
                <tr key={item._id}>
                  <td>{item.product_id.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.final_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary">
          <div className="invoice-totals">
            <p><strong>Total:</strong> ${invoiceData.total}</p>
          </div>
        </div>

        <div className="invoice-actions">
          <Link to={`/editInvoice/${id}`}>
            <button style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
              Edit Invoice
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default InvoiceView;
