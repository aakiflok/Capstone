const invoiceModel = new mongoose.Schema({
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    total: { type: Number, required: true },
    delivery_status: { type: Boolean, required: true },
    date: { type: Date, required: true },
    payment_status: { type: Boolean, required: true },
    payment_id: { type: Number, required: true },
  });
const Invoice = mongoose.model('Invoice', invoiceModel);

export {Invoice}
