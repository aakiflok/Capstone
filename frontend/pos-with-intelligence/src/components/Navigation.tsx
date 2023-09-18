import React, { useState } from 'react';

type TabName = 'home' | 'products' | 'invoice' | 'inventory' | 'customers' | 'profile';

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

const ulStyle: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  margin: 0,
  padding: 0,
  backgroundColor: '#333',
  borderRadius: '5px',
};

const liStyle: React.CSSProperties = {
  margin: 0,
  padding: '10px 20px',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease-in-out',
};

const liHoverStyle: React.CSSProperties = {
  backgroundColor: '#555',
};

const contentStyle: React.CSSProperties = {
  marginTop: '20px',
};

const Navigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('home');

  const renderTabContent = () => {
    // switch (activeTab) {
    //   case 'home':
    //     return <Home />;
    //   case 'products':
    //     return <Products />;
    //   case 'invoice':
    //     return <Invoice />;
    //   case 'inventory':
    //     return <Inventory />;
    //   case 'customers':
    //     return <Customers />;
    //   case 'profile':
    //     return <Profile user={user} />;
    //   default:
    //     return null;
    // }
    return null;
  };

  return (
    <div style={navStyle}>
      <nav style={ulStyle} className="nav">
        <ul style={ulStyle}>
          <li style={liStyle} onClick={() => setActiveTab('home')}>
            Home
          </li>
          <li style={liStyle} onClick={() => setActiveTab('products')}>
            Products
          </li>
          <li style={liStyle} onClick={() => setActiveTab('invoice')}>
            Invoice
          </li>
          <li style={liStyle} onClick={() => setActiveTab('inventory')}>
            Inventory
          </li>
          <li style={liStyle} onClick={() => setActiveTab('customers')}>
            Customers
          </li>
          <li style={liStyle} onClick={() => setActiveTab('profile')}>
            Profile
          </li>
        </ul>
      </nav>
      <div style={contentStyle}>
        {renderTabContent()}
        {/* <p>Welcome, {user.first_name} {user.last_name} (Role: {user.role})</p> */}
      </div>
    </div>
  );
};

export default Navigation;
