import express from 'express';
import {
  getVendorProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getClassOptions,
  getDetailClassifiers
} from '../controllers/proServController';

const router = express.Router();

// Get all class options
router.get('/classes', getClassOptions);

// Get detail classifiers for a class
router.get('/classes/:classId/detail-classifiers', getDetailClassifiers);

// Get all products for a vendor
router.get('/vendor/:vendorID', getVendorProducts);

// Add a new product
router.post('/vendor/:vendorID', addProduct);

// Update a product
router.put('/:productId', updateProduct);

// Delete a product
router.delete('/:productId', deleteProduct);

export default router; 