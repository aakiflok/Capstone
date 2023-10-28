import express, { Request, Response } from 'express';
import { Product } from './../models/ProductModel';
import { Stock } from './../models/StockModel';

const router = express.Router();
const azure = require('azure-storage');
const blobService = azure.createBlobService('posproject', 'KYTgOoFQL+ZtpAnfQFOi3waffpKAw5Zc4KeSrXH/hIqtdjzirdjo02iWZu2w1lvfQcFyUqTYB6ZE+ASt+RkWwg==');
console.log(blobService);
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/products', async (req: Request, res: Response) => {
  try {
    // Get product data from the request body
    const { name, price, category, description, image_uri } = req.body;

    // Create a new product instance
    const newProduct = new Product({
      name,
      price,
      category,
      description,
      image_uri,
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

router.post('/upload', upload.single('image'), async (req: any, res) => {
  try {
    const containerName = 'productStorage'; // Replace with your container name
    const blobName = req.file.originalname;
    const buffer = req.file.buffer;

    // Check if the container exists, and create it if not
    blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, (createError: any) => {
      if (!createError) {
        // Container either exists or was successfully created

        // Upload the blob to the container
        blobService.createBlockBlobFromText(
          containerName,
          blobName,
          buffer,
          buffer.length,
          (uploadError: any, _result: any, _response: Response) => {
            if (!uploadError) {
              const imageUrl = blobService.getUrl(containerName, blobName);
              res.status(201).json({ imageUrl });
            } else {
              res.status(500).json({ error: uploadError });
            }
          }
        );
      } else {
        res.status(500).json({ error: createError });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
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
      // Fetch the stock record corresponding to the product
      const stock = await Stock.findOne({ product_id: req.params.id });
      
      if (!stock) {
          return res.status(404).json({ message: 'Stock record not found for the given product' });
      }
      
      // Check stock quantity
      if (stock.quantity > 0) {
          return res.status(400).json({ message: 'Cannot delete product with stock quantity greater than zero' });
      }

      // If stock quantity is zero, delete the product
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
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
