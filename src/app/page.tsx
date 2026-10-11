"use client";

import { motion } from "framer-motion";
import { 
  Mail, Gamepad2, Video, 
  Monitor, Code, Image as ImageIcon, Send, ExternalLink, 
  Menu, X, Play, PenTool, Layout, Camera
} from "lucide-react";
import { 
  FaGithub, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaDiscord,
  FaTwitch,
  FaXTwitter 
} from "react-icons/fa6";
import { useState, useEffect } from "react";
import {
  getProfile,
  getProjects,
  getVideos,
  getGallery,
  SiteProfile,
  ProjectItem,
  VideoItem,
  GalleryItem,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_VIDEOS,
  DEFAULT_GALLERY,
} from "@/lib/supabase";

// Reusable Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Content from Supabase / Admin
  const [profile, setProfile] = useState<SiteProfile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    projectType: "Web Development",
    message: "",
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch dynamic content
    const loadContent = async () => {
      try {
        const [prof, p, v, g] = await Promise.all([getProfile(), getProjects(), getVideos(), getGallery()]);
        if (prof) setProfile(prof);
        if (p?.length) setProjects(p);
        if (v?.length) setVideos(v);
        if (g?.length) setGallery(g);
      } catch (err) {
        console.error("Failed to load portfolio items:", err);
      }
    };
    loadContent();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Home", "About", "Skills", "Projects", "Videos", "Gallery", "Contact"];

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 selection:bg-blue-500/30 font-sans">
      
      {/* NAVBAR */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/5 ${isScrolled ? "bg-[#030303]/80 backdrop-blur-md py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold tracking-tighter text-white">SPYKI<span className="text-blue-500">.</span></a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
            <a href="#contact" className="px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
              Let's Talk
            </a>
          </nav>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030303] flex flex-col items-center justify-center gap-8 md:hidden">
          <button className="absolute top-6 right-6 text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-medium text-slate-300 hover:text-white">
              {link}
            </a>
          ))}
        </div>
      )}

      <main>
        {/* HERO SECTION */}
        <section id="home" className="pt-40 pb-20 md:pt-48 md:pb-32 container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center gap-12">
          <motion.div 
            className="flex-1 flex flex-col gap-6"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeUp}>
              <p className="text-blue-500 font-medium tracking-wide text-sm md:text-base uppercase mb-2">
                {profile.name || "Shubhanshu Bilgaiyan"}
              </p>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4">
                SPYKI
              </h1>
              <h2 className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed">
                Game Developer · Video Editor · Gamer / Streamer · Web Developer · Thumbnail Designer · Content Creator
              </h2>
            </motion.div>
            
            <motion.p variants={fadeUp} className="text-slate-400 max-w-xl leading-relaxed text-lg border-l-2 border-white/10 pl-4 my-2">
              "{profile.bio || "I'm a multi-disciplinary creator passionate about gaming, development, visual storytelling, and digital experiences. I turn ideas into interactive projects, cinematic edits, creative designs, and modern websites."}"
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 pt-4">
              <a href="#projects" className="px-8 py-3 rounded-full bg-white text-black hover:bg-slate-200 font-medium transition-all">
                View My Work
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white font-medium transition-all">
                Contact Me
              </a>
            </motion.div>

            {/* REAL SOCIAL LINKS */}
            <motion.div variants={fadeUp} className="flex items-center gap-5 pt-8 text-slate-400">
              {profile.youtube_url && (
                <a
                  href={profile.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  title="YouTube"
                  className="hover:text-red-500 transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaYoutube className="w-5 h-5" />
                </a>
              )}
              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram"
                  className="hover:text-pink-500 transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  title="GitHub"
                  className="hover:text-white transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {profile.discord_url && (
                <a
                  href={profile.discord_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Discord"
                  className="hover:text-indigo-400 transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaDiscord className="w-5 h-5" />
                </a>
              )}
              {profile.twitch_url && (
                <a
                  href={profile.twitch_url}
                  target="_blank"
                  rel="noreferrer"
                  title="Twitch"
                  className="hover:text-purple-400 transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaTwitch className="w-5 h-5" />
                </a>
              )}
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  title="X / Twitter"
                  className="hover:text-white transition-colors p-1 hover:scale-110 duration-200"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </motion.div>
          
          {/* Avatar Display */}
          <motion.div 
            className="flex-1 w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="aspect-[4/5] md:aspect-square rounded-3xl border border-white/10 bg-gradient-to-tr from-slate-900 to-[#080808] p-2 relative overflow-hidden flex items-center justify-center group shadow-2xl">
               <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
               
               {profile.avatar_url ? (
                 <div
                   className="relative w-full h-full rounded-2xl overflow-hidden bg-cover bg-center border border-white/10 transition-transform duration-700 group-hover:scale-105"
                   style={{ backgroundImage: `url(${profile.avatar_url})` }}
                 />
               ) : (
                 <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#030303] border border-white/5 flex flex-col items-center justify-center text-center p-6">
                   <Gamepad2 className="w-20 h-20 text-slate-800 mb-3" />
                   <span className="text-slate-500 text-xs tracking-widest uppercase font-mono">Avatar Placeholder</span>
                 </div>
               )}
            </div>
          </motion.div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 bg-[#080808] border-y border-white/5">
          <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="flex-1 w-full relative"
            >
              <div className="aspect-[4/5] bg-[#050505] rounded-3xl border border-white/10 overflow-hidden relative group shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                {profile.about_image_url ? (
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${profile.about_image_url})` }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                    <Camera className="w-12 h-12 opacity-50 mb-2" />
                    <span className="text-xs font-mono">About Photo</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
              className="flex-1 flex flex-col gap-6"
            >
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white">About Me</motion.h2>
              <motion.div variants={fadeUp} className="w-12 h-1 bg-white/20 rounded-full"></motion.div>
              <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed text-lg">
                "I'm Shubhanshu Bilgaiyan, the creator behind SPYKI. I enjoy exploring game development, programming, video editing, graphic design, and content creation. My goal is to keep learning, build meaningful digital experiences, and develop a recognizable creative brand."
              </motion.p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {[
                  { title: "Creative Thinker", icon: <PenTool className="w-5 h-5 text-slate-300" /> },
                  { title: "Always Learning", icon: <Code className="w-5 h-5 text-slate-300" /> },
                  { title: "Gamer at Heart", icon: <Gamepad2 className="w-5 h-5 text-slate-300" /> }
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3 items-start">
                    {item.icon}
                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="py-24 container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Skills & Expertise</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The six core roles that define my creative and technical journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Game Developer", icon: <Gamepad2 className="w-6 h-6" />, desc: "Game mechanics, prototyping, and gameplay systems.", tools: "Unity / Unreal Engine" },
              { title: "Video Editor", icon: <Video className="w-6 h-6" />, desc: "Cinematic edits, gaming highlights, and short-form videos.", tools: "Premiere Pro, DaVinci" },
              { title: "Gamer / Streamer", icon: <Monitor className="w-6 h-6" />, desc: "Gameplay, live-stream content, and community engagement.", tools: "OBS Studio, Twitch" },
              { title: "Web Developer", icon: <Layout className="w-6 h-6" />, desc: "Responsive UI development and modern frontend architectures.", tools: "React, Next.js, Tailwind" },
              { title: "Thumbnail Designer", icon: <ImageIcon className="w-6 h-6" />, desc: "Gaming thumbnails, typography, and precise color grading.", tools: "Photoshop, Figma" },
              { title: "Content Creator", icon: <Camera className="w-6 h-6" />, desc: "YouTube videos, Reels, storytelling, and personal branding.", tools: "YouTube, Social Media" }
            ].map((skill, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 text-white flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                  {skill.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{skill.title}</h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed">{skill.desc}</p>
                <div className="text-xs font-mono text-slate-500 bg-white/5 px-3 py-1.5 rounded inline-block border border-white/5">{skill.tools}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-24 bg-[#080808] border-y border-white/5">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
              <p className="text-slate-400">A selection of my best work across development and design.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group rounded-2xl overflow-hidden bg-[#030303] border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] bg-[#0a0a0a] border-b border-white/5 relative overflow-hidden">
                    {item.image_url ? (
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url(${item.image_url})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-sm uppercase tracking-widest">{item.title} Preview</div>
                    )}
                    {item.link && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <a href={item.link} target="_blank" rel="noreferrer" className="p-4 bg-white/10 rounded-full backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-medium text-blue-400 mb-2 block uppercase tracking-wider">{item.category}</span>
                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags?.map(tag => (
                        <span key={tag} className="text-xs px-3 py-1.5 bg-white/5 rounded-md text-slate-300 border border-white/5">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* VIDEOS SECTION */}
        <section id="videos" className="py-24 container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Video Content</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Gaming highlights, cinematic edits, and tutorials.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((item, i) => (
              <motion.div 
                key={item.id || i}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group"
              >
                <a
                  href={item.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-video bg-[#080808] rounded-xl border border-white/10 mb-4 relative overflow-hidden cursor-pointer group-hover:border-white/30 transition-colors duration-300"
                >
                  {item.thumbnail_url ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.thumbnail_url})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-700 text-sm">Video Preview</div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black pl-1 shadow-lg shadow-white/10">
                      <Play className="w-5 h-5" />
                    </div>
                  </div>
                </a>
                <h4 className="text-white font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.category}</p>
              </motion.div>
            ))}
          </div>
          
          {profile.youtube_url && (
            <div className="mt-12 text-center">
              <a
                href={profile.youtube_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium"
              >
                Watch More on YouTube <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-24 bg-[#080808] border-y border-white/5">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Creative Gallery</h2>
              <p className="text-slate-400">Thumbnails, artwork, frames, and design experiments.</p>
            </div>
            
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {gallery.map((item, i) => (
                <motion.div 
                  key={item.id || i}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="bg-[#030303] rounded-xl overflow-hidden border border-white/5 relative group break-inside-avoid"
                  style={{ minHeight: '220px' }}
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-auto object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-60 flex items-center justify-center text-slate-700 text-sm">
                      {item.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-blue-400 text-xs font-mono mb-1">{item.category}</span>
                    <span className="text-white font-medium text-sm">{item.title}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Create Together.</h2>
              <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                Open for freelance work, collaborations, and creative projects. Drop a message below and I'll get back to you as soon as possible.
              </p>
              <div className="space-y-6">
                <a
                  href={`mailto:${(profile.email && profile.email !== "contact@spyki.com") ? profile.email : "shubansdoc@gmail.com"}`}
                  className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">
                    {(profile.email && profile.email !== "contact@spyki.com") ? profile.email : "shubansdoc@gmail.com"}
                  </span>
                </a>

                {profile.youtube_url && (
                  <a
                    href={profile.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center">
                      <FaYoutube className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-medium">
                      {profile.youtube_url.replace("https://", "").replace("www.", "")}
                    </span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex-1 bg-[#080808] p-8 rounded-3xl border border-white/5">
              <form 
                className="flex flex-col gap-6" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetEmail = (profile.email && profile.email !== "contact@spyki.com") ? profile.email : "shubansdoc@gmail.com";
                  const subject = encodeURIComponent(`Project Inquiry: ${contactForm.projectType} from ${contactForm.name}`);
                  const body = encodeURIComponent(
                    `Hi SPYKI,\n\nName: ${contactForm.name}\nEmail: ${contactForm.email}\nProject Type: ${contactForm.projectType}\n\nMessage:\n${contactForm.message}`
                  );
                  window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
                  setSentSuccess(true);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-400">Name</label>
                    <input 
                      required 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="bg-[#030303] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-400">Email</label>
                    <input 
                      required 
                      type="email" 
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="bg-[#030303] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Project Type</label>
                  <select 
                    value={contactForm.projectType}
                    onChange={(e) => setContactForm({ ...contactForm, projectType: e.target.value })}
                    className="bg-[#030303] border border-white/10 rounded-xl px-4 py-3.5 text-slate-300 focus:outline-none focus:border-white/30 transition-colors appearance-none"
                  >
                    <option>Web Development</option>
                    <option>Video Editing</option>
                    <option>Thumbnail Design</option>
                    <option>Game Dev Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="bg-[#030303] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" 
                    placeholder="Tell me about your project..."
                  />
                </div>
                {sentSuccess && (
                  <p className="text-xs text-emerald-400 text-center">Opening your email app to send message directly to shubansdoc@gmail.com...</p>
                )}
                <button type="submit" className="mt-2 w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-[#030303]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold tracking-tighter text-white">SPYKI<span className="text-blue-500">.</span></h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase">Play. Create. Code. Repeat.</p>
          <div className="flex gap-6 mt-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm">Home</a>
            <a href="#about" className="text-slate-500 hover:text-white transition-colors text-sm">About</a>
            <a href="#projects" className="text-slate-500 hover:text-white transition-colors text-sm">Projects</a>
            <a href="#contact" className="text-slate-500 hover:text-white transition-colors text-sm">Contact</a>
          </div>
          <p className="text-slate-600 text-xs mt-6">&copy; 2026 SPYKI ({profile.name || "Shubhanshu Bilgaiyan"}). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
