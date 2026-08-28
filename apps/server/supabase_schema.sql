CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE hotels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  rating NUMERIC,
  capacity_hall INTEGER,
  available_rooms INTEGER,
  contact_phone TEXT,
  context TEXT -- Special features, pricing, etc.
);

CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  status TEXT DEFAULT 'NEW' NOT NULL,
  wants_human BOOLEAN DEFAULT FALSE NOT NULL,
  followup_level INTEGER DEFAULT 0 NOT NULL,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  -- Captured Preferences
  location_preference TEXT,
  guest_count INTEGER,
  room_count INTEGER,
  purpose TEXT,
  selected_hotel_id UUID REFERENCES hotels(id)
);

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'USER' or 'AI'
  message_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);