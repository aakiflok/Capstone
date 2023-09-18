import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [user, setUser] = useState<any | null>(null); // Use the appropriate type for your user object

  useEffect(() => {
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  // Define user roles (you may have a more structured way to handle roles)
  const isAdmin = user && user.role === 'admin';
  const isSalesStaff = user && user.role === 'sales_staff';

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <Link to="/home" className="navbar__link">Home</Link>
          <Link to="/products" className="navbar__link">Products</Link>
          <Link to="/invoice" className="navbar__link">Invoice</Link>
          <Link to="/inventory" className="navbar__link">Inventory</Link>
          <Link to="/customers" className="navbar__link">Customers</Link>
          {isAdmin && <Link to="/employees" className="navbar__link">Employees</Link>}
          {isAdmin && <Link to="/reports" className="navbar__link">Reports</Link>}
        </div>
        <div className="navbar__right">
          <Link to="/profile" className="navbar__link">Profile</Link>
          <Link to="/logout" className="navbar__link">Logout</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
