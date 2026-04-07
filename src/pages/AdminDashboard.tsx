import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, User, FolderArchive, Video, Save, Plus, Trash2, X, Upload, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  // State for data
  const [profile, setProfile] = useState<any>({ name: '', bio: '', roles: [], resume_url: '' });
  const [projects, setProjects] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  
  // State for Actions/Modals
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  // Project Modals Data
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', live_url: '', github_url: '', tags: '', existing_image_url: '' });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);

  // Video Modals Data
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editVideoId, setEditVideoId] = useState<string | null>(null);
  const [newVideo, setNewVideo] = useState({ title: '', video_url: '', category: 'Gaming', existing_thumbnail_url: '' });
  const [videoThumbnailFile, setVideoThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        const allowedAdminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
        if (session.user.email !== allowedAdminEmail) {
          setAccessDenied(true);
          supabase.auth.signOut();
        } else {
          setSession(session);
          fetchData();
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const { data: pData } = await supabase.from('profile').select('*').single();
    if (pData) setProfile(pData);
    
    const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (projData) setProjects(projData);

    const { data: vidData } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (vidData) setVideos(vidData);
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Generic File Uploader pointing to portfolio-assets
  const uploadToStorage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const isPdf = fileExt?.toLowerCase() === 'pdf';
    const fileName = isPdf 
      ? `resume_${session.user.id}_${Date.now()}.${fileExt}`
      : `file_${session.user.id}_${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // PROFILE FUNCTIONS
  const handleProfileSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('profile').upsert({ id: session.user.id, ...profile, updated_at: new Date() });
    setSaving(false);
    if (error) alert("Error saving profile: " + error.message);
    else if (e) alert("Profile saved!");
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingResume(true);

    if (profile.resume_url) {
      try {
        const oldUrlParts = profile.resume_url.split('/');
        const oldFileName = oldUrlParts[oldUrlParts.length - 1];
        if (oldFileName) {
          await supabase.storage.from('portfolio-assets').remove([oldFileName]);
        }
      } catch (deleteErr) {
        console.warn("Warning: Failed to delete old resume, continuing with upload:", deleteErr);
      }
    }

    try {
      const publicUrl = await uploadToStorage(file);
      setProfile({ ...profile, resume_url: publicUrl });
      alert("Resume completely replaced! Click Save Profile to lock in the new URL.");
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  // PROJECT FUNCTIONS
  const openNewProjectModal = () => {
    setEditProjectId(null);
    setNewProject({ title: '', description: '', live_url: '', github_url: '', tags: '', existing_image_url: '' });
    setProjectImageFile(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: any) => {
    setEditProjectId(project.id);
    setNewProject({
      title: project.title,
      description: project.description || '',
      live_url: project.live_url || '',
      github_url: project.github_url || '',
      tags: project.tags ? project.tags.join(', ') : '',
      existing_image_url: project.image_url || ''
    });
    setProjectImageFile(null);
    setIsProjectModalOpen(true);
  };

  const handleAddProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let publicImageUrl = newProject.existing_image_url;
      if (projectImageFile) {
        publicImageUrl = await uploadToStorage(projectImageFile);
      }

      if (!publicImageUrl && !editProjectId) {
         throw new Error("Project Feature Image is strictly required!");
      }

      const tagsArray = newProject.tags.split(',').map(t => t.trim()).filter(Boolean);

      const projectData = {
        title: newProject.title,
        description: newProject.description,
        live_url: newProject.live_url,
        github_url: newProject.github_url,
        tags: tagsArray,
        image_url: publicImageUrl
      };

      if (editProjectId) {
        // Update existing
        const { data, error } = await supabase.from('projects').update(projectData).eq('id', editProjectId).select();
        if (error) throw error;
        if (data) {
          setProjects(projects.map(p => p.id === editProjectId ? data[0] : p));
          alert("Project updated successfully!");
        }
      } else {
        // Insert new
        const { data, error } = await supabase.from('projects').insert([projectData]).select();
        if (error) throw error;
        if (data) {
          setProjects([data[0], ...projects]);
          alert("Project added successfully!");
        }
      }

      setIsProjectModalOpen(false);
      setProjectImageFile(null);
    } catch (err: any) {
      alert("Error saving project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };


  // VIDEO FUNCTIONS
  const openNewVideoModal = () => {
    setEditVideoId(null);
    setNewVideo({ title: '', video_url: '', category: 'Gaming', existing_thumbnail_url: '' });
    setVideoThumbnailFile(null);
    setIsVideoModalOpen(true);
  };

  const openEditVideoModal = (video: any) => {
    setEditVideoId(video.id);
    setNewVideo({
      title: video.title,
      video_url: video.video_url || '',
      category: video.category || 'Gaming',
      existing_thumbnail_url: video.thumbnail_url || ''
    });
    setVideoThumbnailFile(null);
    setIsVideoModalOpen(true);
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let publicImageUrl = newVideo.existing_thumbnail_url;
      if (videoThumbnailFile) {
        publicImageUrl = await uploadToStorage(videoThumbnailFile);
      }

      if (!publicImageUrl && !editVideoId) {
         throw new Error("Video Thumbnail Image is absolutely required!");
      }

      const videoData = {
        title: newVideo.title,
        video_url: newVideo.video_url,
        category: newVideo.category,
        thumbnail_url: publicImageUrl
      };

      if (editVideoId) {
        // Update existing
        const { data, error } = await supabase.from('videos').update(videoData).eq('id', editVideoId).select();
        if (error) throw error;
        if (data) {
          setVideos(videos.map(v => v.id === editVideoId ? data[0] : v));
          alert("Video updated successfully!");
        }
      } else {
        // Insert new
        const { data, error } = await supabase.from('videos').insert([videoData]).select();
        if (error) throw error;
        if (data) {
          setVideos([data[0], ...videos]);
          alert("Video added successfully!");
        }
      }

      setIsVideoModalOpen(false);
      setVideoThumbnailFile(null);
    } catch (err: any) {
      alert("Error saving video: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    await supabase.from('videos').delete().eq('id', id);
    setVideos(videos.filter(v => v.id !== id));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Data...</div>;

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary-dark)] text-white p-4">
        <div className="glass-panel p-10 text-center max-w-md w-full border border-red-500/30">
          <h1 className="text-4xl font-black text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You do not have the required permissions to access this CMS.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 w-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold">
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <span className="text-gradient">Admin Dashboard</span>
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-[var(--color-neon-blue)]/20 text-[var(--color-neon-blue)] border border-[var(--color-neon-blue)]/50' : 'bg-white/5 hover:bg-white/10'}`}>
            <User size={20} /> Profile & Resume
          </button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-[var(--color-neon-purple)]/20 text-[var(--color-neon-purple)] border border-[var(--color-neon-purple)]/50' : 'bg-white/5 hover:bg-white/10'}`}>
            <FolderArchive size={20} /> Manage Projects
          </button>
          <button onClick={() => setActiveTab('videos')} className={`flex items-center gap-3 p-4 rounded-lg transition-colors ${activeTab === 'videos' ? 'bg-pink-500/20 text-pink-500 border border-pink-500/50' : 'bg-white/5 hover:bg-white/10'}`}>
            <Video size={20} /> Manage Videos
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-6 md:p-8">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              <div>
                <label className="block text-gray-400 mb-2">Display Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Roles (comma separated)</label>
                <input type="text" value={profile.roles?.join(', ')} onChange={e => setProfile({ ...profile, roles: e.target.value.split(',').map(r => r.trim()) })} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Bio</label>
                <textarea rows={4} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white"></textarea>
              </div>
              
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <label className="block text-white font-bold mb-4">Resume Upload (PDF)</label>
                
                {profile.resume_url && (
                  <div className="mb-4 text-sm bg-[var(--color-neon-blue)]/10 text-[var(--color-neon-blue)] p-4 rounded flex items-center justify-between border border-[var(--color-neon-blue)]/30">
                    <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="font-bold text-white">Current File:</span>
                      <span className="truncate max-w-[200px] md:max-w-xs">{profile.resume_url.split('/').pop()}</span>
                    </div>
                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-[var(--color-neon-blue)]/20 hover:bg-[var(--color-neon-blue)] hover:text-black rounded font-bold transition-colors">
                      Preview Resume
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className={`flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors ${uploadingResume ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload size={18} />
                    <span>{uploadingResume ? 'Uploading...' : (profile.resume_url ? 'Replace Resume' : 'Upload New Resume')}</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploadingResume} />
                  </label>
                </div>
              </div>

              <button disabled={saving} type="submit" className="flex items-center gap-2 px-6 py-3 bg-[var(--color-neon-blue)] text-black font-bold rounded hover:opacity-90 transition-all">
                <Save size={20} /> {saving ? 'Saving...' : 'Save Profile Dashboard'}
              </button>
            </form>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Projects Library</h2>
                <button onClick={openNewProjectModal} className="flex items-center gap-2 px-4 py-2 bg-[var(--color-neon-purple)] text-white font-bold rounded hover:shadow-[0_0_15px_var(--color-neon-purple)] transition-all">
                  <Plus size={18} /> Add Project
                </button>
              </div>
              <div className="space-y-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-black/30 border border-white/10 rounded-lg p-6 flex gap-6 items-start relative group transition-all">
                    {project.image_url && <img src={project.image_url} alt="ProjectImg" className="w-32 h-24 object-cover rounded-md border border-white/10 hidden md:block" />}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        {project.title}
                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Views: {project.views || 0}</span>
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {project.tags && project.tags.map((tag: string, i: number) => <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded">{tag}</span>)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <button onClick={() => openEditProjectModal(project)} className="p-2 text-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/20 rounded-full transition-colors flex items-center justify-center">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => deleteProject(project.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors flex items-center justify-center">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-gray-500 text-center py-10">No projects added yet.</p>}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Videos</h2>
                <button onClick={openNewVideoModal} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white font-bold rounded hover:shadow-[0_0_15px_#ec4899] transition-all">
                  <Plus size={18} /> Add Video
                </button>
              </div>
              <div className="space-y-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-black/30 border border-white/10 rounded-lg p-6 flex items-start gap-6 relative group transition-all">
                    {video.thumbnail_url && <img src={video.thumbnail_url} alt="Thumbnail" className="w-40 h-24 object-cover rounded-md border border-white/10 hidden md:block" />}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-white">{video.title}</h3>
                         <span className="text-xs font-bold px-3 py-1 bg-pink-500/10 text-pink-500 border border-pink-500/30 rounded-full uppercase tracking-wider">{video.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate max-w-xs md:max-w-md">{video.video_url}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => openEditVideoModal(video)} className="p-2 text-pink-500 hover:bg-pink-500/20 rounded-full transition-colors flex items-center justify-center">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => deleteVideo(video.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors flex items-center justify-center">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && <p className="text-gray-500 text-center py-10">No videos added yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW FEATURE: ADD/EDIT PROJECT MODAL */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[var(--color-primary-dark)] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(176,38,255,0.15)]"
            >
              <div className="sticky top-0 bg-[var(--color-primary-dark)] border-b border-white/10 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-white">{editProjectId ? 'Edit Project' : 'Add New Project'}</h2>
                <button onClick={() => setIsProjectModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddProjectSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Project Title *</label>
                  <input required type="text" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:ring-2 focus:ring-[var(--color-neon-purple)] focus:outline-none" />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-2">Description *</label>
                  <textarea required rows={4} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:ring-2 focus:ring-[var(--color-neon-purple)] focus:outline-none"></textarea>
                </div>

                <div className="bg-white/5 border border-white/10 rounded p-4">
                  <label className="block text-gray-300 font-bold mb-2 flex items-center justify-between">
                    Project Image Upload {editProjectId ? '(Optional if keeping old)' : '*'}
                    {newProject.existing_image_url && <span className="text-xs text-[var(--color-neon-purple)]">Has existing image</span>}
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-sm">
                      <Upload size={16} /> Select New Image
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files && e.target.files.length>0) setProjectImageFile(e.target.files[0]) } } />
                    </label>
                    <span className="text-sm text-gray-300">{projectImageFile ? projectImageFile.name : "No file chosen"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Live Demo URL</label>
                    <input type="text" value={newProject.live_url} onChange={e => setNewProject({...newProject, live_url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm focus:ring-2 focus:ring-[var(--color-neon-purple)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">GitHub URL</label>
                    <input type="text" value={newProject.github_url} onChange={e => setNewProject({...newProject, github_url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm focus:ring-2 focus:ring-[var(--color-neon-purple)] focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Tags (Comma Separated e.g. Game, Web, Design)</label>
                  <input type="text" value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:ring-2 focus:ring-[var(--color-neon-purple)] focus:outline-none" />
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-6 py-2 text-gray-300 hover:text-white mt-4">Cancel</button>
                  <button type="submit" disabled={saving} className="mt-4 px-6 py-2 bg-[var(--color-neon-purple)] text-white font-bold rounded hover:shadow-[0_0_20px_var(--color-neon-purple)] disabled:opacity-50 flex items-center gap-2 transition-all">
                    {saving ? 'Saving Project...' : (editProjectId ? 'Update Project' : 'Save Project')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW FEATURE: ADD/EDIT VIDEO MODAL */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[var(--color-primary-dark)] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(236,72,153,0.15)]"
            >
              <div className="sticky top-0 bg-[var(--color-primary-dark)] border-b border-white/10 p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-white">{editVideoId ? 'Edit Video' : 'Add New Video'}</h2>
                <button onClick={() => setIsVideoModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleAddVideoSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Video Title *</label>
                  <input required type="text" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Video Source URL (YouTube/Direct) *</label>
                    <input required type="text" value={newVideo.video_url} onChange={e => setNewVideo({...newVideo, video_url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Category *</label>
                    <select value={newVideo.category} onChange={e => setNewVideo({...newVideo, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:ring-2 focus:ring-pink-500 focus:outline-none">
                      <option value="Gaming">Gaming</option>
                      <option value="Editing">Editing</option>
                      <option value="Streaming">Streaming</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded p-4">
                  <label className="block text-gray-300 font-bold mb-2 flex items-center justify-between">
                    Video Thumbnail Upload {editVideoId ? '(Optional if keeping old)' : '*'}
                    {newVideo.existing_thumbnail_url && <span className="text-xs text-pink-500">Has existing thumbnail</span>}
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-sm">
                      <Upload size={16} /> Select Thumbnail
                      <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files && e.target.files.length>0) setVideoThumbnailFile(e.target.files[0]) } } />
                    </label>
                    <span className="text-sm text-gray-300">{videoThumbnailFile ? videoThumbnailFile.name : "No file chosen"}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-6 py-2 text-gray-300 hover:text-white mt-4">Cancel</button>
                  <button type="submit" disabled={saving} className="mt-4 px-6 py-2 bg-pink-500 text-white font-bold rounded hover:shadow-[0_0_20px_#ec4899] disabled:opacity-50 flex items-center gap-2 transition-all">
                    {saving ? 'Saving Video...' : (editVideoId ? 'Update Video' : 'Save Video')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
