import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: String,
    image_uri: { type: String, required: true },
    discontinued: {type: Boolean, requied: true}
  });
const Product = mongoose.model('Product', productSchema);
export {Product}

