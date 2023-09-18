import express from 'express';
import { Discussions } from '../models/DiscussionModel';
const router = express.Router();

// Create a new product message
router.post('/products/:productId/messages/:userId', async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const { message } = req.body;

    // Log the received data for debugging
    console.log('Received Data:', { productId, userId, message });

    const productMessage = new Discussions({
      product_id: productId,
      user_id: userId,
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
  
      const messages = await Discussions.find({ product_id: productId }).sort({ createdAt: 'asc' });
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  export { router as productDicussionRoute };