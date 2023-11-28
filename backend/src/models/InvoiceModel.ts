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
  total: { type: Number },
  delivery_status: { type: Boolean},
  date: { type: Date},
  payment_status: { type: Boolean},
  payment_id: { type: Number },
  });
const Invoice = mongoose.model('Invoice', invoiceSchema);

export {Invoice}
