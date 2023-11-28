import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../navigation/nav';
import './employee.css';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap'; // Import React-Bootstrap components

const Employees: React.FC = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setEmployeeList(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleViewClick = (employee: any) => {
    setSelectedEmployee(employee);
    navigate(`/employees/${employee._id}`);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  return (
    <>
      <Navbar></Navbar>
      <Container className="employees-container">
        <Link to="/addEmployee" className="product-tile-link">
          <Button className="add-employee-button">Add Employee</Button>
        </Link>
        <Container className="content">
          <h2>Employees List</h2>
          <Table striped bordered hover className="employee-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee: any, index: number) => (
                <tr key={employee._id}>
                  <td>{index + 1}</td> {/* Display count instead of employee_id */}
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>
                    <Button onClick={() => handleViewClick(employee)}>
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

export default Employees;
