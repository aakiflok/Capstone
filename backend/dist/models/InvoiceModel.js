"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceSchema = new mongoose_1.default.Schema({
    customer_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Customers',
        required: true,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total: { type: Number, required: true },
    delivery_status: { type: Boolean, required: true },
    date: { type: Date, required: true },
    payment_status: { type: Boolean, required: true },
    payment_id: { type: Number, required: true },
});
const Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
exports.Invoice = Invoice;
