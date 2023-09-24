import React, { useEffect, useState } from 'react';
import Navbar from '../../navigation/nav';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const InventoryView: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { id } = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Send a GET request to your API using the 'id' from the URL
        const response = await axios.get(`http://localhost:3001/stock/${id}`);

        if (isMounted) {
          setSelectedProduct(response.data);
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
      <div style={{ padding: '20px' }}>
        <h2>Inventory Details</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
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
    </>
  );
};

export default InventoryView;
