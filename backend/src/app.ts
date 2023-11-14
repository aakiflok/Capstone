import express from 'express';
import { json } from 'body-parser';
import cors, { CorsOptions } from 'cors';
import {customerRoute} from './routes/customerRoutes'
import {userRoute} from './routes/userRoutes'
import { stockRoute } from './routes/stockRoute';
import { productRoute } from './routes/productRoutes';
import { productDicussionRoute } from './routes/productDiscussionRoutes';
import { unitSerialRoute } from './routes/serialRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors({origin: 'https://pos-system-ig9m.onrender.com/',
optionsSuccessStatus: 200}));
app.use(customerRoute);
app.use(userRoute);
app.use(stockRoute);
app.use(productRoute);
app.use(productDicussionRoute);
app.use(unitSerialRoute);
app.use(invoiceRoutes)
app.all('*', async (req, res) => {
    res.send('all');
  });
export { app };