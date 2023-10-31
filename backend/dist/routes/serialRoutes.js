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
exports.unitSerialRoute = void 0;
const express_1 = __importDefault(require("express"));
const UnitSerialModel_1 = require("./../models/UnitSerialModel");
const router = express_1.default.Router();
exports.unitSerialRoute = router;
//get all serail value with a specific stock id
router.get('/unit-serials-by-stock/:stockId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stockId = req.params.stockId;
        const unitSerialsForStock = yield UnitSerialModel_1.Unit_Serial.find({ stock_id: stockId });
        if (unitSerialsForStock.length === 0) {
            return res.status(404).json({ message: 'No unit serial records found for this stock_id' });
        }
        res.status(200).json(unitSerialsForStock);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Delete a unit serial record
router.delete('/unit-serial/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unitSerial = yield UnitSerialModel_1.Unit_Serial.findById(req.params.id);
        if (!unitSerial) {
            return res.status(404).json({ message: 'Unit serial record not found' });
        }
        yield unitSerial.deleteOne();
        res.json({ message: 'Unit serial record deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// Add a new unit serial record
router.post('/addUnitSerial', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSerial = new UnitSerialModel_1.Unit_Serial({
            stock_id: req.body.stock_id,
            serial_number: req.body.serial_number,
            isAvailable: req.body.isAvailable
        });
        const savedSerial = yield newSerial.save();
        res.status(201).json(savedSerial);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
