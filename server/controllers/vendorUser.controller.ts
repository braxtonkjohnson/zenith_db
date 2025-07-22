import { Request, Response, NextFunction } from 'express'
import VendorUser from '../models/VendorUser'
import jwt from 'jsonwebtoken'
import path from 'path'

// Updated interface to include optional profilePictureUrl
interface ILoginUser {
  _id: string; // Assuming _id is available for finding the full user doc
  Username: string
  Password: string
  Name: string
  Title: string
  AuthorizedVendorID: string
  profilePictureUrl?: string | null // Make it optional here as well
}

export const loginVendorUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body

  try {
    // Fetch the user including the password and ID first
    const user = await VendorUser.findOne({ Username: username }).lean() as ILoginUser | null;

    if (!user || user.Password !== password) { // Simple comparison (consider hashing)
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { username: user.Username, vendorID: user.AuthorizedVendorID, userId: user._id }, // Include userId in token
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '2h' }
    )

    // Return necessary user details including the profile picture URL
    res.status(200).json({
      token,
      userId: user._id, // Return userId for easier frontend requests
      name: user.Name,
      title: user.Title,
      vendorID: user.AuthorizedVendorID,
      profilePictureUrl: user.profilePictureUrl // Include the URL
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
}

export const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded.' });
    return;
  }

  // Construct the URL path (relative to the server's public root)
  const relativePath = path.join('/uploads/avatars', req.file.filename).replace(/\\/g, '/'); // Ensure forward slashes

  try {
    const updatedUser = await VendorUser.findByIdAndUpdate(
      userId,
      { profilePictureUrl: relativePath },
      { new: true, select: 'profilePictureUrl' } // Return only the updated URL
    );

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.status(200).json({ profilePictureUrl: updatedUser.profilePictureUrl });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture.' });
  }
};

