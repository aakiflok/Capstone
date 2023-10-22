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
        const { id, name, price, category, description, image_uri } = req.body;
        // Create a new product instance
        const newProduct = new ProductModel_1.Product({
            id,
            name,
            price,
            category,
            description,
            image_uri,
        });
        // Save the new product to the database
        const savedProduct = yield newProduct.save();
        res.status(201).json(savedProduct);
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
        const product = yield ProductModel_1.Product.findOne({ id: productId });
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
        const product = yield ProductModel_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Update the product fields
        if (req.body.name !== undefined) {
            product.name = req.body.name;
        }
        if (req.body.price !== undefined) {
            product.price = req.body.price;
        }
        if (req.body.category !== undefined) {
            product.category = req.body.category;
        }
        // Update other fields similarly
        const updatedProduct = yield product.save();
        res.status(200).json(updatedProduct);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete a product
router.delete('/products/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Delete associated stock records if needed
        yield StockModel_1.Stock.deleteMany({ product_id: product.id });
        // await product.remove();
        res.json({ message: 'Product deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
