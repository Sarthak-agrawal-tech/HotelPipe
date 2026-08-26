import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { prisma } from '../config/prismaClient';

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    
    // 1. Find the hotel that belongs to this logged-in user
    const hotel = await prisma.hotel.findUnique({ 
      where: { ownerId: auth.userId || '' } 
    });

    if (!hotel) {
      // If they haven't onboarded yet, return an empty array
      res.status(200).json([]);
      return;
    }

    // 2. Fetch all leads for this specific hotel
    const leads = await prisma.lead.findMany({
      where: { hotelId: hotel.id },
      orderBy: { createdAt: 'desc' } // Newest leads first
    });

    res.status(200).json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};