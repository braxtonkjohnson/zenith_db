import mongoose from 'mongoose';

// Placeholder for schema-less updates — we're working inside the vendors doc.
const ProductSchema = new mongoose.Schema({}, { strict: false });

const Product = mongoose.model('Product', ProductSchema, 'vendors'); // same collection as Vendor

export default Product;
