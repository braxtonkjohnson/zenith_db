import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import vendorRoutes from './routes/vendor.routes';
import productRoutes from './routes/product.routes'
import userRoutes from './routes/user.routes'
import vendorUserRoutes from './routes/vendorUser.routes'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendor_users', vendorUserRoutes) 

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
