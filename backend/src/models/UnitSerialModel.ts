import mongoose from "mongoose";
const unitSerialSchema = new mongoose.Schema({    
    stock_id: { type:  mongoose.Schema.Types.ObjectId, required: true },
    serial_number: { type: String, required: true },
    isAvailable: {type: Boolean, required: true},
    invoice_id: { type:  mongoose.Schema.Types.ObjectId, required: false },
  });
const Unit_Serial = mongoose.model('Unit_Serial', unitSerialSchema );
export {Unit_Serial}