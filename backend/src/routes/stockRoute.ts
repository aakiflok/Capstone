import express, { Request, Response } from 'express';
import { Stock } from './../models/StockModel';
import { Product } from '../models/ProductModel';

const router = express.Router();

// Get all stock records
router.get('/stock', async (req: Request, res: Response) => {
  try {
    const stockRecords = await Stock.find();

    // Fetching product names for each stock record asynchronously
    const enrichedStock = await Promise.all(stockRecords.map(async (stockItem) => {
      const product = await Product.findById(stockItem.product_id);
      return {
        _id: stockItem._id,
        product_name: product ? product.name : 'Product Not Found',
        quantity: stockItem.quantity,
        location: stockItem.location,
        price: product ? product.price: 0,
        discountinued: product ? product.discontinued : 'N/A',        
      };
    }));

    res.status(200).json(enrichedStock);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific stock record by _id
router.get('/stock/:id', async (req: Request, res: Response) => {
  try {
    const stockId = req.params.id;
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    const product = await Product.findById(stock.product_id);
    
    const enrichedStock=  {
      _id: stock._id,
      product_name: product ? product.name : 'Product Not Found',
      product_id : product? product._id: 'Product Not Found',
      quantity: stock.quantity,
      location: stock.location,
      price: product ? product.price: 0,
      discountinued: product ? product.discontinued : 'N/A',        
    };
    res.status(200).json(enrichedStock);
    
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update a stock record
router.patch('/stock/:id', async (req: Request, res: Response) => {
  try {
    const stockId = req.params.id;
    const stock = await Stock.findById(stockId);
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

    const updatedStock = await stock.save();
    res.status(200).json(updatedStock);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Get quantity
router.get('/stock/quantity/:productId', async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const stock = await Stock.findOne({ product_id: productId });

    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    // Return only the quantity
    res.status(200).json({ quantity: stock.quantity });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a stock record
router.delete('/stock/:id', async (req: Request, res: Response) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    await stock.deleteOne();
    res.json({ message: 'Stock record deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stock-bar-chart-data', async (req: Request, res: Response) => {
  try {
    // Aggregate stock quantities by product category
    const aggregateData = await Stock.aggregate([
      {
        $lookup: {
          from: "products", // This should match your products collection name in the database
          localField: "product_id",
          foreignField: "_id",
          as: "product_info"
        }
      },
      { $unwind: "$product_info" }, // Deconstructs the array field from the input documents to output a document for each element
      {
        $group: {
          _id: "$product_info.category", // Group by product category
          totalQuantity: { $sum: "$quantity" } // Sum the quantity for each category
        }
      },
      {
        $project: {
          _id: 0, // Suppress the _id field
          category: "$_id",
          totalQuantity: 1
        }
      },
      { $sort: { category: 1 } } // Optional: sort by category name
    ]);

    // Create labels and data arrays for the bar chart
    const labels = aggregateData.map(item => item.category);
    const data = aggregateData.map(item => item.totalQuantity);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Stock Quantity by Category",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
          hoverBorderColor: "rgba(255, 99, 132, 1)",
          data
        }
      ]
    };

    res.status(200).json(chartData);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export { router as stockRoute };
