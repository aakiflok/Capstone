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
const cors_1 = __importDefault(require("cors"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
require("dotenv/config");
const InvoiceModel_1 = require("../models/InvoiceModel");
const router = express_1.default.Router();
exports.userRoute = router;
const DOMAIN = process.env.MAILGUN_DOMAIN || '';
const mg = (0, mailgun_js_1.default)({ apiKey: process.env.MAILGUN_API_KEY || '', domain: DOMAIN });
// Create a new user
router.post('/addUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, birthdate, address, username, password, email, role, joining_date } = req.body;
        const user = new UserModel_1.User({
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
        // Set the users properties that came in the request body
        const savedUser = yield user.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
router.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.put('/updateUser/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, birthdate, address, username, password, // Remember: Store hashed passwords, not plain text
        email, role, joining_date } = req.body;
        const user = yield UserModel_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user properties
        if (first_name)
            user.first_name = first_name;
        if (last_name)
            user.last_name = last_name;
        if (birthdate)
            user.birthdate = new Date(birthdate);
        if (address)
            user.address = address;
        if (username)
            user.username = username;
        if (password)
            user.password = password; // TODO: Hash the password
        if (email)
            user.email = email;
        if (role)
            user.role = role;
        if (joining_date)
            user.joining_date = new Date(joining_date);
        yield user.save();
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
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}));
// Delete a user
router.delete('/users/:id', getUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield InvoiceModel_1.Invoice.find({ user_id: req.params.id });
        if (invoices.length > 0) {
            return res.status(201).json({ message: 'Employee cannot be deleted as they are associated with one or more invoices' });
        }
        const userId = req.params.id;
        yield UserModel_1.User.findByIdAndDelete(userId);
        res.json({ message: 'Employee deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
router.post('/users/login', (0, cors_1.default)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
