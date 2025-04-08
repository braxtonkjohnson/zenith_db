import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({}, { strict: false });

const Vendor = mongoose.model('Vendor', VendorSchema, 'vendors');

export default Vendor;

