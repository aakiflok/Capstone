import mongoose from "mongoose";
const stockSchema = new mongoose.Schema({
    product_id: { type:  mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
  });
const Stock = mongoose.model('Stock', stockSchema);

export {Stock}
