import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getLeads, createLead, updateLeadStatus } from '../controllers/leadController';

const router = Router();

router.get('/', requireAuth, getLeads);
router.post('/', requireAuth, createLead);
router.put('/:id', requireAuth, updateLeadStatus); // Add this route

export default router;