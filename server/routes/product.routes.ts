import express from 'express';
import { addProductsToVendor } from '../controllers/proserv.controller';

const router = express.Router();

router.post('/add', addProductsToVendor);

export default router;
