// Import necessary modules and models
import express from 'express';
import mongoose from 'mongoose';
import { Discussions } from '../models/DiscussionModel';
import { User } from '../models/UserModel';

// Create an instance of an Express router
const router = express.Router();

// Route to post a message for a specific product and user
router.post('/products/:productId/messages/:userId', async (req, res) => {
  try {
    const { productId, userId } = req.params;
    const { message } = req.body;

    // Validate the format of product and user IDs
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid Product or User ID format.' });
    }

    // Fetch user's first and last name based on userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Log the received data for debugging
    console.log('Received Data:', { productId, userId, message });

    // Create and save a new message document
    const productMessage = new Discussions({
      product_id: productId,
      user_id: userId,
      message,
    });

    await productMessage.save();

    // Log success message for debugging
    console.log('Message saved successfully:', productMessage);

    // Send the response with user's first and last name
    res.status(201).json({
      ...productMessage.toObject(), // Include message document
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
  } catch (error: any) {
    console.error('Error:', error);

    // Send a more specific error response
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to retrieve all messages for a specific product
router.get('/products/:productId/messages', async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate the format of the product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID format.' });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Fetch messages and populate user details
    const messages = await Discussions.find({ product_id: productObjectId })
      .populate({
        path: 'user_id',
        select: 'first_name last_name role', // Select the fields you want
      })
      .sort({ createdAt: 'asc' });

    res.status(200).json(messages);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export { router as productDiscussionRoute };
