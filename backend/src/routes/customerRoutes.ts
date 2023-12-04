import express, { Request, Response } from 'express';
import { Customers } from './../models/CustomerModel';
import { Invoice } from '../models/InvoiceModel';

const router = express.Router();

// Create a new customer
router.post('/customers', async (req: Request, res: Response) => {
  try {
    // Create a new customer using the request body
    const customer = new Customers(req.body);
    // Save the new customer to the database
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (err: any) {
    // Handle errors and send an error response
    res.status(400).json({ message: err.message });
  }
});

// Get all customers
router.get('/customers', async (req: Request, res: Response) => {
  try {
    // Retrieve all customers from the database
    const customers = await Customers.find();
    res.status(200).json(customers);
  } catch (err: any) {
    // Handle errors and send an error response
    res.status(500).json({ message: err.message });
  }
});

// Get a specific customer
router.get('/customers/:id', getCustomer, (req: Request, res: Response) => {
  res.status(200).json(res.locals.customer);
});

// Update a customer
router.patch('/customers/:id', getCustomer, async (req: Request, res: Response) => {
  if (req.body.first_name != null) {
    res.locals.customer.first_name = req.body.first_name;
  }
  if (req.body.last_name != null) {
    res.locals.customer.last_name = req.body.last_name;
  }
  if (req.body.address != null) {
    res.locals.customer.address = req.body.address;
  }
  // Update other fields similarly

  try {
    // Save the updated customer to the database
    const updatedCustomer = await res.locals.customer.save();
    res.json(updatedCustomer);
  } catch (err: any) {
    // Handle errors and send an error response
    res.status(400).json({ message: err.message });
  }
});

// Delete a customer
router.delete('/customers/:id', getCustomer, async (req: Request, res: Response) => {
  try {
    // Check if the customer is associated with any invoices
    const invoices = await Invoice.find({ customer_id: req.params.id });

    if (invoices.length > 0) {
      return res.status(201).json({ message: 'Customer cannot be deleted as they are associated with one or more invoices' });
    }

    const customer = await Customers.findById(req.params.id);

    // If not associated with any invoices, proceed with deletion
    await customer?.deleteOne();
    res.json({ message: 'Customer deleted' });
  } catch (err: any) {
    // Handle errors and send an error response
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a customer by ID
async function getCustomer(req: Request, res: Response, next: Function) {
  try {
    // Find a customer by ID
    const customer = await Customers.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.locals.customer = customer;
    next();
  } catch (err: any) {
    // Handle errors and send an error response
    return res.status(500).json({ message: err.message });
  }
}

export { router as customerRoute };
