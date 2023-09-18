import express, { Request, Response } from 'express';
import { User } from './../models/UserModel';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Create a new user
router.post('/users', async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
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
router.get('/users/:id', getUser, (req: Request, res: Response) => {
  res.status(200).json(res.locals.user);
});

// Update a user
router.patch('/users/:id', getUser, async (req: Request, res: Response) => {
  if (req.body.first_name != null) {
    res.locals.user.first_name = req.body.first_name;
  }
  if (req.body.last_name != null) {
    res.locals.user.last_name = req.body.last_name;
  }
  if (req.body.address != null) {
    res.locals.user.address = req.body.address;
  }
  // Update other fields similarly

  try {
    const updatedUser = await res.locals.user.save();
    res.json(updatedUser);
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
    const token = jwt.sign({ user: user }, 'capstone', { expiresIn: '1h' });
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
