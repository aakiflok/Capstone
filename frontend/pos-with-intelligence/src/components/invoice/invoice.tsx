import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap'; // Import React-Bootstrap components
import './invoice.css';

const Invoice: React.FC = () => {
  const [invoiceList, setInvoiceList] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(false);
  const [totalRange, setTotalRange] = useState({ min: 0, max: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('https://pos-crud.onrender.com/invoices');
        const invoices = response.data;
    
        // Calculate the maximum total
        let maxTotal = 0;
        for (const invoice of invoices) {
          if (invoice.total && (invoice.total > maxTotal || maxTotal === 0)) {
            maxTotal = invoice.total;
          }
        }
    
        // Update the totalRange state
        setTotalRange({ min: 0, max: maxTotal });
    
        // Set the invoice list and filtered invoices
        setInvoiceList(invoices);
        setFilteredInvoices(invoices);
      } catch (error) {
        console.error('Error fetching invoice data:', error);
      }
    };

   
    fetchInvoices();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = invoiceList.filter((invoice: any) => {
        const matchesSearchTerm = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDeliveryStatus = deliveryStatusFilter ? invoice.delivery_status : true;
        const matchesTotalRange = invoice.total >= totalRange.min && invoice.total <= totalRange.max;
        return matchesSearchTerm && matchesDeliveryStatus && matchesTotalRange;
      });
      setFilteredInvoices(filtered);
    };

    applyFilters();
  }, [searchTerm, deliveryStatusFilter, totalRange, invoiceList]);


  const handleViewClick = (invoice: any) => {
    navigate(`/invoice/${invoice._id}`);
  };

  return (
    <>
      <Navbar />
      <Container fluid className="mt-4">
        <Row>
          {/* Filters Column */}
          <Col md={3} className="mb-3">
            <h2>Filters</h2>
            <Form>
              <Form.Group controlId="searchTerm">
                <Form.Control
                  type="text"
                  placeholder="Search by customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="deliveryStatus">
                <Form.Check
                  type="checkbox"
                  label="Filter by delivery status"
                  checked={deliveryStatusFilter}
                  onChange={(e) => setDeliveryStatusFilter(e.target.checked)}
                />
              </Form.Group>

              <Form.Group controlId="totalRangeMin">
                <Form.Label>Min Total</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Min total"
                  value={totalRange.min}
                  onChange={(e) => setTotalRange({ ...totalRange, min: Number(e.target.value) })}
                />
              </Form.Group>

              <Form.Group controlId="totalRangeMax">
                <Form.Label>Max Total</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Max total"
                  value={totalRange.max}
                  onChange={(e) => setTotalRange({ ...totalRange, max: Number(e.target.value) })}
                />
              </Form.Group>
            </Form>
            <br></br>
            <Link to="/addInvoice" className="invoice-tile-link">
            <Button className="invoice-product-button">Add Invoice</Button>
          </Link>
          </Col>

          {/* Invoice Table Column */}
          <Col md={9}>
            <Container>
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
                  {filteredInvoices.map((invoice: any) => (
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Invoice;
