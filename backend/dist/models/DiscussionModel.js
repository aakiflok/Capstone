"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discussions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const discussionsSchema = new mongoose_1.default.Schema({
    product_id: {
        type: Number,
        ref: 'Product',
        required: true,
    },
    user_id: {
        type: Number,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
const Discussions = mongoose_1.default.model('Discussions', discussionsSchema);
exports.Discussions = Discussions;
