import express, { Router, Request, Response } from 'express';
import { Invoice } from '../models/InvoiceModel'
import { Customers } from '../models/CustomerModel';
import { Invoice_Item} from '../models/InvoiceItemModel'
import { User } from '../models/UserModel'
import mongoose from 'mongoose';
import Joi from 'joi';
import { Unit_Serial } from '../models/UnitSerialModel';
import { Stock } from '../models/StockModel';

const router = express.Router();


interface InvoiceUpdateRequest {
  customer_id?: mongoose.Types.ObjectId;
  user_id?: mongoose.Types.ObjectId;
  total?: number;
  delivery_status?: boolean;
  date?: Date;
  payment_status?: boolean;
  payment_id?: number;
  items?: {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    final_price: number;
  }[];
}


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

// @route   GET /invoices
router.get('/associatedInvoices', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.query;

    let query: any = {};
    if (employeeId) {
      query.user_id = employeeId;
    }

    const invoices = await Invoice.find(query);
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
  try {
    console.log('Request body:', req.body);
    const { customer_id, user_id, total, delivery_status, date, payment_status, payment_id, items } = req.body;

    // Check stock availability for each item
    for (const item of items) {
      const stockItem = await Stock.findOne({ product_id: item.product_id });
      if (!stockItem || stockItem.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ID ${item.product_id}`
        });
      }
    }

    // Create and save the invoice
    const newInvoice = new Invoice({
      customer_id,
      user_id,
      total,
      delivery_status,
      date,
      payment_status,
      payment_id
    });

    const savedInvoice = await newInvoice.save();

    // Deduct stock and update Unit_Serial
    const itemsPromises = items.map(async (item: { product_id: any; quantity: any; final_price: any; }) => {
      const { product_id, quantity, final_price } = item;

      // Deduct the quantity from stock
      const stockItem = await Stock.findOneAndUpdate(
        { product_id: product_id },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      console.log('Stock item:', stockItem);

      // Find a Unit_Serial for the product and mark as not available
      const unitSerial = await Unit_Serial.findOneAndUpdate(
        { stock_id: stockItem?._id, isAvailable: true },
        { isAvailable: false },
        { new: true }
      );

      if (!unitSerial) {
        throw new Error(`No available unit serials for product ID ${product_id}`);
      }

      // Create and save the invoice item
      const newItem = new Invoice_Item({
        invoice_id: savedInvoice._id,
        product_id,
        quantity,
        final_price
      });
      
      return newItem.save();
    });

    // Wait for all invoice items to be saved and stock to be updated
    await Promise.all(itemsPromises);

    // Optionally, fetch the updated invoice to return it in the response
    const updatedInvoice = await Invoice.findById(savedInvoice._id).populate('customer_id').populate('user_id');

    res.status(201).json(updatedInvoice);
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).send('Server Error');
  }
});

router.get('/invoices/:id', async (req, res) => {
  try {
    // Find the invoice by ID and populate the related user and customer
    const invoice = await Invoice.findById(req.params.id)
      .populate('user_id', '-password')
      .populate('customer_id');

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Assuming Invoice_Item is related to Invoice via an 'invoice_id' field
    const invoiceItems = await Invoice_Item.find({ invoice_id: req.params.id })
                                            .populate('product_id');

    // Combining invoice data with its items
    const result = {
      ...invoice.toObject(),
      items: invoiceItems
    };

    res.status(200).json(result);
  } catch (err:any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /invoices/:id
router.put('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const updateData: InvoiceUpdateRequest = req.body;

    // Validate updateData here if necessary

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).send('Invoice not found');
    }

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

// Express route to get monthly sales data for the line graph
router.get('/monthly-sales', async (req: Request, res: Response) => {
  try {
    const monthlySales = await Invoice.aggregate([
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          total: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalSales: 1
        }
      }
    ]);

    res.status(200).json(monthlySales);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


export default router;

