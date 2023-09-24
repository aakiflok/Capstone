import React from "react";
import logo from "./logo.svg";
import Home from "./components/home";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login/login";

import { RequireAuth } from "react-auth-kit";
import AdminDashboard from "./components/admin/dashboard/adminDashboard";
import StaffDashboard from "./components/staff/dashboard/staffDashboard";
import Products from "./components/products";
import Profile from "./components/profile";
import ProductView from "./components/itemView/productView/productView";
import Inventory from "./components/inventory";
import InventoryView from "./components/itemView/inventoryView/inventoryView";
import Customers from "./components/customers";
import AddEditProductForm from "./components/forms/addEditProductForm";


const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<RequireAuth loginPath="/login"><Home /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth loginPath="/login"><Products /></RequireAuth>}/>
        <Route path="/product/:id" element={<RequireAuth loginPath="/login"><ProductView /></RequireAuth>}/>       
        <Route path="/profile" element={<RequireAuth loginPath="/login"><Profile /></RequireAuth>}/>
        <Route path="/inventory" element={<RequireAuth loginPath="/login"><Inventory /></RequireAuth>}/>
        <Route path="/customers" element={<RequireAuth loginPath="/login"><Customers /></RequireAuth>}/>
        <Route path="/inventory/:id" element={<RequireAuth loginPath="/login"><InventoryView /></RequireAuth>}/>
        <Route path="/addProduct" element={<RequireAuth loginPath="/login"><AddEditProductForm /></RequireAuth>}/>
        <Route path="/editProduct/:id" element={<RequireAuth loginPath="/login"><AddEditProductForm /></RequireAuth>}/>

        
      </Routes>
    </AppContainer>
  );
}

export default App;
