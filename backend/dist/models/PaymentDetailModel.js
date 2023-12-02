"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentDetailSchema = new mongoose_1.default.Schema({
    invoiceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Invoice', // Assuming you have an Invoice model
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethodId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const PaymentDetail = mongoose_1.default.model('PaymentDetail', paymentDetailSchema);
exports.default = PaymentDetail;
