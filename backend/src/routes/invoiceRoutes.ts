import express, { Router, Request, Response } from 'express';
import { Invoice } from '../models/InvoiceModel'
import { Customers } from '../models/CustomerModel';
import { User } from '../models/UserModel'

const router = express.Router();

// @route   GET /invoices
router.get('/invoices', async (req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find();
    const enrichedInvoices = await Promise.all(invoices.map(async (invoice) => {
      const customer = await Customers.findById(invoice.customer_id);
      const employee = await User.findById(invoice.user_id);
      return {
        ...invoice.toObject(),
        customerName: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '',
        employeeName: employee ? `${employee.first_name || ''}`.trim() : '',
      };
    }));
    res.status(200).json(enrichedInvoices);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /invoices
router.post('/invoices', async (req: Request, res: Response) => {
  // Include request validation as per your requirements
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/invoices/:id', async (req, res) => {
  try {
    // Find the invoice by ID and populate the related user and customer
    const invoice = await Invoice.findById(req.params.id)
      .populate('user_id', '-password') // assuming 'user_id' is the field name in the Invoice schema
      .populate('customer_id'); // assuming 'customer_id' is the field name in the Invoice schema

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // The result should be an invoice object with user, customer, and invoice items populated
    res.status(201).json(invoice);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// @route   PUT /invoices/:id
router.put('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /invoices/:id
router.delete('/invoices/:id', async (req: Request, res: Response) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Invoice deleted' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;

