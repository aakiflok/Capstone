import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './nav.css';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [user, setUser] = useState<any | null>(null); // Use the appropriate type for your user object
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  const handleLogout = async() => {
    // 1. Clear the authentication cookie
    document.cookie = "_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };
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
          <a className="navbar__link" onClick={handleLogout}>Logout</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
