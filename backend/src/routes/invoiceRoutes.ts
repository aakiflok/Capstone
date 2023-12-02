import express, { Router, Request, Response } from 'express';
import { Invoice } from '../models/InvoiceModel'
import { Customers } from '../models/CustomerModel';
import { Invoice_Item } from '../models/InvoiceItemModel'
import { User } from '../models/UserModel'
import mongoose from 'mongoose';
import { Unit_Serial } from '../models/UnitSerialModel';
import { Stock } from '../models/StockModel';
import { isJsxFragment, isStringLiteralOrJsxExpression } from 'typescript';
import Stripe from 'stripe';
import PaymentDetail from '../models/PaymentDetailModel';
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

const stripe = new Stripe(process.env.STRIPESCECRET!);



router.post('/process-payment', async (req, res) => {
  try {
    const { paymentMethodId, invoiceId } = req.body;
    const invoice = await Invoice.findById(invoiceId);
    const amount = invoice?.total || 0;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    
    // Save payment details to MongoDB
    const paymentDetail = new PaymentDetail({
      invoiceId,
      amount,
      paymentMethodId,
      status: paymentIntent.status,
    });

    await paymentDetail.save();
    await Invoice.findByIdAndUpdate(invoiceId, { payment_status: true, payment_id: paymentDetail._id });
    res.status(200).json({ success: true, paymentIntent });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

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


    //items
    //prduct-> stock -> quanitiy
    //stock_id and product_id -> unitserail
    //unitserail avability and invoice_id
    //invoiceitem create
    // Deduct stock and update Unit_Serial
    const itemsPromises = items.map(async (item: { product_id: any; quantity: any; final_price: any; }) => {
      const { product_id, quantity, final_price } = item;

      // Deduct the quantity from stock
      const stockItem = await Stock.findOneAndUpdate(
        { product_id: product_id },
        { $inc: { quantity: -quantity } },
        { new: true }
      );

      // Find a Unit_Serial for the product and mark as not available
      for (let i = 0; i < quantity; i++) {
        const unitSerial = await Unit_Serial.findOneAndUpdate(
          { stock_id: stockItem?._id, isAvailable: true },
          { $set: { isAvailable: false, invoice_id: savedInvoice._id } },
          { new: true }
        );

        if (!unitSerial) {
          throw new Error(`No available unit serials for product ID ${product_id}`);
        }
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
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /invoices/:id
router.put('/invoices/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { customer_id, user_id, total, delivery_status, date, payment_status, payment_id, items } = req.body;
    for (const item of items) {
      //used
      const existingInvoiceItem = await Invoice_Item.findOne({ invoice_id: id, product_id: item.product_id });
      const stockItem = await Stock.findOne({ product_id: item.product_id });

      var tempQuantity=stockItem?.quantity ?? 0;
      if(existingInvoiceItem){
          tempQuantity= tempQuantity + existingInvoiceItem.quantity;
      }    

      
      if ((tempQuantity) < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ID ${item.product_id}`
        });
      }
      
    
  }
// Check if the invoice exists
const existingInvoice = await Invoice.findById(id);
  if (!existingInvoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  existingInvoice.user_id = user_id;
  existingInvoice.customer_id = customer_id;
  existingInvoice.total = total;
  existingInvoice.delivery_status = delivery_status;
  existingInvoice.date = date;
  existingInvoice.payment_status = payment_status;
  if (payment_id) {
    existingInvoice.payment_id = payment_id;
  }

  await existingInvoice.save();

  //get unit_serail array associated with this invoice
  //product -< stock reset
  //unit serail -> reset
  //delete EII
  const existingInvoiceItems = await Invoice_Item.find({ invoice_id: id });
  for (const EII of existingInvoiceItems) {

    const stockItem = await Stock.findOneAndUpdate(
      { product_id: EII.product_id },
      { $inc: { quantity: EII.quantity } },
      { new: true }
    );
    for (let i = 0; i < EII.quantity; i++) {
      const unitSerial = await Unit_Serial.findOneAndUpdate(
        { stock_id: stockItem?._id, isAvailable: false, invoice_id: id },
        { $set: { isAvailable: true, invoice_id: null } },
        { new: true }
      );
    }
    EII.deleteOne({ invoice_id: EII.id, product_id: EII.product_id });
  }

  //items
  //prduct-> stock -> quanitiy
  //stock_id and product_id -> unitserail
  //unitserail avability and invoice_id
  //invoiceitem create

  for (const item of items) {
    const stockItem = await Stock.findOne({ product_id: item.product_id });
    if (!stockItem || stockItem.quantity < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for product ID ${item.product_id}`
      });
    }
  }

  const itemsPromises = items.map(async (item: { product_id: any; quantity: any; final_price: any; }) => {
    const { product_id, quantity, final_price } = item;

    // Deduct the quantity from stock
    const stockItem = await Stock.findOneAndUpdate(
      { product_id: product_id },
      { $inc: { quantity: -quantity } },
      { new: true }
    );

    // Find a Unit_Serial for the product and mark as not available
    for (let i = 0; i < quantity; i++) {
      const unitSerial = await Unit_Serial.findOneAndUpdate(
        { stock_id: stockItem?._id, isAvailable: true },
        { $set: { isAvailable: false, invoice_id: id } },
        { new: true }
      );

      if (!unitSerial) {
        throw new Error(`No available unit serials for product ID ${product_id}`);
      }
    }

    // Create and save the invoice item
    const newItem = new Invoice_Item({
      invoice_id: id,
      product_id,
      quantity,
      final_price
    });

    newItem.save();
  });

  await Promise.all(itemsPromises);


  const updatedInvoice = await Invoice_Item.find({ invoice_id: id });

  res.status(201).json(updatedInvoice);

}
  catch (err) {
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
    const { startDate, endDate } = req.query;

    const match: any = {
     
    };

    if (startDate && endDate) {
      // If both startDate and endDate are provided, add date filtering
      match.date = {
        $gte: new Date(startDate.toString()),
        $lte: new Date(endDate.toString()),
      };
    }

    const monthlySales = await Invoice.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          date: 1, // Include the date field
          total: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$total" },
          dates: { $push: "$date" } // Collect all the dates for each group
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
          totalSales: 1,
          dates: 1 // Include the dates array in the projection
        }
      }
    ]);

    res.status(200).json(monthlySales);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/monthly-sales-by-category', async (req: Request, res: Response) => {
  try {
    const monthlySalesByCategory = await Invoice_Item.aggregate([
      {
        $lookup: {
          from: 'products', // Assuming your Product model is named 'products'
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product' // Unwind the 'product' array
      },
      {
        $group: {
          _id: '$product.category', // Group by category from Product
          totalSales: { $sum: '$final_price' } // Calculate total sales
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id', // Include category in the result
          totalSales: 1
        }
      }
    ]);

    // Log the result for debugging
    console.log('Monthly Sales:', monthlySalesByCategory);

    res.status(200).json(monthlySalesByCategory);
  } catch (err: any) {
    console.error('Error fetching monthly sales by category:', err);
    res.status(500).json({ message: err.message });
  }
});


export default router;

