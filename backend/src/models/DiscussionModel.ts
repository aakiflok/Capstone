import mongoose from "mongoose";
const discussionsSchema = new mongoose.Schema({
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
const Discussions = mongoose.model('Discussions', discussionsSchema);
export{Discussions}