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
exports.productRoute = void 0;
const express_1 = __importDefault(require("express"));
const ProductModel_1 = require("./../models/ProductModel");
const StockModel_1 = require("./../models/StockModel");
const router = express_1.default.Router();
exports.productRoute = router;
const azure = require('azure-storage');
const blobService = azure.createBlobService('posproject', 'KYTgOoFQL+ZtpAnfQFOi3waffpKAw5Zc4KeSrXH/hIqtdjzirdjo02iWZu2w1lvfQcFyUqTYB6ZE+ASt+RkWwg==');
console.log(blobService);
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
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
        console.log(newStock);
        yield newStock.save(); // Save the stock entry
        res.status(201).json(savedProduct._id);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.post('/upload', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const containerName = 'productStorage'; // Replace with your container name
        const blobName = req.file.originalname;
        const buffer = req.file.buffer;
        // Check if the container exists, and create it if not
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, (createError) => {
            if (!createError) {
                // Container either exists or was successfully created
                // Upload the blob to the container
                blobService.createBlockBlobFromText(containerName, blobName, buffer, buffer.length, (uploadError, _result, _response) => {
                    if (!uploadError) {
                        const imageUrl = blobService.getUrl(containerName, blobName);
                        res.status(201).json({ imageUrl });
                    }
                    else {
                        res.status(500).json({ error: uploadError });
                    }
                });
            }
            else {
                res.status(500).json({ error: createError });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
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
