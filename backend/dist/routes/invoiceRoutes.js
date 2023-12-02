"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const InvoiceModel_1 = require("../models/InvoiceModel");
const CustomerModel_1 = require("../models/CustomerModel");
const InvoiceItemModel_1 = require("../models/InvoiceItemModel");
const UserModel_1 = require("../models/UserModel");
const UnitSerialModel_1 = require("../models/UnitSerialModel");
const StockModel_1 = require("../models/StockModel");
const stripe_1 = __importDefault(require("stripe"));
const PaymentDetailModel_1 = __importDefault(require("../models/PaymentDetailModel"));
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPESCECRET);
router.post('/process-payment', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentMethodId, invoiceId } = req.body;
        const invoice = yield InvoiceModel_1.Invoice.findById(invoiceId);
        const amount = (invoice === null || invoice === void 0 ? void 0 : invoice.total) || 0;
        const paymentIntent = yield stripe.paymentIntents.create({
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
        const paymentDetail = new PaymentDetailModel_1.default({
            invoiceId,
            amount,
            paymentMethodId,
            status: paymentIntent.status,
        });
        yield paymentDetail.save();
        yield InvoiceModel_1.Invoice.findByIdAndUpdate(invoiceId, { payment_status: true, payment_id: paymentDetail._id });
        res.status(200).json({ success: true, paymentIntent });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}));
// @route   GET /invoices
router.get('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield InvoiceModel_1.Invoice.find();
        const enrichedInvoices = yield Promise.all(invoices.map((invoice) => __awaiter(void 0, void 0, void 0, function* () {
            const customer = yield CustomerModel_1.Customers.findById(invoice.customer_id);
            const employee = yield UserModel_1.User.findById(invoice.user_id);
            return Object.assign(Object.assign({}, invoice.toObject()), { customerName: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '', employeeName: employee ? `${employee.first_name || ''}`.trim() : '' });
        })));
        res.status(200).json(enrichedInvoices);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
// @route   GET /invoices
router.get('/associatedInvoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.query;
        let query = {};
        if (employeeId) {
            query.user_id = employeeId;
        }
        const invoices = yield InvoiceModel_1.Invoice.find(query);
        const enrichedInvoices = yield Promise.all(invoices.map((invoice) => __awaiter(void 0, void 0, void 0, function* () {
            const customer = yield CustomerModel_1.Customers.findById(invoice.customer_id);
            const employee = yield UserModel_1.User.findById(invoice.user_id);
            return Object.assign(Object.assign({}, invoice.toObject()), { customerName: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : '', employeeName: employee ? `${employee.first_name || ''}`.trim() : '' });
        })));
        res.status(200).json(enrichedInvoices);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
// @route   POST /invoices
router.post('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, user_id, total, delivery_status, date, payment_status, payment_id, items } = req.body;
        // Check stock availability for each item
        for (const item of items) {
            const stockItem = yield StockModel_1.Stock.findOne({ product_id: item.product_id });
            if (!stockItem || stockItem.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ID ${item.product_id}`
                });
            }
        }
        // Create and save the invoice
        const newInvoice = new InvoiceModel_1.Invoice({
            customer_id,
            user_id,
            total,
            delivery_status,
            date,
            payment_status,
            payment_id
        });
        const savedInvoice = yield newInvoice.save();
        //items
        //prduct-> stock -> quanitiy
        //stock_id and product_id -> unitserail
        //unitserail avability and invoice_id
        //invoiceitem create
        // Deduct stock and update Unit_Serial
        const itemsPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { product_id, quantity, final_price } = item;
            // Deduct the quantity from stock
            const stockItem = yield StockModel_1.Stock.findOneAndUpdate({ product_id: product_id }, { $inc: { quantity: -quantity } }, { new: true });
            // Find a Unit_Serial for the product and mark as not available
            for (let i = 0; i < quantity; i++) {
                const unitSerial = yield UnitSerialModel_1.Unit_Serial.findOneAndUpdate({ stock_id: stockItem === null || stockItem === void 0 ? void 0 : stockItem._id, isAvailable: true }, { $set: { isAvailable: false, invoice_id: savedInvoice._id } }, { new: true });
                if (!unitSerial) {
                    throw new Error(`No available unit serials for product ID ${product_id}`);
                }
            }
            // Create and save the invoice item
            const newItem = new InvoiceItemModel_1.Invoice_Item({
                invoice_id: savedInvoice._id,
                product_id,
                quantity,
                final_price
            });
            return newItem.save();
        }));
        // Wait for all invoice items to be saved and stock to be updated
        yield Promise.all(itemsPromises);
        // Optionally, fetch the updated invoice to return it in the response
        const updatedInvoice = yield InvoiceModel_1.Invoice.findById(savedInvoice._id).populate('customer_id').populate('user_id');
        res.status(201).json(updatedInvoice);
    }
    catch (err) {
        console.error('Error occurred:', err);
        res.status(500).send('Server Error');
    }
}));
router.get('/invoices/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the invoice by ID and populate the related user and customer
        const invoice = yield InvoiceModel_1.Invoice.findById(req.params.id)
            .populate('user_id', '-password')
            .populate('customer_id');
        if (!invoice) {
            return res.status(404).json({ msg: 'Invoice not found' });
        }
        // Assuming Invoice_Item is related to Invoice via an 'invoice_id' field
        const invoiceItems = yield InvoiceItemModel_1.Invoice_Item.find({ invoice_id: req.params.id })
            .populate('product_id');
        // Combining invoice data with its items
        const result = Object.assign(Object.assign({}, invoice.toObject()), { items: invoiceItems });
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}));
// @route   PUT /invoices/:id
router.put('/invoices/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { customer_id, user_id, total, delivery_status, date, payment_status, payment_id, items } = req.body;
        for (const item of items) {
            //used
            const existingInvoiceItem = yield InvoiceItemModel_1.Invoice_Item.findOne({ invoice_id: id, product_id: item.product_id });
            const stockItem = yield StockModel_1.Stock.findOne({ product_id: item.product_id });
            var tempQuantity = (_a = stockItem === null || stockItem === void 0 ? void 0 : stockItem.quantity) !== null && _a !== void 0 ? _a : 0;
            if (existingInvoiceItem) {
                tempQuantity = tempQuantity + existingInvoiceItem.quantity;
            }
            if ((tempQuantity) < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ID ${item.product_id}`
                });
            }
        }
        // Check if the invoice exists
        const existingInvoice = yield InvoiceModel_1.Invoice.findById(id);
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
        yield existingInvoice.save();
        //get unit_serail array associated with this invoice
        //product -< stock reset
        //unit serail -> reset
        //delete EII
        const existingInvoiceItems = yield InvoiceItemModel_1.Invoice_Item.find({ invoice_id: id });
        for (const EII of existingInvoiceItems) {
            const stockItem = yield StockModel_1.Stock.findOneAndUpdate({ product_id: EII.product_id }, { $inc: { quantity: EII.quantity } }, { new: true });
            for (let i = 0; i < EII.quantity; i++) {
                const unitSerial = yield UnitSerialModel_1.Unit_Serial.findOneAndUpdate({ stock_id: stockItem === null || stockItem === void 0 ? void 0 : stockItem._id, isAvailable: false, invoice_id: id }, { $set: { isAvailable: true, invoice_id: null } }, { new: true });
            }
            EII.deleteOne({ invoice_id: EII.id, product_id: EII.product_id });
        }
        //items
        //prduct-> stock -> quanitiy
        //stock_id and product_id -> unitserail
        //unitserail avability and invoice_id
        //invoiceitem create
        for (const item of items) {
            const stockItem = yield StockModel_1.Stock.findOne({ product_id: item.product_id });
            if (!stockItem || stockItem.quantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for product ID ${item.product_id}`
                });
            }
        }
        const itemsPromises = items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const { product_id, quantity, final_price } = item;
            // Deduct the quantity from stock
            const stockItem = yield StockModel_1.Stock.findOneAndUpdate({ product_id: product_id }, { $inc: { quantity: -quantity } }, { new: true });
            // Find a Unit_Serial for the product and mark as not available
            for (let i = 0; i < quantity; i++) {
                const unitSerial = yield UnitSerialModel_1.Unit_Serial.findOneAndUpdate({ stock_id: stockItem === null || stockItem === void 0 ? void 0 : stockItem._id, isAvailable: true }, { $set: { isAvailable: false, invoice_id: id } }, { new: true });
                if (!unitSerial) {
                    throw new Error(`No available unit serials for product ID ${product_id}`);
                }
            }
            // Create and save the invoice item
            const newItem = new InvoiceItemModel_1.Invoice_Item({
                invoice_id: id,
                product_id,
                quantity,
                final_price
            });
            newItem.save();
        }));
        yield Promise.all(itemsPromises);
        const updatedInvoice = yield InvoiceItemModel_1.Invoice_Item.find({ invoice_id: id });
        res.status(201).json(updatedInvoice);
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
// @route   DELETE /invoices/:id
router.delete('/invoices/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield InvoiceModel_1.Invoice.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Invoice deleted' });
    }
    catch (err) {
        res.status(500).send('Server Error');
    }
}));
// Express route to get monthly sales data for the line graph
router.get('/monthly-sales', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const match = {};
        if (startDate && endDate) {
            // If both startDate and endDate are provided, add date filtering
            match.date = {
                $gte: new Date(startDate.toString()),
                $lte: new Date(endDate.toString()),
            };
        }
        const monthlySales = yield InvoiceModel_1.Invoice.aggregate([
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
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.get('/monthly-sales-by-category', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monthlySalesByCategory = yield InvoiceItemModel_1.Invoice_Item.aggregate([
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
    }
    catch (err) {
        console.error('Error fetching monthly sales by category:', err);
        res.status(500).json({ message: err.message });
    }
}));
exports.default = router;
