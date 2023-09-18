import express from 'express';
import { json } from 'body-parser';
import cors, { CorsOptions } from 'cors';
import {customerRoute} from './routes/customerRoutes'
import {userRoute} from './routes/userRoutes'
import { stockRoute } from './routes/stockRoute';
import { productRoute } from './routes/productRoutes';
import { productDicussionRoute } from './routes/productDiscussionRoutes';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors({origin: 'http://localhost:3000'}));
app.use(customerRoute);
app.use(userRoute);
app.use(stockRoute);
app.use(productRoute);
app.use(productDicussionRoute)
app.all('*', async (req, res) => {
    res.send('all');
  });
export { app };