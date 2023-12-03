import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSignOut } from 'react-auth-kit';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap'; 

const Navbar = () => {
  const [user, setUser] = useState<any | null>(null); // Use the appropriate type for your user object
  const navigate = useNavigate();
  const signOut = useSignOut();
  useEffect(() => {
    const token = Cookies.get('_auth');
    const authState = Cookies.get('_auth_state');

    if (token && authState) {
      const userData = JSON.parse(authState);
      setUser(userData.user);
    }
  }, []);

  const HandleLogout = async () => {
    // 1. Clear the authentication cookie
    signOut();
    navigate("/login");
  };
  // Define user roles (you may have a more structured way to handle roles)
  const isAdmin = user && user.role === 'admin';
  const isSalesStaff = user && user.role === 'sales_staff';

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
    <BootstrapNavbar.Brand as={Link} to="/home">Pos with Intelligence</BootstrapNavbar.Brand>
    <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
    <BootstrapNavbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto ml-auto">
        <Nav.Link as={Link} to="/home">Home</Nav.Link>
        <Nav.Link as={Link} to="/products">Products</Nav.Link>
          <Nav.Link as={Link} to="/invoice">Invoice</Nav.Link>
          <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
          <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
          {isAdmin && <Nav.Link as={Link} to="/employees">Employees</Nav.Link>}
          {isAdmin && <Nav.Link as={Link} to="/reports">Reports</Nav.Link>}
          </Nav>
        <Nav>
          <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
          <Nav.Link onClick={HandleLogout}>Logout</Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
  }
export default Navbar;
