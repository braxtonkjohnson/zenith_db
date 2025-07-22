import express from 'express';
import { createVendor } from '../controllers/vendor.controller';
import { getVendorByID } from '../controllers/vendor.controller';

const router = express.Router();

router.post('/create', createVendor);

router.get("/:vendorID", getVendorByID);

export default router;

