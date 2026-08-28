import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { createHotel, getMyHotel, updateHotel } from '../controllers/hotelController';

const router = Router();

// Store files in memory temporarily so we can shoot them straight to Supabase
const upload = multer({ storage: multer.memoryStorage() });

// Add upload.array('files') middleware
router.post('/', requireAuth, upload.array('files'), createHotel);
router.get('/me', requireAuth, getMyHotel);
router.put('/me', requireAuth, upload.array('files'), updateHotel);

export default router;