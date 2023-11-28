import express, { Request, Response } from 'express';
import { Unit_Serial } from './../models/UnitSerialModel';
import { Product } from '../models/ProductModel';

const router = express.Router();

// Get all serial values with a specific stock id
router.get('/unit-serials-by-stock/:stockId', async (req: Request, res: Response) => {
  try {
    const stockId = req.params.stockId;
    const unitSerialsForStock = await Unit_Serial.find({ stock_id: stockId });
    res.status(200).json(unitSerialsForStock);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all unit serial records for a specific stock
// Delete available unit serial records for a specific stock
// Delete unit serial records by stock ID
router.delete('/unit-serials-by-stock/:stockId', async (req: Request, res: Response) => {
  try {
    const stockId = req.params.stockId;

    // Find all available unit serial records for the specified stock ID
    const unitSerialsToDelete = await Unit_Serial.find({ stock_id: stockId, isAvailable: true });


    // Delete all the available unit serial records
    await Unit_Serial.deleteMany({ _id: { $in: unitSerialsToDelete.map(serial => serial._id) } });

    res.json({ message: 'Unit serial records deleted' });
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
