import mongoose, { Schema, Document } from 'mongoose';

export interface ISector extends Document {
  _id: string; // Sector code like "AF"
  SectorClassification: string;
}

const SectorSchema: Schema = new Schema({
  _id: {
    type: String,
    required: true
  },
  SectorClassification: {
    type: String,
    required: true
  }
});

export default mongoose.model<ISector>('Sector', SectorSchema);
