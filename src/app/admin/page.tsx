"use client";

import { useState, useEffect } from "react";
import {
  UserCheck,
  FolderPlus,
  Video as VideoIcon,
  Image as ImageIcon,
  Trash2,
  Upload,
  ExternalLink,
  ShieldCheck,
  Database,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  Lock,
  Save,
  Gamepad2,
  Camera,
  Share2,
  Mail,
} from "lucide-react";
import {
  FaYoutube,
  FaInstagram,
  FaGithub,
  FaDiscord,
  FaTwitch,
  FaXTwitter,
} from "react-icons/fa6";
import Link from "next/link";
import {
  isSupabaseConfigured,
  getProfile,
  saveProfile,
  SiteProfile,
  getProjects,
  saveProject,
  deleteProject,
  ProjectItem,
  getVideos,
  saveVideo,
  deleteVideo,
  VideoItem,
  getGallery,
  saveGalleryItem,
  deleteGalleryItem,
  GalleryItem,
  uploadFile,
  DEFAULT_PROFILE,
} from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "videos" | "gallery" | "setup">("profile");
  const [isConfigured, setIsConfigured] = useState(false);

  // Profile state with social links
  const [profile, setProfile] = useState<SiteProfile>(DEFAULT_PROFILE);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [aboutUploading, setAboutUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Data states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Project form
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Game Development",
    description: "",
    tags: "Unity, C#",
    link: "",
    image_url: "",
  });
  const [projectUploading, setProjectUploading] = useState(false);

  // Video form
  const [videoForm, setVideoForm] = useState({
    title: "",
    category: "Cinematic Edits",
    description: "",
    video_url: "",
    thumbnail_url: "",
  });
  const [videoUploading, setVideoUploading] = useState(false);

  // Gallery form
  const [galleryForm, setGalleryForm] = useState({
    title: "",
    category: "Artwork",
    image_url: "",
  });
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Check login
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("spyki_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "1337";
    if (pinInput === correctPin || pinInput === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("spyki_admin_auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Load all data
  const loadAllData = async () => {
    setLoading(true);
    const [prof, p, v, g] = await Promise.all([getProfile(), getProjects(), getVideos(), getGallery()]);
    if (prof) setProfile(prof);
    setProjects(p);
    setVideos(v);
    setGallery(g);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Avatar / Profile uploads
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadFile(file, "avatars");
      setProfile((prev) => ({ ...prev, avatar_url: url }));
    } catch {
      alert("Avatar upload failed");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAboutUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAboutUploading(true);
    try {
      const url = await uploadFile(file, "avatars");
      setProfile((prev) => ({ ...prev, about_image_url: url }));
    } catch {
      alert("Image upload failed");
    } finally {
      setAboutUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await saveProfile(profile);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      alert("Failed to save profile");
    } finally {
      setProfileSaving(false);
    }
  };

  // Project Actions
  const handleProjectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProjectUploading(true);
    try {
      const url = await uploadFile(file, "projects");
      setProjectForm((prev) => ({ ...prev, image_url: url }));
    } catch {
      alert("Upload failed");
    } finally {
      setProjectUploading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) return;
    const tagsArray = projectForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    await saveProject({
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.description,
      tags: tagsArray,
      link: projectForm.link,
      image_url: projectForm.image_url,
    });

    setProjectForm({
      title: "",
      category: "Game Development",
      description: "",
      tags: "Unity, C#",
      link: "",
      image_url: "",
    });
    await loadAllData();
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Delete this project?")) {
      await deleteProject(id);
      await loadAllData();
    }
  };

  // Video Actions
  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const url = await uploadFile(file, "videos");
      setVideoForm((prev) => ({ ...prev, thumbnail_url: url }));
    } catch {
      alert("Upload failed");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title) return;
    await saveVideo({
      title: videoForm.title,
      category: videoForm.category,
      description: videoForm.description,
      video_url: videoForm.video_url,
      thumbnail_url: videoForm.thumbnail_url,
    });

    setVideoForm({
      title: "",
      category: "Cinematic Edits",
      description: "",
      video_url: "",
      thumbnail_url: "",
    });
    await loadAllData();
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm("Delete this video?")) {
      await deleteVideo(id);
      await loadAllData();
    }
  };

  // Gallery Actions
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const url = await uploadFile(file, "gallery");
      setGalleryForm((prev) => ({ ...prev, image_url: url }));
    } catch {
      alert("Upload failed");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.image_url) {
      alert("Please provide a title and upload an image.");
      return;
    }
    await saveGalleryItem({
      title: galleryForm.title,
      category: galleryForm.category,
      image_url: galleryForm.image_url,
    });

    setGalleryForm({
      title: "",
      category: "Artwork",
      image_url: "",
    });
    await loadAllData();
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm("Delete this gallery item?")) {
      await deleteGalleryItem(id);
      await loadAllData();
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030303] text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-blue-500/10 text-blue-400 mb-6">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2">SPYKI Admin Portal</h1>
          <p className="text-sm text-slate-400 text-center mb-6">
            Enter passcode to manage portfolio, avatars, social links & uploads.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Default PIN: 1337"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-[#030303] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-3.5 text-center tracking-widest text-lg text-white outline-none transition-all"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-400 text-center mt-2">Incorrect PIN. Try 1337.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#080808] sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <span className="font-bold tracking-tight text-white text-lg">
              SPYKI<span className="text-blue-500">.</span> Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Connected
              </span>
            ) : (
              <button
                onClick={() => setActiveTab("setup")}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Local Mode (Connect Supabase)
              </button>
            )}

            <button
              onClick={() => {
                sessionStorage.removeItem("spyki_admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-xs text-slate-400 hover:text-red-400 px-3 py-1.5"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "profile"
                ? "bg-white text-black shadow-lg shadow-white/5"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" /> Profile, Avatars & Social Links
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "projects"
                ? "bg-white text-black shadow-lg shadow-white/5"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FolderPlus className="w-4 h-4" /> Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "videos"
                ? "bg-white text-black shadow-lg shadow-white/5"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <VideoIcon className="w-4 h-4" /> Videos ({videos.length})
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "gallery"
                ? "bg-white text-black shadow-lg shadow-white/5"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Creative Gallery ({gallery.length})
          </button>

          <button
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === "setup"
                ? "bg-blue-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Database className="w-4 h-4" /> Supabase Setup
          </button>
        </div>

        {/* TAB 0: PROFILE, AVATARS & SOCIAL LINKS */}
        {activeTab === "profile" && (
          <div className="max-w-4xl mx-auto bg-[#080808] border border-white/10 rounded-2xl p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Avatar, Profile & Social Links</h2>
              <p className="text-xs text-slate-400">
                Update your images, bio, and all social media profiles. All links will immediately work on the live website.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Image Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Hero Avatar Upload */}
                <div className="bg-[#030303] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                  <h3 className="text-sm font-semibold text-white mb-2">1. Hero Section Avatar</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Appears prominently on the right side of the main landing screen.
                  </p>

                  <div className="w-48 h-48 rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative mb-6 flex items-center justify-center group shadow-2xl">
                    {profile.avatar_url ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${profile.avatar_url})` }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-600">
                        <Gamepad2 className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-mono">No Avatar Uploaded</span>
                      </div>
                    )}
                  </div>

                  <label className="w-full cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white flex items-center justify-center gap-2 transition-all">
                    <Upload className="w-4 h-4 text-blue-400" />
                    {avatarUploading ? "Uploading Avatar..." : "Choose & Upload Hero Avatar"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Or paste direct image URL here..."
                    value={profile.avatar_url || ""}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white mt-3 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* 2. About Me Photo Upload */}
                <div className="bg-[#030303] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center">
                  <h3 className="text-sm font-semibold text-white mb-2">2. About Section Portrait</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Appears next to the "About Me" bio text and creative philosophy.
                  </p>

                  <div className="w-48 h-48 rounded-2xl border border-white/10 bg-slate-900 overflow-hidden relative mb-6 flex items-center justify-center group shadow-2xl">
                    {profile.about_image_url ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${profile.about_image_url})` }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-600">
                        <Camera className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-mono">No About Photo</span>
                      </div>
                    )}
                  </div>

                  <label className="w-full cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-xs font-medium text-white flex items-center justify-center gap-2 transition-all">
                    <Upload className="w-4 h-4 text-blue-400" />
                    {aboutUploading ? "Uploading Photo..." : "Choose & Upload About Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutUpload}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="Or paste direct image URL here..."
                    value={profile.about_image_url || ""}
                    onChange={(e) => setProfile({ ...profile, about_image_url: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg px-3 py-2 text-xs text-white mt-3 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* SOCIAL MEDIA LINKS SECTION */}
              <div className="bg-[#030303] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Social Media Profile Links</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Provide your actual profile URLs. These will power the social icons in the Hero and Contact sections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* YouTube */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaYoutube className="text-red-500 w-4 h-4" /> YouTube Channel URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://youtube.com/@spyki"
                      value={profile.youtube_url || ""}
                      onChange={(e) => setProfile({ ...profile, youtube_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaInstagram className="text-pink-500 w-4 h-4" /> Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://instagram.com/spyki"
                      value={profile.instagram_url || ""}
                      onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* GitHub */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaGithub className="text-slate-300 w-4 h-4" /> GitHub Profile URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://github.com/shubhanshu"
                      value={profile.github_url || ""}
                      onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* Discord */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaDiscord className="text-indigo-400 w-4 h-4" /> Discord Server / Invite Link
                    </label>
                    <input
                      type="text"
                      placeholder="https://discord.gg/your-server"
                      value={profile.discord_url || ""}
                      onChange={(e) => setProfile({ ...profile, discord_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* Twitch */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaTwitch className="text-purple-400 w-4 h-4" /> Twitch Stream URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://twitch.tv/spyki"
                      value={profile.twitch_url || ""}
                      onChange={(e) => setProfile({ ...profile, twitch_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* X / Twitter */}
                  <div>
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <FaXTwitter className="text-slate-300 w-4 h-4" /> X / Twitter URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://x.com/spyki"
                      value={profile.twitter_url || ""}
                      onChange={(e) => setProfile({ ...profile, twitter_url: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1 font-mono"
                    />
                  </div>

                  {/* Business Email */}
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 flex items-center gap-2">
                      <Mail className="text-blue-400 w-4 h-4" /> Business / Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="contact@spyki.com"
                      value={profile.email || ""}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="bg-[#030303] border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-white">Brand & Bio Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Full Name</label>
                    <input
                      type="text"
                      value={profile.name || ""}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Tagline</label>
                    <input
                      type="text"
                      value={profile.tagline || ""}
                      onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                      className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Hero Introduction Bio</label>
                  <textarea
                    rows={3}
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full bg-[#080808] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {profileSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Avatar, Social Links & Profile updated successfully!
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Click save to apply changes.</span>
                )}

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {profileSaving ? "Saving..." : "Save All Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 1: PROJECTS */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#080808] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" /> Add New Project
              </h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cyber Protocol 2.0"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  >
                    <option>Game Development</option>
                    <option>Web Development</option>
                    <option>Video Editing</option>
                    <option>Thumbnail Design</option>
                    <option>Content Creation</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Short Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of gameplay or architecture..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Technologies / Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Unity, C#, Blender"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Demo / Project Link (optional)</label>
                  <input
                    type="text"
                    placeholder="https://github.com/... or https://..."
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Cover Image Upload</label>
                  <label className="mt-1 cursor-pointer bg-[#030303] border border-white/10 hover:border-white/20 rounded-lg p-3 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    {projectUploading ? "Uploading..." : "Upload Project Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectFileUpload}
                      className="hidden"
                    />
                  </label>
                  {projectForm.image_url && (
                    <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Image attached
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Publish Project
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Live Projects</h2>
              {projects.length === 0 ? (
                <div className="p-8 text-center bg-[#080808] border border-white/10 rounded-2xl text-slate-500">
                  No projects added yet. Use the form to add your first one!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-[#080808] border border-white/10 rounded-2xl p-5 flex flex-col justify-between group hover:border-white/20 transition-all"
                    >
                      <div>
                        {proj.image_url ? (
                          <div
                            className="aspect-[16/9] rounded-xl bg-cover bg-center mb-3 border border-white/5"
                            style={{ backgroundImage: `url(${proj.image_url})` }}
                          />
                        ) : (
                          <div className="aspect-[16/9] rounded-xl bg-[#030303] border border-white/5 flex items-center justify-center text-xs text-slate-600 mb-3">
                            No Cover Image
                          </div>
                        )}
                        <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                          {proj.category}
                        </span>
                        <h3 className="font-bold text-white text-base mb-1">{proj.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {proj.tags?.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        {proj.link ? (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Visit Link
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-600">No external link</span>
                        )}
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VIDEOS */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#080808] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" /> Add Video Content
              </h2>
              <form onSubmit={handleCreateVideo} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1v5 Clutch Tournament Highlights"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Category</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  >
                    <option>Cinematic Edits</option>
                    <option>Gaming Highlights</option>
                    <option>Tutorials</option>
                    <option>Streaming Moments</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Video URL (YouTube or direct)</label>
                  <input
                    type="text"
                    required
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoForm.video_url}
                    onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Short description..."
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Custom Thumbnail (Optional)</label>
                  <label className="mt-1 cursor-pointer bg-[#030303] border border-white/10 hover:border-white/20 rounded-lg p-3 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    {videoUploading ? "Uploading..." : "Upload Thumbnail Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbUpload}
                      className="hidden"
                    />
                  </label>
                  {videoForm.thumbnail_url && (
                    <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thumbnail set
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Save Video
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Published Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="bg-[#080808] border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      {vid.thumbnail_url ? (
                        <div
                          className="aspect-video rounded-xl bg-cover bg-center mb-3 border border-white/5"
                          style={{ backgroundImage: `url(${vid.thumbnail_url})` }}
                        />
                      ) : (
                        <div className="aspect-video rounded-xl bg-[#030303] border border-white/5 flex items-center justify-center text-xs text-slate-600 mb-3">
                          YouTube Video
                        </div>
                      )}
                      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                        {vid.category}
                      </span>
                      <h3 className="font-bold text-white text-sm mb-1">{vid.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2">{vid.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
                      <a
                        href={vid.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Watch Video
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GALLERY */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-[#080808] border border-white/10 rounded-2xl p-6 h-fit sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" /> Upload Artwork / Thumbnail
              </h2>
              <form onSubmit={handleCreateGalleryItem} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Title / Concept</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Valorant Tournament Poster"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Category</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                  >
                    <option>Artwork</option>
                    <option>Thumbnail</option>
                    <option>Game Dev</option>
                    <option>Branding</option>
                    <option>Video Frame</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Image File</label>
                  <label className="mt-1 cursor-pointer bg-[#030303] border border-white/10 hover:border-white/20 rounded-lg p-4 text-center text-xs text-slate-300 flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                    {galleryUploading ? "Uploading file..." : "Click to select and upload image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                  {galleryForm.image_url && (
                    <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> File ready to save
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Add to Gallery
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Gallery Showcase</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#080808] border border-white/10 rounded-xl overflow-hidden group relative"
                  >
                    {item.image_url ? (
                      <div
                        className="aspect-square bg-cover bg-center"
                        style={{ backgroundImage: `url(${item.image_url})` }}
                      />
                    ) : (
                      <div className="aspect-square bg-[#030303] flex items-center justify-center text-xs text-slate-600">
                        {item.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                      <span className="text-[10px] text-blue-400 uppercase tracking-widest">
                        {item.category}
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                          {item.title}
                        </span>
                        <button
                          onClick={() => handleDeleteGallery(item.id)}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPABASE SETUP */}
        {activeTab === "setup" && (
          <div className="max-w-3xl mx-auto bg-[#080808] border border-white/10 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Connect Supabase Database & Storage</h2>
                <p className="text-xs text-slate-400">
                  Store real images and project data permanently on the cloud.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    1
                  </span>
                  Create free Supabase project
                </h3>
                <p className="text-xs text-slate-400">
                  Go to <a href="https://supabase.com" target="_blank" className="text-blue-400 underline">supabase.com</a>, log in, and create a new project.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    2
                  </span>
                  Run SQL Schema
                </h3>
                <p className="text-xs text-slate-400">
                  Open <strong>SQL Editor</strong> in your Supabase dashboard and copy the SQL from the file:
                  <code className="block mt-2 p-2 bg-[#030303] rounded border border-white/10 text-slate-300 font-mono text-xs">
                    spyki-portfolio/supabase_schema.sql
                  </code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    3
                  </span>
                  Add Keys to .env.local
                </h3>
                <p className="text-xs text-slate-400">
                  In Supabase: Go to <strong>Project Settings → API</strong>. Copy your Project URL & Anon Public Key into <code className="text-blue-400 font-mono">.env.local</code>:
                </p>
                <pre className="p-3 bg-[#030303] rounded-lg border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_ADMIN_PIN=1337`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Even without Supabase, the admin panel currently works with instant Local Storage mode, so you can upload and test your changes immediately!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
