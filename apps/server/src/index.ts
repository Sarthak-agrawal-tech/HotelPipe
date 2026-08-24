import path from 'path';
import dotenv from 'dotenv';

// 1. Force dotenv to resolve from the root of apps/server
dotenv.config({ path: path.join(process.cwd(), '.env') });

// 2. Immediate Diagnostic Check (Delete this after it works)
console.log('--- ENV DIAGNOSTIC ---');
console.log('Publishable Key:', process.env.CLERK_PUBLISHABLE_KEY ? '✅ Loaded' : '❌ MISSING');
console.log('Secret Key:', process.env.CLERK_SECRET_KEY ? '✅ Loaded' : '❌ MISSING');
console.log('----------------------');

import express from 'express';
import cors from 'cors';
import { clerkAuth, requireAuth } from './middleware/auth';
import { getAuth } from '@clerk/express';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' })); 
app.use(express.json());

// Pass keys explicitly to middleware just in case the SDK is failing to read the global process.env
app.use(clerkAuth);

app.get('/api/me', requireAuth, (req, res) => {
  const auth = getAuth(req);
  res.json({ message: 'Backend connection successful!', userId: auth.userId });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});