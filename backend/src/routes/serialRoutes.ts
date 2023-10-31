import express, { Request, Response } from 'express';
import { Unit_Serial } from './../models/UnitSerialModel';
import { Product } from '../models/ProductModel';

const router = express.Router();

//get all serail value with a specific stock id
router.get('/unit-serials-by-stock/:stockId', async (req: Request, res: Response) => {
    try {
      const stockId = req.params.stockId;
      const unitSerialsForStock = await Unit_Serial.find({ stock_id: stockId });
  
      if (unitSerialsForStock.length === 0) {
        return res.status(404).json({ message: 'No unit serial records found for this stock_id' });
      }
  
      res.status(200).json(unitSerialsForStock);
      
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

// Delete a unit serial record
router.delete('/unit-serial/:id', async (req: Request, res: Response) => {
  try {
    const unitSerial = await Unit_Serial.findById(req.params.id);
    if (!unitSerial) {
      return res.status(404).json({ message: 'Unit serial record not found' });
    }

    await unitSerial.deleteOne();
    res.json({ message: 'Unit serial record deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
// Add a new unit serial record
router.post('/addUnitSerial', async (req: Request, res: Response) => {
  try {
    const newSerial = new Unit_Serial({
      stock_id: req.body.stock_id,
      serial_number: req.body.serial_number,
      isAvailable: req.body.isAvailable
    });

    const savedSerial = await newSerial.save();
    res.status(201).json(savedSerial);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export { router as unitSerialRoute };
