import express, { Request, Response } from 'express';
import { Stock } from './../models/StockModel';

const router = express.Router();

// Get all stock records
router.get('/stock', async (req: Request, res: Response) => {
  try {
    const stock = await Stock.find();
    res.status(200).json(stock);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific stock record by stock_id
router.get('/stock/:stock_id', async (req: Request, res: Response) => {
  try {
    const stock = await Stock.findOne({ stock_id: req.params.stock_id });
    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }
    res.status(200).json(stock);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Update a stock record
router.patch('/stock/:stock_id', async (req: Request, res: Response) => {
  try {
    const stock = await Stock.findOne({ stock_id: req.params.stock_id });
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

// Delete a stock record
router.delete('/stock/:stock_id', async (req: Request, res: Response) => {
  try {
    const stock = await Stock.findOne({ stock_id: req.params.stock_id });
    if (!stock) {
      return res.status(404).json({ message: 'Stock record not found' });
    }

    await stock.deleteOne();
    res.json({ message: 'Stock record deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export { router as stockRoute };
