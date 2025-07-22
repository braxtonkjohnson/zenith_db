import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import vendorRoutes from './routes/vendor.routes';
import productRoutes from './routes/product.routes'
import userRoutes from './routes/user.routes'
import vendorUserRoutes from './routes/vendorUser.routes'
import proServRoutes from './routes/proServRoutes'
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/vendors', vendorRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendor_users', vendorUserRoutes);
app.use('/api/proserv', proServRoutes);

const PORT = process.env.PORT || 3001;

// Check if the JSON file exists
const jsonPath = path.join(__dirname, '../zenith_dev.vendors.json');
console.log('Checking for JSON file at:', jsonPath);
if (fs.existsSync(jsonPath)) {
  console.log('✅ JSON file found');
} else {
  console.error('❌ JSON file not found at:', jsonPath);
}

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- GET /api/proserv/classes');
      console.log('- GET /api/proserv/vendor/:vendorID');
      console.log('- POST /api/proserv/vendor/:vendorID');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
