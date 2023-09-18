import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true, autoIncrement: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    image_uri: { type: String, required: true },
  });
const Product = mongoose.model('Product', productSchema);
export {Product}

