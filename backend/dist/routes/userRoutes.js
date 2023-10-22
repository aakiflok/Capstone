"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const UserModel_1 = require("./../models/UserModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.userRoute = router;
// Create a new user
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new UserModel_1.User(req.body);
        const savedUser = yield user.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Get all users
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserModel_1.User.find();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Get a specific user
router.get('/users/:id', getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield UserModel_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Update a user
router.patch('/users/:id', getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedUser = yield res.locals.user.save();
        res.json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete a user
router.delete('/users/:id', getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield res.locals.user.remove();
        res.json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        // Find the user by username
        const user = yield UserModel_1.User.findOne({ username });
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
        const token = jsonwebtoken_1.default.sign({ user: user }, jwtToken, { expiresIn: '1h' });
        res.cookie('loggedUser', token, { httpOnly: true });
        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield UserModel_1.User.findById(req.params.id);
            if (user == null) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.locals.user = user;
            next();
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    });
}
