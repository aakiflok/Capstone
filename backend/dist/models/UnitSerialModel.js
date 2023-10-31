"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unit_Serial = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const unitSerialSchema = new mongoose_1.default.Schema({
    stock_id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    serial_number: { type: String, required: true },
    isAvailable: { type: Boolean, required: true }
});
const Unit_Serial = mongoose_1.default.model('Unit_Serial', unitSerialSchema);
exports.Unit_Serial = Unit_Serial;
