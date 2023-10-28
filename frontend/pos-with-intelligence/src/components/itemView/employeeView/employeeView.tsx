import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeView: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${id}`);

        if (isMounted) {
          setSelectedEmployee(response.data);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
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
        <Navbar></Navbar>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <div style={{ padding: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h2>Employee Details</h2>
          <table className = "employee-table">
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
          </table>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Link to={`/editEmployee/${id}`}>
              <button style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                Edit Employee
              </button>
            </Link>
            <button onClick={handleDeleteEmployee} style={{ padding: '10px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
              Delete Employee
            </button>
          </div>
        </div>
      </div>
    </>
  );

  function handleDeleteEmployee() {
    // Implement the logic to delete the employee here
  }
};

export default EmployeeView;
