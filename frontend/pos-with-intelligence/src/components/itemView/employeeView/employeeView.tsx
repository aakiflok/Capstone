import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Alert } from 'react-bootstrap';

const EmployeeView: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${id}`);

        if (isMounted) {
          setSelectedEmployee(response.data);
        }
      } catch (err) {
        console.log('Error fetching data:', err);
        // Handle the error here
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!selectedEmployee) {
    return (
      <>
        <Navbar />
        <div
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          Loading...
        </div>
      </>
    );
  }

  const handleDeleteEmployee = async () => {
    try {
      // Check if the employee is associated with any invoices
      const invoiceResponse = await axios.get(
        `http://localhost:3001/associatedInvoices?employeeId=${id}`
      );
      const associatedInvoices = invoiceResponse.data;

      if (associatedInvoices.length > 0) {
        // If there are associated invoices, show a pop-up message or alert to the user
        // You can use a modal or any other user-friendly way to display the message
        // Here, we'll use a simple window.confirm
        const confirmDelete = window.confirm(
          'This employee is associated with one or more invoices. Deleting them will also delete those invoices. Are you sure you want to continue?'
        );

        if (!confirmDelete) {
          // User canceled the deletion, so return without deleting the employee
          return;
        }
      }

      // If there are no associated invoices or the user confirmed the deletion, proceed with deleting the employee
      await axios.delete(`http://localhost:3001/users/${id}`);
      navigate('/employees');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Navbar />
      <Container fluid className="d-flex flex-column align-items-center  ">
        <h2 className="mt-4">Employee Details</h2>
        <Row className="w-100 align-items-center" style={{ justifyContent: 'space-evenly' }}>
          <Col md={8}>
            <Table
              striped
              bordered
              hover
              style={{
                maxWidth: '800px', // Adjust the maximum width as needed
                width: '100%',
                margin: '0 auto', // Center the table horizontally
              }}
            >
              <tbody>
                <tr>
                  <td>Employee ID</td>
                  <td>{selectedEmployee._id}</td>
                </tr>
                <tr>
                  <td>First Name</td>
                  <td>{selectedEmployee.first_name}</td>
                </tr>
                <tr>
                  <td>Last Name</td>
                  <td>{selectedEmployee.last_name}</td>
                </tr>
                <tr>
                  <td>Birthdate</td>
                  <td>{selectedEmployee.birthdate}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>{selectedEmployee.address}</td>
                </tr>
                <tr>
                  <td>Username</td>
                  <td>{selectedEmployee.username}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{selectedEmployee.email}</td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>{selectedEmployee.role}</td>
                </tr>
                <tr>
                  <td>Joining Date</td>
                  <td>{selectedEmployee.joining_date}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <div className="mt-4 d-flex justify-content-center align-items-center w-100">
          <Link to={`/editEmployee/${id}`}>
            <Button variant="primary">Edit Employee</Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDeleteEmployee}
            className="ml-3"
          >
            Delete Employee
          </Button>
        </div>
      </Container>
    </>
  );
};

export default EmployeeView;