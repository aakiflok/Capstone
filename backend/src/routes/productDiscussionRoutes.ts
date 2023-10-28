import express from 'express';
import mongoose from 'mongoose';
import { Discussions } from '../models/DiscussionModel';

const router = express.Router();

// Create a new product message
router.post('/products/:productId/messages/:userId', async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid Product or User ID format.' });
    }

    // Convert to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Log the received data for debugging
    console.log('Received Data:', { productId, userId, message });

    const productMessage = new Discussions({
      product_id: productObjectId,
      user_id: userObjectId,
      message,
    });

    await productMessage.save();

    // Log success message for debugging
    console.log('Message saved successfully:', productMessage);

    res.status(201).json(productMessage);
  } catch (error:any) {
    console.error('Error:', error);

    // Send a more specific error response
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Retrieve all messages for a specific product
router.get('/products/:productId/messages', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID format.' });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    const messages = await Discussions.find({ product_id: productObjectId }).sort({ createdAt: 'asc' });
    res.status(200).json(messages);
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export { router as productDicussionRoute };
