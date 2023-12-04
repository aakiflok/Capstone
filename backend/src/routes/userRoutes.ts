// Import necessary modules and models
import express, { Request, Response } from 'express';
import { User } from './../models/UserModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import cors from 'cors';
import mailgun from 'mailgun-js';
import 'dotenv/config';
import { Invoice } from '../models/InvoiceModel';
const router = express.Router();

const DOMAIN = process.env.MAILGUN_DOMAIN || '';
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY || '', domain: DOMAIN });

// Route to create a new user
router.post('/addUser', async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      birthdate,
      address,
      username,
      password,
      email,
      role,
      joining_date
    } = req.body;

    const user = new User({
      first_name,
      last_name,
      birthdate,
      address,
      username,
      password,
      email,
      role,
      joining_date
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Route to send an email
router.post('/send-email', async (req: Request, res: Response) => {
  const { email, subject, message } = req.body;

  const mailData = {
    from: 'aakiflok52.al@gmail.com', // Your verified Mailgun sender
    to: email,
    subject: subject,
    text: message,
  };

  mg.messages().send(mailData, (error, body) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ error: error.message });
    }
    console.log('Email sent', body);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Route to get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a specific user by ID
router.get('/users/:id', getUser, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update a user by ID
router.put('/updateUser/:id', async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      birthdate,
      address,
      username,
      password, // Remember: Store hashed passwords, not plain text
      email,
      role,
      joining_date
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user properties
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (birthdate) user.birthdate = new Date(birthdate);
    if (address) user.address = address;
    if (username) user.username = username;
    if (password) user.password = password; // TODO: Hash the password
    if (email) user.email = email;
    if (role) user.role = role;
    if (joining_date) user.joining_date = new Date(joining_date);

    await user.save();

    // Respond with the updated user fields
    const responseObject = {
      first_name: user.first_name,
      last_name: user.last_name,
      birthdate: user.birthdate,
      address: user.address,
      username: user.username,
      email: user.email,
      role: user.role,
      joining_date: user.joining_date
    };

    res.status(200).json(responseObject);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Route to delete a user by ID
router.delete('/users/:id', getUser, async (req: Request, res: Response) => {
  try {

    const invoices = await Invoice.find({ user_id: req.params.id });

    if (invoices.length > 0) {
      return res.status(201).json({ message: 'Employee cannot be deleted as they are associated with one or more invoices' });
    }
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Employee deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Route to log in a user
router.post('/users/login', cors(), async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = password == user.password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const jwtToken = process.env.JWT_TOKEN;
    if (!jwtToken) {
      return res.status(500).json({ message: 'JWT_TOKEN environment variable not set' });
    }
    const token = jwt.sign({ user: user }, jwtToken, { expiresIn: '1h' });
    res.cookie('loggedUser', token, { httpOnly: true });
    res.status(200).json({ user, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a user by ID
async function getUser(req: Request, res: Response, next: Function) {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.locals.user = user;
    next();
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export { router as userRoute };
