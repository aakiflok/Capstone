import express, { Request, Response } from 'express';
import { Product } from './../models/ProductModel';
import { Stock } from './../models/StockModel';
import * as cloudinary from 'cloudinary';
import { Router } from 'express';
import 'dotenv/config';
import { Invoice_Item } from '../models/InvoiceItemModel';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDAPIKEY,
  api_secret: process.env.CLOUDINARYSECRET,
  secure: true
});

const router = Router();
router.post('/products', async (req: Request, res: Response) => {
  try {
    // Get product data from the request body
    const { name, price, category, description, image_uri, discontinued } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      image_uri,
      discontinued
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();
    const newStock = new Stock({
      product_id: savedProduct._id, // Using the ID of the product we just saved
      quantity: 0,
      location: 'not stock' // You can adjust this as per your requirements
    });

    await newStock.save(); // Save the stock entry
    res.status(201).json(savedProduct._id);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/get-signature', (req: Request, res: Response) => {
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
router.patch('/products/:id', async (req: Request, res: Response) => {
  try {
    const { name, price, category, description, image_uri } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product properties
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (description) product.description = description;
    if (image_uri) product.image_uri = image_uri;

    await product.save(); // save the changes to the database

    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    // Check if the product is part of any invoice items
    const isProductInInvoice = await Invoice_Item.exists({ product_id: productId });

    if (isProductInInvoice) {
      return res.status(201).json({ message: 'Cannot delete product as it is part of one or more invoice items' });
    }

    // Fetch the stock record corresponding to the product
    const stock = await Stock.findOne({ product_id: productId });

    if (!stock) {
      return res.status(201).json({ message: 'Stock record not found for the given product' });
    }

    // Check stock quantity
    if (stock.quantity > 0) {
      return res.status(201).json({ message: 'Cannot delete product with stock quantity greater than zero' });
    }

    // If stock quantity is zero and the product is not part of any invoice items, delete the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(201).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    // Delete the corresponding stock record
    await stock.deleteOne();

    res.json({ message: 'Product and corresponding stock record deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});


export { router as productRoute };
