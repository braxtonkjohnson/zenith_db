import { Request, Response, NextFunction } from 'express'
import VendorUser from '../models/VendorUser'
import jwt from 'jsonwebtoken'

interface IVendorUser {
  Username: string
  Password: string
  Name: string
  Title: string
  AuthorizedVendorID: string
}

export const loginVendorUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, password } = req.body

  try {
    const user = (await VendorUser.findOne({ Username: username }).lean()) as IVendorUser | null

    if (!user || user.Password !== password) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const token = jwt.sign(
      { username: user.Username, vendorID: user.AuthorizedVendorID },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '2h' }
    )

    res.status(200).json({
      token,
      name: user.Name,
      title: user.Title,
      vendorID: user.AuthorizedVendorID
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
}

