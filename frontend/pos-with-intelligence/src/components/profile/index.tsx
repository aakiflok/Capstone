import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { User } from '../../models/user.module';
import Navbar from '../navigation/nav';
import Cookies from 'js-cookie';



const Profile= () => {
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  return (<>
    <Navbar></Navbar>
    <div style={{ padding: '20px' }}>
      <h2>Profile</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
        <tbody>
          <tr>
            <td style={{ width: '30%', textAlign: 'right', paddingRight: '10px' }}>First Name:</td>
            <td>{user?.first_name}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{user?.last_name}</td>
          </tr>
          {/* <tr>
            <td>Birthdate:</td>
            <td>{user.birthdate.toDateString()}</td>
          </tr> */}
          <tr>
            <td>Address:</td>
            <td>{user?.address}</td>
          </tr>
          <tr>
            <td>Username:</td>
            <td>{user?.username}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{user?.email}</td>
          </tr>
          <tr>
            <td>Role:</td>
            <td>{user?.role}</td>
          </tr>
          {/* <tr>
            <td>Joining Date:</td>
            <td>{user.joining_date.toDateString()}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Profile;
