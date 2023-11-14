"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoute = void 0;
const ProductModel_1 = require("./../models/ProductModel");
const StockModel_1 = require("./../models/StockModel");
const cloudinary = __importStar(require("cloudinary"));
const express_1 = require("express");
cloudinary.v2.config({
    cloud_name: 'dxrohnluu',
    api_key: '278171197627713',
    api_secret: 'I92bDNPLwfsA5Ba2KFcw9LLRvgg',
    secure: true
});
const router = (0, express_1.Router)();
exports.productRoute = router;
router.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get product data from the request body
        const { name, price, category, description, image_uri, discontinued } = req.body;
        // Create a new product instance
        const newProduct = new ProductModel_1.Product({
            name,
            price,
            category,
            description,
            image_uri,
            discontinued
        });
        // Save the new product to the database
        const savedProduct = yield newProduct.save();
        const newStock = new StockModel_1.Stock({
            product_id: savedProduct._id,
            quantity: 0,
            location: 'not stock' // You can adjust this as per your requirements
        });
        yield newStock.save(); // Save the stock entry
        res.status(201).json(savedProduct._id);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get all products
router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield ProductModel_1.Product.find();
        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get a specific product by ID
router.get('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.id;
        const product = yield ProductModel_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.get('/get-signature', (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    // Check if api_secret is defined and assert its type
    const apiSecret = cloudinary.v2.config().api_secret;
    // Ensure that api_secret is defined
    if (!apiSecret) {
        return res.status(500).json({ message: "Cloudinary API secret is undefined." });
    }
    const signature = cloudinary.v2.utils.api_sign_request({
        timestamp: timestamp,
    }, apiSecret);
    res.json({ signature, timestamp });
});
// Update a product
router.patch('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category, description, image_uri } = req.body;
        const product = yield ProductModel_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Update product properties
        if (name)
            product.name = name;
        if (price)
            product.price = price;
        if (category)
            product.category = category;
        if (description)
            product.description = description;
        if (image_uri)
            product.image_uri = image_uri;
        yield product.save(); // save the changes to the database
        res.status(200).json(product);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete a product
router.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the stock record corresponding to the product
        const stock = yield StockModel_1.Stock.findOne({ product_id: req.params.id });
        if (!stock) {
            return res.status(404).json({ message: 'Stock record not found for the given product' });
        }
        // Check stock quantity
        if (stock.quantity > 0) {
            return res.status(400).json({ message: 'Cannot delete product with stock quantity greater than zero' });
        }
        // If stock quantity is zero, delete the product
        const product = yield ProductModel_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        yield product.deleteOne();
        // Delete the corresponding stock record
        yield stock.deleteOne();
        res.json({ message: 'Product and corresponding stock record deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
