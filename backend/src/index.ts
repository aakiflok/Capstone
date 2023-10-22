import mongoose from 'mongoose';
import { app } from './app';
require('dotenv').config();
async function start() {
  try {
    const url = process.env.MONGODB_URI_CONNECTION_STRING || "";

    try {
      await mongoose.connect(url);
      console.log('connected to mongoDB');
    } catch (err) {
      console.error(err);
    }

    app.listen(process.env.PORT, () => {
      console.log('app listening to 3001');
    });
  } catch {}
}

start().catch(console.dir);
