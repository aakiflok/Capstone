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
exports.stockRoute = void 0;
const express_1 = __importDefault(require("express"));
const StockModel_1 = require("./../models/StockModel");
const router = express_1.default.Router();
exports.stockRoute = router;
// Get all stock records
router.get('/stock', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield StockModel_1.Stock.find();
        res.status(200).json(stock);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get a specific stock record by stock_id
router.get('/stock/:stock_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield StockModel_1.Stock.findOne({ stock_id: req.params.stock_id });
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }
        res.status(200).json(stock);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Update a stock record
router.patch('/stock/:stock_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield StockModel_1.Stock.findOne({ stock_id: req.params.stock_id });
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }
        // Update the stock fields
        if (req.body.quantity !== undefined) {
            stock.quantity = req.body.quantity;
        }
        if (req.body.location !== undefined) {
            stock.location = req.body.location;
        }
        // Update other fields similarly
        const updatedStock = yield stock.save();
        res.status(200).json(updatedStock);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
//get quantity
router.get('/stock/quantity/:product_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product_id = req.params.product_id;
        // Find the stock record with the given product_id
        const stock = yield StockModel_1.Stock.findOne({ product_id });
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }
        // Return only the quantity
        res.status(200).json({ quantity: stock.quantity });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Delete a stock record
router.delete('/stock/:stock_id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stock = yield StockModel_1.Stock.findOne({ stock_id: req.params.stock_id });
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found' });
        }
        yield stock.deleteOne();
        res.json({ message: 'Stock record deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
