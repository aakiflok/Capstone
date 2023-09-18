const paymentDetailsSchema = new mongoose.Schema({
    payment_id: { type: Number, required: true, unique: true, autoIncrement: true },
    card_number: { type: Number, required: true },
    CVV: { type: Number, required: true },
  });
const PaymentDetails = mongoose.model('PaymentDetails', paymentDetailsSchema);
module.exports = PaymentDetails;