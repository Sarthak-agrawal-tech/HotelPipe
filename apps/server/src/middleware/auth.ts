import { clerkMiddleware, getAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';

// 1. Centralized middleware to parse the token (apply this globally in index.ts)
export const clerkAuth = clerkMiddleware();

// 2. Strict protection middleware for your specific API routes
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  
  if (!auth.userId) {
    res.status(401).json({ error: 'Unauthorized: No valid session token found' });
    return;
  }
  
  // Optional: attach userId to a custom property if you want easier access later
  // req.userId = auth.userId;
  
  next();
};