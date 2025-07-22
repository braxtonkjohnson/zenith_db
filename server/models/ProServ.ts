import mongoose, { Document, Schema } from 'mongoose';

export interface IProServ extends Document {
  ProductName: string;
  Price: number;
  ClassID: string;
  DetailID: string;
  DistributorID: string;
  Nutrition?: {
    calories?: number;
    protein?: string;
    sugar?: string;
  };
  VendorID: string;
}

const ProServSchema = new Schema<IProServ>({
  ProductName: { type: String, required: true },
  Price: { type: Number, required: true },
  ClassID: { type: String, required: true },
  DetailID: { type: String, required: true },
  DistributorID: { type: String, required: true },
  Nutrition: {
    calories: Number,
    protein: String,
    sugar: String
  },
  VendorID: { type: String, required: true }
});

const ProServ = mongoose.model<IProServ>('ProServ', ProServSchema, 'proserv');

export default ProServ;
