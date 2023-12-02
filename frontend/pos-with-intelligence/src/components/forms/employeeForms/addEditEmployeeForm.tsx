import React, { useState, useEffect } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './addEditEmployeeForm.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

interface Employee {
  first_name: string;
  last_name: string;
  birthdate: string;
  address: string;
  username: string;
  password: string;
  email: string;
  role: string;
  joining_date: string;
}

const AddEditEmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee>({
    first_name: '',
    last_name: '',
    birthdate: '',
    address: '',
    username: '',
    password: '',
    email: '',
    role: 'employee',
    joining_date: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing) {
      axios.get(`https://pos-crud.onrender.com/users/${id}`)
        .then((response) => {
          setEmployee(response.data);
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        await axios.put(`https://pos-crud.onrender.com/updateUser/${id}`, employee);
        navigate("/employees");
         
      } else {
        await axios.post('https://pos-crud.onrender.com/addUser', employee)
          
        navigate("/employees");
        await axios.post('https://pos-crud.onrender.com/send-email', {
              email: employee.email,
              message: `Account details...`
            })
            navigate("/employees");
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!employee.first_name.trim()) {
      errors.first_name = 'First Name is required';
    }

    if (!employee.last_name.trim()) {
      errors.last_name = 'Last Name is required';
    }

    if (!employee.birthdate) {
      errors.birthdate = 'Birthdate is required';
    }

    if (!employee.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!employee.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!employee.password.trim()) {
      errors.password = 'Password is required';
    }

    if (!employee.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(employee.email)) {
      errors.email = 'Invalid email format';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };
  return (
    <>
      <Navbar />
      <Container>
        <h2 className="mt-4">{isEditing ? 'Edit Employee' : 'Add an Employee'}</h2>
        <Form className="employee-form mt-4" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={employee.first_name}
                  onChange={handleChange}
                  required
                />
                {formErrors.first_name && (
                  <Alert variant="danger">{formErrors.first_name}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={employee.last_name}
                  onChange={handleChange}
                  required
                />
                {formErrors.last_name && (
                  <Alert variant="danger">{formErrors.last_name}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  name="birthdate"
                  value={employee.birthdate}
                  onChange={handleChange}
                  required
                />
                {formErrors.birthdate && (
                  <Alert variant="danger">{formErrors.birthdate}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={employee.address}
                  onChange={handleChange}
                  required
                />
                {formErrors.address && (
                  <Alert variant="danger">{formErrors.address}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={employee.username}
                  onChange={handleChange}
                  required
                />
                {formErrors.username && (
                  <Alert variant="danger">{formErrors.username}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={employee.password}
                  onChange={handleChange}
                  required
                />
                {formErrors.password && (
                  <Alert variant="danger">{formErrors.password}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  required
                />
                {formErrors.email && (
                  <Alert variant="danger">{formErrors.email}</Alert>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={employee.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  {/* Add any other roles you have here */}
                </Form.Control>
                {formErrors.role && (
                  <Alert variant="danger">{formErrors.role}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Joining Date</Form.Label>
                <Form.Control
                  type="date"
                  name="joining_date"
                  value={employee.joining_date}
                  onChange={handleChange}
                  required
                />
                {formErrors.joining_date && (
                  <Alert variant="danger">{formErrors.joining_date}</Alert>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default AddEditEmployeeForm;
