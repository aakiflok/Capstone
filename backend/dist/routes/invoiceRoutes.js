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
const router = express_1.default.Router();
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
// @route   POST /invoices
router.post('/invoices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Include request validation as per your requirements
    try {
        const newInvoice = new InvoiceModel_1.Invoice(req.body);
        yield newInvoice.save();
        res.status(201).json(newInvoice);
    }
    catch (err) {
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
    try {
        const updatedInvoice = yield InvoiceModel_1.Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedInvoice);
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
exports.default = router;
