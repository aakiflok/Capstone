"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice_Item = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceItemModel = new mongoose_1.default.Schema({
    invoice_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    product_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    final_price: { type: Number, required: true }
});
const Invoice_Item = mongoose_1.default.model('Invoice_Item', invoiceItemModel);
exports.Invoice_Item = Invoice_Item;
