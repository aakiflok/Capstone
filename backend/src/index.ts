import mongoose from 'mongoose';

import { app } from './app';

async function start() {
  try {
    const url =
      'mongodb+srv://aakiflok:Ao9Y4YdcGEHsZXFv@cluster.wipvufy.mongodb.net/?retryWrites=true&w=majority';

    try {
      await mongoose.connect(url);
      console.log('connected to mongoDB');
    } catch (err) {
      console.error(err);
    }

    app.listen(3001, () => {
      console.log('app listening to 3001');
    });
  } catch {}
}

start().catch(console.dir);
