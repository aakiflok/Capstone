"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersModel = new mongoose_1.default.Schema({
    first_name: String,
    last_name: String,
    birthdate: Date,
    address: String,
    username: String,
    password: String,
    email: String,
    role: String,
    joining_date: Date,
});
const User = mongoose_1.default.model('User', usersModel);
exports.User = User;
