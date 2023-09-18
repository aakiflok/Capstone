import express, { Request, Response } from 'express';
import {Customers} from './../models/CustomerModel'; 
const router = express.Router();

// Create a new customer
router.post('/customers', async (req: Request, res: Response) => {
  try {
    const customer = new Customers(req.body);
    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Get all customers
router.get('/customers', async (req: Request, res: Response) => {

  try {
    const customers = await Customers.find();
    res.status(200).json(customers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific customer
router.get('/customers/:id',getCustomer, (req: Request, res: Response) => {
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
    const updatedCustomer = await res.locals.customer.save();
    res.json(updatedCustomer);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a customer
router.delete('/customers/:id', getCustomer, async (req: Request, res: Response) => {
  try {
    await res.locals.customer.remove();
    res.json({ message: 'Customer deleted' });
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
});

async function getCustomer(req: Request, res: Response, next: Function) {
    try {
      const customer = await Customers.$where(req.params.id);
      if (customer == null) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.locals.customer = customer;
      next();
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  }
  
  export {router as customerRoute};