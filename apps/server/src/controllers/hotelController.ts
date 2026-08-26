import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { prisma } from '../config/prismaClient';

export const createHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    const ownerId = auth.userId;

    if (!ownerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, city, state, whatsappNumber, primaryLanguage, focusArea } = req.body;

    // Ensure one hotel per owner for now
    const existingHotel = await prisma.hotel.findUnique({ where: { ownerId } });
    if (existingHotel) {
      res.status(400).json({ error: 'You have already registered a hotel.' });
      return;
    }

    const hotel = await prisma.hotel.create({
      data: {
        ownerId,
        name,
        city,
        state,
        whatsappNumber,
        primaryLanguage: primaryLanguage || 'hindi',
        focusArea: focusArea || 'wedding',
      },
    });

    res.status(201).json(hotel);
  } catch (error: any) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  }
};

export const getMyHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    
    const hotel = await prisma.hotel.findUnique({ 
      where: { ownerId: auth.userId || '' } 
    });

    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};