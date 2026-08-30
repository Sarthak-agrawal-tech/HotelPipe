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

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    const hotel = await prisma.hotel.findUnique({ where: { ownerId: auth.userId || '' } });

    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    // Extracted source, eventDate, and guestCount from the request!
    const { name, phone, city, status, notes, eventDate, guestCount, source } = req.body;

    const newLead = await prisma.lead.create({
      data: {
        hotelId: hotel.id,
        name,
        phone: phone || '',
        inquiryType: city || '', 
        status: status || 'NEW', 
        source: source || 'WHATSAPP', // Saves the custom source!
        notes: notes || null,
        // Safely parse the timestamp back into a Prisma DateTime object
        eventDate: eventDate ? new Date(eventDate) : null,
        // Safely parse the guest string into an integer
        guestCount: guestCount ? parseInt(guestCount.toString(), 10) : null
      }
    });

    res.status(201).json(newLead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { 
        // Convert to uppercase for Prisma Enum
        status: status.toUpperCase() 
      }
    });

    res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Error updating lead status:', error);
    res.status(500).json({ error: 'Failed to update lead status' });
  }
};