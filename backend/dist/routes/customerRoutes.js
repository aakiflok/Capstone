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
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const CustomerModel_1 = require("./../models/CustomerModel");
const router = express_1.default.Router();
exports.customerRoute = router;
// Create a new customer
router.post('/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = new CustomerModel_1.Customers(req.body);
        const savedCustomer = yield customer.save();
        res.status(201).json(savedCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Get all customers
router.get('/customers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield CustomerModel_1.Customers.find();
        res.status(200).json(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get a specific customer
router.get('/customers/:id', getCustomer, (req, res) => {
    res.status(200).json(res.locals.customer);
});
// Update a customer
router.patch('/customers/:id', getCustomer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedCustomer = yield res.locals.customer.save();
        res.json(updatedCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete a customer
router.delete('/customers/:id', getCustomer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield res.locals.customer.remove();
        res.json({ message: 'Customer deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
function getCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customer = yield CustomerModel_1.Customers.$where(req.params.id);
            if (customer == null) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            res.locals.customer = customer;
            next();
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    });
}
