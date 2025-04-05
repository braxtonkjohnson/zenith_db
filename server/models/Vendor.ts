import mongoose from 'mongoose';


const VendorSchema = new mongoose.Schema({}, { strict: false });

const SectorSchema = new mongoose.Schema({
  SectorClassification: String,
  Vendors: {
    type: Map,
    of: VendorSchema
  }
}, { _id: false });

const ZipSchema = new mongoose.Schema({
  _id: String, // Zip code as the _id
  Sectors: {
    type: Map,
    of: SectorSchema
  }
});

export default mongoose.model('Vendor', ZipSchema);
