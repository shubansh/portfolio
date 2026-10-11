-- ========================================================
-- SPYKI Portfolio - Supabase Database Schema & Storage
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 0. Create Site Profile & Avatars Table
create table if not exists public.site_profile (
  id text primary key default 'main',
  name text default 'Shubhanshu Bilgaiyan',
  tagline text default 'Play. Create. Code. Repeat.',
  bio text default '',
  email text default 'contact@spyki.com',
  avatar_url text default '',
  about_image_url text default '',
  youtube_url text default 'https://youtube.com',
  instagram_url text default 'https://instagram.com',
  github_url text default 'https://github.com',
  discord_url text default 'https://discord.com',
  twitch_url text default '',
  twitter_url text default '',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 1. Create Projects Table
create table if not exists public.projects (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  tags text[] default '{}',
  image_url text default '',
  link text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Videos Table
create table if not exists public.videos (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  video_url text not null,
  thumbnail_url text default '',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Gallery Items Table
create table if not exists public.gallery_items (
  id text primary key,
  title text not null,
  category text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.videos enable row level security;
alter table public.gallery_items enable row level security;

-- 5. Open Read and Write policies for Portfolio Admin
create policy "Allow Public Read Profile" on public.site_profile for select using (true);
create policy "Allow Public Insert/Update Profile" on public.site_profile for all using (true);

create policy "Allow Public Read Projects" on public.projects for select using (true);
create policy "Allow Public Insert/Update Projects" on public.projects for all using (true);

create policy "Allow Public Read Videos" on public.videos for select using (true);
create policy "Allow Public Insert/Update Videos" on public.videos for all using (true);

create policy "Allow Public Read Gallery" on public.gallery_items for select using (true);
create policy "Allow Public Insert/Update Gallery" on public.gallery_items for all using (true);

-- 6. Storage Bucket for Portfolio Assets
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Public Access to portfolio-assets" on storage.objects 
  for select using (bucket_id = 'portfolio-assets');

create policy "Allow Upload to portfolio-assets" on storage.objects 
  for insert with check (bucket_id = 'portfolio-assets');

create policy "Allow Update/Delete on portfolio-assets" on storage.objects 
  for all using (bucket_id = 'portfolio-assets');
