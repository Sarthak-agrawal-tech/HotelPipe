import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getLeads } from '../controllers/leadController';

const router = Router();

// Protect the route with Clerk middleware
router.get('/', requireAuth, getLeads);

export default router;