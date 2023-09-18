import express, { Request, Response } from 'express';
import { Product } from './../models/ProductModel';
import { Stock } from './../models/StockModel';

const router = express.Router();
const azure = require('azure-storage');
const blobService = azure.createBlobService('posproject', 'KYTgOoFQL+ZtpAnfQFOi3waffpKAw5Zc4KeSrXH/hIqtdjzirdjo02iWZu2w1lvfQcFyUqTYB6ZE+ASt+RkWwg==');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload', upload.single('image'), async (req: any, res) => {
  try {
    const containerName = 'posproject'; // Replace with your container name
    const blobName = req.file.originalname;

    const buffer = req.file.buffer;

    blobService.createBlockBlobFromText(
      containerName,
      blobName,
      buffer,
      buffer.length,
      (error :any, _result :any, response :Response) => {
        if (!error) {
          const imageUrl = blobService.getUrl(containerName, blobName);
          res.status(201).json({ imageUrl });
        } else {
          res.status(500).json({ message: 'Error uploading image to Azure Blob Storage' });
        }
      }
    );
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
    const product = await Product.findOne({ id: productId });

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
    const product = await Product.findById(req.params.id);
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

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated stock records if needed
    await Stock.deleteMany({ product_id: product.id });

    // await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export { router as productRoute };
