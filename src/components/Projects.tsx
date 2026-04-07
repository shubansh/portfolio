import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code2, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  tags?: string[];
  views?: number;
}

interface ProjectsProps {
  items: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<Project[]>(initialItems);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (!items || items.length === 0) return null;

  // Extract all unique tags for the filter menu
  const allTags = new Set<string>();
  items.forEach(p => p.tags?.forEach(tag => allTags.add(tag)));
  const categories = ['All', ...Array.from(allTags)];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(p => p.tags && p.tags.includes(filter));

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);

    // Optimistically update view count locally
    const updatedItems = items.map(p => 
      p.id === project.id ? { ...p, views: (p.views || 0) + 1 } : p
    );
    setItems(updatedItems);
    
    // Also update the selected instance for the modal display
    setSelectedProject({ ...project, views: (project.views || 0) + 1 });

    // Trigger Supabase RPC view incrementer in the background
    try {
      await supabase.rpc('increment_project_views', { project_id: project.id });
    } catch (err) {
      console.warn("View increment failed:", err);
    }
  };

  return (
    <section id="projects" className="py-24 relative z-10 bg-[var(--color-primary-dark)] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Featured <span className="text-gradient hover:drop-shadow-[0_0_15px_var(--color-neon-blue)] transition-all">Projects</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-neon-blue)] to-transparent rounded-full mb-6 mx-auto" />
          <p className="text-[var(--color-text-muted)] max-w-2xl text-lg mb-10">
            A comprehensive look at my latest work across game development, web applications, and creative design.
          </p>

          {/* Category Filter Menu */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-[var(--color-neon-blue)] text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((project, index) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                onClick={() => handleProjectClick(project)}
                className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[var(--color-neon-blue)]/50 transition-all duration-500 bg-white/5 cursor-pointer shadow-lg hover:shadow-[0_15px_40px_rgba(0,240,255,0.15)]"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-colors duration-500 z-10 pointer-events-none" />
                  <img 
                    src={project.image_url || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80`} 
                    alt={project.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  
                  {/* Overlay Tags */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                    {project.tags && project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Counter Badge */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-[var(--color-neon-blue)]/50 rounded-full text-xs font-bold text-[var(--color-neon-blue)] shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                  >
                    <Eye size={14} />
                    <span>{project.views || 0}</span>
                  </motion.div>
                </div>

                {/* Card Body */}
                <div className="p-6 relative z-20 border-t border-white/10 transition-colors duration-500 group-hover:bg-[var(--color-neon-blue)]/5">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[var(--color-neon-blue)] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-2 text-sm leading-relaxed block">
                    {project.description}
                  </p>
                </div>
                
                {/* Glow strictly limited to the card */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[0_0_30px_rgba(0,240,255,0.1)_inset]" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No projects found for this category.
          </div>
        )}
      </div>

      {/* PROJECT DETAIL MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[var(--color-primary-dark)] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] border border-[var(--color-neon-blue)]/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-[var(--color-neon-blue)] hover:text-black text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>
              
              <div className="w-full h-64 md:h-96 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)] to-transparent z-10" />
                <img 
                  src={selectedProject.image_url} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="p-8 md:p-12 relative z-20 -mt-20">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProject.tags && selectedProject.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 bg-[var(--color-neon-blue)]/10 border border-[var(--color-neon-blue)]/30 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--color-neon-blue)] drop-shadow-md">
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1 flex items-center gap-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-xs font-bold text-pink-500">
                    <Eye size={14} /> {selectedProject.views || 0} Views
                  </span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-lg">{selectedProject.title}</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-10 whitespace-pre-wrap">
                  {selectedProject.description}
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  {selectedProject.live_url && (
                    <a 
                      href={selectedProject.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-[var(--color-neon-blue)] text-black font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 transform hover:-translate-y-1 hover:shadow-[0_0_25px_var(--color-neon-blue)]"
                    >
                      <ExternalLink size={20} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  
                  {selectedProject.github_url && (
                    <a 
                      href={selectedProject.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2 border border-white/10 transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      <Code2 size={20} />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
