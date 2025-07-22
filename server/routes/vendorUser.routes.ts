import express from 'express'
import multer from 'multer'
import path from 'path'
import { loginVendorUser, uploadProfilePicture } from '../controllers/vendorUser.controller'

const router = express.Router()

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/avatars'))
  },
  filename: function (req, file, cb) {
    const userId = req.params.userId; // Assuming userId is in the route params
    const fileExt = path.extname(file.originalname);
    cb(null, `${userId}${fileExt}`) // e.g., userId.jpg
  }
});

const upload = multer({ storage: storage });

router.post('/login', loginVendorUser)

// Route for profile picture upload
// The field name in the form-data should be 'avatar'
router.post('/:userId/avatar', upload.single('avatar'), uploadProfilePicture);

export default router
