import { Router, Request, Response } from 'express';
import {Invoice} from '../models/InvoiceModel'

const router: Router = Router();

// Middleware to check if the user is authenticated and has the right role
const isAuthenticated = (req: Request, res: Response, next: Function)  => {
  // Your authentication logic here...
};

// @route   GET /invoices
router.get('/invoices', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().populate('customer_id').populate('user_id');
    res.json(invoices);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /invoices
router.post('/invoices', isAuthenticated, async (req: Request, res: Response) => {
  // Include request validation as per your requirements
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET /invoices/:id
router.get('/invoices/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('customer_id').populate('user_id');
    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   PUT /invoices/:id
router.put('/invoices/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /invoices/:id
router.delete('/invoices/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Invoice deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
