import path from 'path';
import dotenv from 'dotenv';

//Routes import
import hotelRoutes from './routes/hotel';
import leadRoutes from "./routes/lead"


// 1. Force dotenv to resolve from the root of apps/server
dotenv.config({ path: path.join(process.cwd(), '.env') });


import express from 'express';
import cors from 'cors';
import { clerkAuth, requireAuth } from './middleware/auth';
import { getAuth } from '@clerk/express';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' })); 
app.use(express.json());

// Pass keys explicitly to middleware just in case the SDK is failing to read the global process.env
app.use(clerkAuth);

//Hotel Routes
app.use('/api/hotels', hotelRoutes);

//Leads Routes
app.use('/api/leads', leadRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});