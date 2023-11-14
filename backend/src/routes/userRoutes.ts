import express, { Request, Response } from 'express';
import { User } from './../models/UserModel';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// Create a new user
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

    const user = new User({first_name,
      last_name,
      birthdate,
      address,
      username,
      password, 
      email,
      role,
      joining_date});
    // Set the users properties that came in the request body
    
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
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




// Delete a user
router.delete('/users/:id', getUser, async (req: Request, res: Response) => {
  try {
    await res.locals.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/users/login', async (req: Request, res: Response) => {
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

    const isPasswordValid = password == user.password

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
