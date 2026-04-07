<<<<<<< HEAD
# Shubhanshu Bilgaiyan - Premium Portfolio

A high-end, responsive, and dynamic portfolio built with React (Vite), Tailwind CSS v4, Framer Motion, and Supabase.

## Tech Stack
- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** Lucide React
- **Routing:** React Router DOM

## Setup Guide

Follow these steps to configure your environment and run the application.

### 1. Supabase Setup
1. Create a new project at [Supabase](https://supabase.com/).
2. Navigate to **Project Settings -> API**.
3. Copy your `Project URL` and `anon public` key.

### 2. Database Creation
In your Supabase Dashboard, go to the **SQL Editor** and run the following script:

```sql
-- Create Profile Table
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL DEFAULT 'Shubhanshu Bilgaiyan',
  roles TEXT[] DEFAULT ARRAY['Developer', 'Video Editor', 'Gamer', 'Streamer'],
  bio TEXT DEFAULT 'Passionate about building games, developing web apps, and creating engaging content.',
  resume_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  live_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Videos Table
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  video_url TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and setup Policies
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON profile FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON projects FOR SELECT USING (true);
CREATE POLICY "Public videos are viewable by everyone." ON videos FOR SELECT USING (true);

CREATE POLICY "Users can insert/update profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert/update projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert/update videos" ON videos FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Storage Setup
1. Go to **Storage** in your Supabase dashboard.
2. Create a new bucket named `portfolio-assets` (mark as Public).
3. Ensure public access is enabled so files and the resume can be securely downloaded or displayed.

### 4. Admin User Setup
1. Go to **Supabase Dashboard**.
2. Navigate to **Authentication -> Users**.
3. Click **"Add User"**.
4. Enter email and password.
5. Mark email as verified.

### 5. Local `.env` Setup
Create a `.env` file at the root of your project. Ensure you set your Admin email exactly as you created it in Supabase for security locking!
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

### 6. Run Project
Install dependencies and run the development server:
```bash
npm install
npm run dev
```

### 7. Deployment on Vercel
1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com/) and Import your GitHub repository.
3. Add the Environment Variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).
4. Click **Deploy**. Vercel will automatically detect Vite and run `npm run build`.

## Dynamic Content Rules
- Projects and Videos will only appear on the public portfolio if added via the `/admin` dashboard.
- The 'Download Resume' button will only render dynamically if you've populated the `resume_url` field in the Admin settings.
=======
# portfolio
>>>>>>> 22a94ac9b8834632de52400a27311831fcc37ed6
