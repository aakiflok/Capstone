const invoiceModel = new mongoose.Schema({
    invoice_id: { type: Number, required: true, unique: true, autoIncrement: true },
    customer_id: { type: Number, required: true },
    user_id: Number,
    total: { type: Number, required: true },
    delivery_status: { type: Boolean, required: true },
    date: { type: Date, required: true },
    payment_status: { type: Boolean, required: true },
    payment_id: { type: Number, required: true },
  });
const Invoice = mongoose.model('Invoice', invoiceModel);
module.exports = Invoice;