import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table, Alert } from 'react-bootstrap';

const EmployeeView: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://pos-crud.onrender.com/users/${id}`);

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
      const response = await axios.delete(`https://pos-crud.onrender.com/users/${id}`);
      if (response.status === 200) {
        setSuccessMessage('Employee deleted successfully');
        navigate('/employees');
      } else {
        setErrorMessage(response.data.message);
      }
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
        
        {successMessage && (
          <Alert variant="success" className="mt-3">
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        )}
      </Container>
    </>
  );
};

export default EmployeeView;