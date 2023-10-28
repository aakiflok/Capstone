import React, { useState, useEffect } from 'react';
import Navbar from '../../navigation/nav';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './addEditEmployeeForm.css'; // Ensure this path is correct

const AddEditEmployeeForm = () => {
  const { id } = useParams(); // Get the employee ID from the route params
  const isEditing = !!id; // Determine if it's an edit operation

  // State structure adjusted for employee data
  const [employee, setEmployee] = useState({
    first_name: '',
    last_name: '',
    birthdate: '',
    address: '',
    username: '',
    password: '',
    email: '',
    role: '',
    joining_date: '',
  });

  useEffect(() => {
    if (isEditing) {
      axios.get(`http://localhost:3001/users/${id}`)
        .then((response) => {
          setEmployee(response.data);
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
        });
    }
  }, [id, isEditing]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("prininting lode:"+isEditing);
    if (isEditing) {
      axios.put(`http://localhost:3001/updateUser/${id}`, employee)
        .then((response) => {
          console.log('Employee updated:', response.data);
        })
        .catch((error) => {
          console.error('Error updating employee:', error);
        });
    } else {
      console.log(employee);
      axios.post('http://localhost:3001/addUser', employee)
        .then((response) => {
          console.log('Employee added:', response.data);
        })
        .catch((error) => {
          console.error('Error adding employee:', error);
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="employee-form-container">
        <h2>{isEditing ? 'Edit Employee' : 'Add an Employee'}</h2>
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={employee.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={employee.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Birthdate</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={employee.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={employee.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={employee.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={employee.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={employee.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              {/* Add any other roles you have here */}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="joining_date">Joining Date</label>
            <input
              type="date"
              id="joining_date"
              name="joining_date"
              value={employee.joining_date}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddEditEmployeeForm;
