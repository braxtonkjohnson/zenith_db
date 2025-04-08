import mongoose from 'mongoose';

const ProServSchema = new mongoose.Schema({}, { strict: false });

const ProServ = mongoose.model('ProServ', ProServSchema, 'proserv');

export default ProServ;
