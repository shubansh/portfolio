import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes("your-project")
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface SiteProfile {
  avatar_url?: string;
  about_image_url?: string;
  name?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  youtube_url?: string;
  instagram_url?: string;
  github_url?: string;
  discord_url?: string;
  twitch_url?: string;
  twitter_url?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url?: string;
  link?: string;
  created_at?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  created_at?: string;
}

// Initial demo defaults
export const DEFAULT_PROFILE: SiteProfile = {
  avatar_url: "",
  about_image_url: "",
  name: "Shubhanshu Bilgaiyan",
  tagline: "Play. Create. Code. Repeat.",
  bio: "I'm a multi-disciplinary creator passionate about gaming, development, visual storytelling, and digital experiences. I turn ideas into interactive projects, cinematic edits, creative designs, and modern websites.",
  email: "shubansdoc@gmail.com",
  youtube_url: "https://youtube.com",
  instagram_url: "https://instagram.com",
  github_url: "https://github.com",
  discord_url: "https://discord.com",
  twitch_url: "",
  twitter_url: "",
};

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    title: "Cyber Protocol",
    category: "Game Development",
    description: "A fast-paced stealth action game with custom mechanics.",
    tags: ["Unity", "C#"],
    image_url: "",
    link: "#",
  },
  {
    id: "p2",
    title: "SPYKI Portfolio",
    category: "Web Development",
    description: "A premium, dark-themed personal portfolio website.",
    tags: ["Next.js", "Tailwind", "Supabase"],
    link: "#",
  },
  {
    id: "p3",
    title: "Valorant Frag Movie",
    category: "Video Editing",
    description: "Cinematic montage with heavy VFX and beat sync.",
    tags: ["Premiere Pro", "After Effects"],
    link: "#",
  },
  {
    id: "p4",
    title: "Esports Visual Identity",
    category: "Thumbnail Design",
    description: "Complete visual identity and YouTube graphics package.",
    tags: ["Photoshop", "Illustrator"],
    link: "#",
  },
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "The Ultimate Setup Tour",
    category: "Cinematic Edits",
    description: "Behind the scenes of my creative and gaming station.",
    video_url: "https://youtube.com",
  },
  {
    id: "v2",
    title: "Insane 1v5 Clutch Moments",
    category: "Gaming Highlights",
    description: "Competitive high-stakes gameplay montage.",
    video_url: "https://youtube.com",
  },
  {
    id: "v3",
    title: "How to Design Viral Thumbnails",
    category: "Tutorials",
    description: "Step-by-step masterclass on Photoshop composition.",
    video_url: "https://youtube.com",
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g1", title: "Cyber Neon Concept", category: "Artwork", image_url: "" },
  { id: "g2", title: "Ranked Victory Thumbnail", category: "Thumbnail", image_url: "" },
  { id: "g3", title: "Game Engine Shader Test", category: "Game Dev", image_url: "" },
  { id: "g4", title: "Stream Overlay Concept", category: "Branding", image_url: "" },
  { id: "g5", title: "Cinematic Color Grade Frame", category: "Video Editing", image_url: "" },
  { id: "g6", title: "Speedart Poster", category: "Artwork", image_url: "" },
];

// Local storage keys
const LS_PROFILE = "spyki_local_profile";
const LS_PROJECTS = "spyki_local_projects";
const LS_VIDEOS = "spyki_local_videos";
const LS_GALLERY = "spyki_local_gallery";

// Profile functions
export async function getProfile(): Promise<SiteProfile> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("site_profile")
      .select("*")
      .eq("id", "main")
      .single();
    if (!error && data) return { ...DEFAULT_PROFILE, ...data };
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(LS_PROFILE);
    if (local) {
      try {
        return { ...DEFAULT_PROFILE, ...JSON.parse(local) };
      } catch {}
    }
  }
  return DEFAULT_PROFILE;
}

export async function saveProfile(profile: Partial<SiteProfile>): Promise<SiteProfile> {
  const current = await getProfile();
  const updated: SiteProfile = { ...current, ...profile };

  if (isSupabaseConfigured() && supabase) {
    await supabase.from("site_profile").upsert({ id: "main", ...updated });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(LS_PROFILE, JSON.stringify(updated));
  }
  return updated;
}

// Project functions
export async function getProjects(): Promise<ProjectItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(LS_PROJECTS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }
  return DEFAULT_PROJECTS;
}

export async function saveProject(project: Omit<ProjectItem, "id"> & { id?: string }): Promise<ProjectItem> {
  const item: ProjectItem = {
    ...project,
    id: project.id || "proj_" + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from("projects").upsert(item).select().single();
    if (!error && data) return data;
  }

  if (typeof window !== "undefined") {
    const current = await getProjects();
    const updated = [item, ...current.filter((p) => p.id !== item.id)];
    localStorage.setItem(LS_PROJECTS, JSON.stringify(updated));
  }
  return item;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from("projects").delete().eq("id", id);
  }
  if (typeof window !== "undefined") {
    const current = await getProjects();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(LS_PROJECTS, JSON.stringify(updated));
  }
  return true;
}

// Video functions
export async function getVideos(): Promise<VideoItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(LS_VIDEOS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }
  return DEFAULT_VIDEOS;
}

export async function saveVideo(video: Omit<VideoItem, "id"> & { id?: string }): Promise<VideoItem> {
  const item: VideoItem = {
    ...video,
    id: video.id || "vid_" + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from("videos").upsert(item).select().single();
    if (!error && data) return data;
  }

  if (typeof window !== "undefined") {
    const current = await getVideos();
    const updated = [item, ...current.filter((v) => v.id !== item.id)];
    localStorage.setItem(LS_VIDEOS, JSON.stringify(updated));
  }
  return item;
}

export async function deleteVideo(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from("videos").delete().eq("id", id);
  }
  if (typeof window !== "undefined") {
    const current = await getVideos();
    const updated = current.filter((v) => v.id !== id);
    localStorage.setItem(LS_VIDEOS, JSON.stringify(updated));
  }
  return true;
}

// Gallery functions
export async function getGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data && data.length > 0) return data;
  }

  if (typeof window !== "undefined") {
    const local = localStorage.getItem(LS_GALLERY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }
  return DEFAULT_GALLERY;
}

export async function saveGalleryItem(gallery: Omit<GalleryItem, "id"> & { id?: string }): Promise<GalleryItem> {
  const item: GalleryItem = {
    ...gallery,
    id: gallery.id || "gal_" + Date.now(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from("gallery_items").upsert(item).select().single();
    if (!error && data) return data;
  }

  if (typeof window !== "undefined") {
    const current = await getGallery();
    const updated = [item, ...current.filter((g) => g.id !== item.id)];
    localStorage.setItem(LS_GALLERY, JSON.stringify(updated));
  }
  return item;
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    await supabase.from("gallery_items").delete().eq("id", id);
  }
  if (typeof window !== "undefined") {
    const current = await getGallery();
    const updated = current.filter((g) => g.id !== id);
    localStorage.setItem(LS_GALLERY, JSON.stringify(updated));
  }
  return true;
}

// Upload file to Supabase storage or return base64 Data URL
export async function uploadFile(file: File, folder = "uploads"): Promise<string> {
  if (isSupabaseConfigured() && supabase) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(fileName, file, { cacheControl: "3600", upsert: true });

    if (!error) {
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(fileName);
      return data.publicUrl;
    }
  }

  // Fallback: Convert to Base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
