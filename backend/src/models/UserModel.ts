import mongoose from "mongoose";
const usersModel = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    first_name: String,
    last_name: String,
    birthdate: Date,
    address: String,
    username: String,
    password: String,
    email: String,
    role: String,
    joining_date: Date,
  });
  const User = mongoose.model('User', usersModel);

  export {User}