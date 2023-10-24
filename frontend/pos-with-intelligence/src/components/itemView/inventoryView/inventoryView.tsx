import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './inventoryView.css'; // Import your CSS file here

const InventoryView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { id } = useParams();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Send a GET request to your API using the 'id' from the URL
        const response = await axios.get(`https://pos-crud.onrender.com/stock/${id}`);

        if (isMounted) {
          setSelectedProduct(response.data);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        // Handle the error here
      }
    };

    fetchData();
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }

    return () => {
      isMounted = false;
    };
  }, [id]); // Include 'id' in the dependency array

  if (!selectedProduct) {
    // Handle the case when data is still loading
    return (
      <>
        <Navbar></Navbar>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <> 
      <Navbar></Navbar>
      <div className="inventory-content">
      
        <div className="inventory-details">
          <h2>Inventory Details</h2>
          <table className="inventory-table">
            <tbody>
              <tr>
                <td>Product Name</td>
                <td>{selectedProduct.product_name}</td>
              </tr>
              <tr>
                <td>Product ID</td>
                <td>{selectedProduct.product_id}</td>
              </tr>
              <tr>
                <td>Quantity</td>
                <td>{selectedProduct.quantity}</td>
              </tr>
              <tr>
                <td>Location of Storage</td>
                <td>{selectedProduct.location}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-container">
        <Link to={`/employees/edit/${id}`}>
          <button className="edit-button">
            Edit Inventory
          </button>
        </Link>
        {user && user.role === 'admin' && (
          <button onClick={handleDeleteEmployee} className="delete-button">
            Delete Record
          </button>
        )}
      </div>
    </>
  );
};

function handleDeleteEmployee() {
  // Implement the logic to delete the employee here
}

export default InventoryView;
