"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const customerModel = new mongoose_1.default.Schema({
    customer_id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: String,
    city: String,
    email: String,
    phone_number: String,
    state: String,
    zip_code: String
});
const Customers = mongoose_1.default.model('Customers', customerModel);
exports.Customers = Customers;
