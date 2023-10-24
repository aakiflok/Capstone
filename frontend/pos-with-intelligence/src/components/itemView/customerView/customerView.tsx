import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerView: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://pos-crud.onrender.com/customers/${id}`);

        if (isMounted) {
          setSelectedCustomer(response.data);
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

  if (!selectedCustomer) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <h2>Customer Details</h2>
          <table className="customer-table">
            <tbody>
              <tr>
                <td>Customer ID</td>
                <td>{selectedCustomer._id}</td>
              </tr>
              <tr>
                <td>First Name</td>
                <td>{selectedCustomer.first_name}</td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>{selectedCustomer.last_name}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>{selectedCustomer.address}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{selectedCustomer.email}</td>
              </tr>
              {/* Add other fields as required */}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <Link to={`/customers/edit/${id}`}>
              <button style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                Edit Customer
              </button>
            </Link>
            <button onClick={handleDeleteCustomer} style={{ padding: '10px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
              Delete Customer
            </button>
          </div>
        </div>
      </div>
    </>
  );

  function handleDeleteCustomer() {
    // Implement the logic to delete the customer here
  }
};

export default CustomerView;