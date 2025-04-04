import express from 'express';
import { generateQRCode, getQRCodes, deleteQRCode, shareQRCode } from '../controllers/qrCodeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

router.post('/', generateQRCode);
router.get('/', getQRCodes);
router.delete('/:id', deleteQRCode);
router.post('/share', shareQRCode);

export default router; 