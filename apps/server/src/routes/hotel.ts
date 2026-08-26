import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { createHotel, getMyHotel } from '../controllers/hotelController';

const router = Router();

// Both routes are protected by Clerk
router.post('/', requireAuth, createHotel);
router.get('/me', requireAuth, getMyHotel);

export default router;