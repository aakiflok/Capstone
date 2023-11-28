import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Form } from 'react-bootstrap'; // Import React-Bootstrap components
import './invoice.css';

const Invoice: React.FC = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('http://localhost:3001/invoices');
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
      <Container className="invoices-container">
        <div style={{ textAlign: 'center' }}>
          <Link to="/addInvoice" className="invoice-tile-link">
            <Button className="invoice-product-button">Add Invoice</Button>
          </Link>
        </div>
        <Container className="content">
          <h2>Invoice Content</h2>
          <Table striped bordered hover className="invoice-table">
            <thead>
              <tr>
                <th className="text-center">Delivery Status</th>
                <th className="text-center">Customer Name</th>
                <th className="text-center">Total</th>
                <th className="text-center">Date Issued</th>
                <th className="text-center">User</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice: any) => (
                <tr key={invoice._id}>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={invoice.delivery_status}
                    />
                  </td>
                  <td className="text-center">{invoice.customerName}</td>
                  <td className="text-center">${invoice.total}</td>
                  <td className="text-center">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="text-center">{invoice.employeeName}</td>
                  <td className="text-center">
                    <Button onClick={() => handleViewClick(invoice)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
};

export default Invoice;
