import React from "react";
import logo from "./logo.svg";
import Home from "./components/home";
import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/login/login";

import { RequireAuth } from "react-auth-kit";
import Products from "./components/products";
import Profile from "./components/profile";
import ProductView from "./components/itemView/productView/productView";
import Inventory from "./components/inventory";
import InventoryView from "./components/itemView/inventoryView/inventoryView";
import Customers from "./components/customers";
import AddEditProductForm from "./components/forms/productForms/addEditProductForm";
import Employees from "./components/employees";
import EmployeeView from "./components/itemView/employeeView/employeeView";
import CustomerView from "./components/itemView/customerView/customerView";
import AddEditEmployeeForm from "./components/forms/employeeForms/addEditEmployeeForm";
import AddEditInventoryForm from "./components/forms/inverntoryForms/addEditInventoryForm";
import AddEditCustomerForm from "./components/forms/customerForms/addEditCustomerForm";
import Invoice from "./components/invoice/invoice";
import InvoiceView from "./components/itemView/invoiceView/invoiceView";
import AddEditInvoiceForm from "./components/forms/invoiceForms/addEditInvoiceForm";
import Reports from "./components/reports/reports";
import PaymentForm from "./components/forms/invoiceForms/payment/payment";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;
const stripePromise = loadStripe('pk_test_51OHsRPHscfBqjZKX502JES3H3dITj30FsZsBqzIa3cRLubGnlvPN4TfMpKqWOaHkS08LrSpry8sJ2o307uz5b2Kq00RVRZR7yc');

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
        <Route path="/reports" element={<RequireAuth loginPath="/login"><Reports /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth loginPath="/login"><Products /></RequireAuth>} />
        <Route path="/product/:id" element={<RequireAuth loginPath="/login"><ProductView /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth loginPath="/login"><Profile /></RequireAuth>} />
        <Route path="/inventory" element={<RequireAuth loginPath="/login"><Inventory /></RequireAuth>} />
        <Route path="/employees" element={<RequireAuth loginPath="/login"><Employees /></RequireAuth>} />
        <Route path="/customers" element={<RequireAuth loginPath="/login"><Customers /></RequireAuth>} />
        <Route path="/customers/:id" element={<RequireAuth loginPath="/login"><CustomerView /></RequireAuth>} />
        <Route path="/invoice" element={<RequireAuth loginPath="/login"><Invoice /></RequireAuth>} />
        <Route path="/invoice/:id" element={<RequireAuth loginPath="/login"><InvoiceView /></RequireAuth>} />
        <Route path="/editInvoice/:id" element={<RequireAuth loginPath="/login"><AddEditInvoiceForm /></RequireAuth>} />
        <Route path="/addInvoice" element={<RequireAuth loginPath="/login"><AddEditInvoiceForm /></RequireAuth>} />
        <Route path="/customers/edit/:id" element={<RequireAuth loginPath="/login"><AddEditCustomerForm /></RequireAuth>} />
        <Route path="/addCustomer" element={<RequireAuth loginPath="/login"><AddEditCustomerForm /></RequireAuth>} />
        <Route path="/employees/:id" element={<RequireAuth loginPath="/login"><EmployeeView /></RequireAuth>} />
        <Route path="/inventory/:id" element={<RequireAuth loginPath="/login"><InventoryView /></RequireAuth>} />
        <Route path="/editInventory/:id" element={<RequireAuth loginPath="/login"><AddEditInventoryForm /></RequireAuth>} />
        <Route path="/addProduct" element={<RequireAuth loginPath="/login"><AddEditProductForm /></RequireAuth>} />
        <Route path="/editProduct/:id" element={<RequireAuth loginPath="/login"><AddEditProductForm /></RequireAuth>} />
        <Route path="/editEmployee/:id" element={<RequireAuth loginPath="/login"><AddEditEmployeeForm /></RequireAuth>} />
        <Route path="/addEmployee" element={<RequireAuth loginPath="/login"><AddEditEmployeeForm /></RequireAuth>} />
        <Route path="/payment/:id" element={
          <RequireAuth loginPath="/login">
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </RequireAuth>
        } />
      </Routes>
    </AppContainer>
  );
}

export default App;
