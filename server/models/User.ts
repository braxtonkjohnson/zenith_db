import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  Name: String,
  Age: Number,
  Job: String,
  Email: { type: String, required: true, unique: true },
  Phone: String,
  Password: { type: String, required: true },
  Transactions: { type: Array, default: [] }
});

export default mongoose.model('User', UserSchema);
