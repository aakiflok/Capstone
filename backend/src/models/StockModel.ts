import mongoose from "mongoose";
const stockSchema = new mongoose.Schema({
    stock_id: { type: Number, required: true, unique: true, autoIncrement: true },
    product_id: { type: Number, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
  });
const Stock = mongoose.model('Stock', stockSchema);

export {Stock}
