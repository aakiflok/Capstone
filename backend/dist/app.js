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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const customerRoutes_1 = require("./routes/customerRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const stockRoute_1 = require("./routes/stockRoute");
const productRoutes_1 = require("./routes/productRoutes");
const productDiscussionRoutes_1 = require("./routes/productDiscussionRoutes");
const serialRoutes_1 = require("./routes/serialRoutes");
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const app = (0, express_1.default)();
exports.app = app;
app.set('trust proxy', true);
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)({ origin: 'https://pos-system-ig9m.onrender.com',
    optionsSuccessStatus: 200 }));
app.use(customerRoutes_1.customerRoute);
app.use(userRoutes_1.userRoute);
app.use(stockRoute_1.stockRoute);
app.use(productRoutes_1.productRoute);
app.use(productDiscussionRoutes_1.productDicussionRoute);
app.use(serialRoutes_1.unitSerialRoute);
app.use(invoiceRoutes_1.default);
app.all('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('all');
}));
