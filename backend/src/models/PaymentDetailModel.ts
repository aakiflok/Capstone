import mongoose from 'mongoose';

const paymentDetailSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice', // Assuming you have an Invoice model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethodId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const PaymentDetail = mongoose.model('PaymentDetail', paymentDetailSchema);

export default PaymentDetail;