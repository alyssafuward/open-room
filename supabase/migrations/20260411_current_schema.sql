-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.gifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  room_id uuid,
  sender_name text NOT NULL,
  item_type text NOT NULL,
  is_collected boolean DEFAULT false,
  CONSTRAINT gifts_pkey PRIMARY KEY (id),
  CONSTRAINT gifts_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);
CREATE TABLE public.room_objects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  x integer NOT NULL,
  y integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  room_id uuid,
  CONSTRAINT room_objects_pkey PRIMARY KEY (id),
  CONSTRAINT room_objects_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id)
);
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_name text NOT NULL,
  owner_id text NOT NULL,
  grid_x integer,
  grid_y integer,
  email text,
  github_username text,
  dev_tool text,
  status text DEFAULT 'reserved'::text,
  reserved_at timestamp with time zone DEFAULT now(),
  registry_id text UNIQUE,
  CONSTRAINT rooms_pkey PRIMARY KEY (id)
);