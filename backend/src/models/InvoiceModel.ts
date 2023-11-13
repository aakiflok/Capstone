import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
   customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customers',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  total: { type: Number, required: true },
  delivery_status: { type: Boolean, required: true },
  date: { type: Date, required: true },
  payment_status: { type: Boolean, required: true },
  payment_id: { type: Number, required: true },
  });
const Invoice = mongoose.model('Invoice', invoiceSchema);

export {Invoice}
