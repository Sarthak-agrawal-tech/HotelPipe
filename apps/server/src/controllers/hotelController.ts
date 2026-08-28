import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { prisma } from '../config/prismaClient';
import { supabase } from '../config/supabaseClient'
import 'multer';

export const createHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    const ownerId = auth.userId;

    if (!ownerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  

    const existingHotel = await prisma.hotel.findUnique({ where: { ownerId } });
    if (existingHotel) {
      res.status(400).json({ error: 'You have already registered a hotel.' });
      return;
    }

    // 1. Create the base hotel record
    const hotel = await prisma.hotel.create({
      data: {
        ownerId,
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        googleMapsLink: req.body.googleMapsLink,
        whatsappNumber: req.body.whatsappNumber,
        secondaryNumbers: req.body.secondaryNumbers,
        primaryLanguage: req.body.primaryLanguage || 'hindi',
        focusArea: req.body.focusArea || 'wedding',
        teamSize: req.body.teamSize || 'solo',
        roomCount: req.body.roomCount ? parseInt(req.body.roomCount) : 0,
        roomTypesAndPricing: req.body.roomTypesAndPricing,
        banquetPackages: req.body.banquetPackages,
        amenities: req.body.amenities,
        checkInTime: req.body.checkInTime,
        checkOutTime: req.body.checkOutTime,
        cancellationPolicy: req.body.cancellationPolicy,
        faqs: req.body.faqs
      },
    });

    // 2. Handle File Uploads to Supabase Storage
    const files = req.files as Express.Multer.File[];
    let labels = req.body.labels || [];
    
    // Ensure labels is an array even if only one file was uploaded
    if (!Array.isArray(labels)) labels = [labels];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const label = labels[i] || 'Unlabeled Media';
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${hotel.id}/${Date.now()}-${i}.${fileExt}`;

        // Upload to Supabase bucket 'hotel-media'
        const { data, error } = await supabase.storage
          .from('hotel-media')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (data && !error) {
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('hotel-media')
            .getPublicUrl(fileName);

          // Save to Prisma HotelMedia table
          await prisma.hotelMedia.create({
            data: {
              hotelId: hotel.id,
              url: publicUrlData.publicUrl,
              label: label
            }
          });
        }
      }
    }

    res.status(201).json(hotel);
  } catch (error: any) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ error: 'Failed to create hotel', details: error.message });
  }
};

// ... keep getMyHotel as it is
export const getMyHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    const ownerId = auth.userId;

    if (!ownerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const hotel = await prisma.hotel.findUnique({
      where: { ownerId },
      include: { media: true } // Bring in the images too!
    });

    if (!hotel) {
      // Return 404 so the frontend knows they haven't onboarded
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

// Add this at the bottom of hotelController.ts
export const updateHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const auth = getAuth(req);
    const ownerId = auth.userId;

    if (!ownerId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const hotel = await prisma.hotel.findUnique({ where: { ownerId } });
    if (!hotel) {
      res.status(404).json({ error: 'Hotel not found' });
      return;
    }

    // 1. Update the text fields
    const updatedHotel = await prisma.hotel.update({
      where: { ownerId },
      data: {
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        googleMapsLink: req.body.googleMapsLink,
        whatsappNumber: req.body.whatsappNumber,
        secondaryNumbers: req.body.secondaryNumbers,
        primaryLanguage: req.body.primaryLanguage,
        focusArea: req.body.focusArea,
        teamSize: req.body.teamSize,
        roomCount: req.body.roomCount ? parseInt(req.body.roomCount) : undefined,
        roomTypesAndPricing: req.body.roomTypesAndPricing,
        banquetPackages: req.body.banquetPackages,
        amenities: req.body.amenities,
        checkInTime: req.body.checkInTime,
        checkOutTime: req.body.checkOutTime,
        cancellationPolicy: req.body.cancellationPolicy,
        faqs: req.body.faqs
      }
    });

    // 2. Handle ANY NEW files uploaded during the edit
    const files = req.files as Express.Multer.File[];
    let labels = req.body.labels || [];
    if (!Array.isArray(labels)) labels = [labels];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const label = labels[i] || 'Unlabeled Media';
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${hotel.id}/${Date.now()}-${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('hotel-media')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (data && !error) {
          const { data: publicUrlData } = supabase.storage
            .from('hotel-media')
            .getPublicUrl(fileName);

          await prisma.hotelMedia.create({
            data: { hotelId: hotel.id, url: publicUrlData.publicUrl, label }
          });
        }
      }
    }

    res.status(200).json(updatedHotel);
  } catch (error: any) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};