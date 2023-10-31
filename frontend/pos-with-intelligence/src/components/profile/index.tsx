import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { User } from '../../models/user.module';
import Navbar from '../navigation/nav';
import Cookies from 'js-cookie';
import './index.css';


const Profile = () => {
  const [user, setUser] = useState<any | null>(null);
  useEffect(() => {
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="profile-content">
        <div className="profile-details">
          <h2>Profile</h2>
          <table className="profile-table">
            <tbody>
              <tr>
                <td className="label-cell">First Name:</td>
                <td>{user?.first_name}</td>
              </tr>
              <tr>
                <td className="label-cell">Last Name:</td>
                <td>{user?.last_name}</td>
              </tr>
              <tr>
                <td className="label-cell">Address:</td>
                <td>{user?.address}</td>
              </tr>
              <tr>
                <td className="label-cell">Username:</td>
                <td>{user?.username}</td>
              </tr>
              <tr>
                <td className="label-cell">Email:</td>
                <td>{user?.email}</td>
              </tr>
              <tr>
                <td className="label-cell">Role:</td>
                <td>{user?.role}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;
