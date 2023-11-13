import mongoose from "mongoose";
const usersModel = new mongoose.Schema({
    first_name: String,
    last_name: String,
    birthdate: Date,
    address: String,
    username: String,
    password: {
      type: String,
      required: true,
      select: false, // This will prevent the password from being included in query results by default
    },
    email: String,
    role: String,
    joining_date: Date,
  });
  const User = mongoose.model('User', usersModel);

  export {User}