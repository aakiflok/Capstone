// Import necessary modules and routes
import express from 'express';
import { json } from 'body-parser';
import cors, { CorsOptions } from 'cors';
import { customerRoute } from './routes/customerRoutes';
import { userRoute } from './routes/userRoutes';
import { stockRoute } from './routes/stockRoute';
import { productRoute } from './routes/productRoutes';
import { productDiscussionRoute } from './routes/productDiscussionRoutes';
import { unitSerialRoute } from './routes/serialRoutes';
import invoiceRoutes from './routes/invoiceRoutes';

// Create an instance of Express
const app = express();

// Set 'trust proxy' to true (used for reverse proxy configurations)
app.set('trust proxy', true);

// Middleware to parse JSON requests
app.use(json());

// Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: 'https://pos-system-ig9m.onrender.com', // Allow requests from this origin
  optionsSuccessStatus: 200, // Respond with a 200 status for preflight requests
}));

// Use the defined routes for various functionalities
app.use(customerRoute);
app.use(userRoute);
app.use(stockRoute);
app.use(productRoute);
app.use(productDiscussionRoute);
app.use(unitSerialRoute);
app.use(invoiceRoutes);

// Catch-all route for unspecified endpoints
app.all('*', async (req, res) => {
  res.send('all');
});

// Export the Express app
export { app };
