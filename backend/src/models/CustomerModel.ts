import mongoose from "mongoose";
const customerModel = new mongoose.Schema({
    customer_id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    address: String,
    city: String,
    email: String,
    phone_number: String,
    state: String,
    zip_code: String
  });
  const Customers = mongoose.model('Customers', customerModel);

  export {Customers}
