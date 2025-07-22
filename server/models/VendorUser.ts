import mongoose, { Document, Schema } from 'mongoose'

export interface IVendorUser extends Document {
  Username: string
  Password: string
  Name: string
  Title: string
  AuthorizedVendorID: string
  profilePictureUrl: string | null
}

const VendorUserSchema = new Schema<IVendorUser>({
  Username: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  Name: { type: String, required: true },
  Title: { type: String, required: true },
  AuthorizedVendorID: { type: String, required: true },
  profilePictureUrl: { type: String, default: null }
})

const VendorUser = mongoose.model<IVendorUser>('VendorUser', VendorUserSchema, 'vendor_users')

export default VendorUser

