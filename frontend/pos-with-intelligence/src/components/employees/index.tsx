import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import Navbar from '../navigation/nav';
import './employee.css';
import { Link, useNavigate } from 'react-router-dom';

const Employees: React.FC = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null); // State to hold the selected employee
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      // Make a GET request to the '/users' route
      const response = await axios.get('https://pos-crud.onrender.com//users');
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
    setSelectedEmployee(null); // Close the modal
  };

  return (
    <>
      <Navbar></Navbar>
      
      
      <div className="employees-container">
      <Link to="/addEmployee" className="product-tile-link">
            <button className="add-employee-button">Add Employee</button>
      </Link>
        <div className="content">
          <h2>Employees List</h2>
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee: any) => (
                <tr key={employee._id}>
                  <td>{employee._id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>
                    <button onClick={() => handleViewClick(employee)}>View</button>
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

export default Employees;
