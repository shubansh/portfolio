import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  category: string;
}

interface VideosProps {
  items: Video[];
}

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return '';
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URL(url).searchParams;
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1].split('?')[0];
  }

  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
};

const isYoutubeLink = (url: string) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const Videos: React.FC<VideosProps> = ({ items }) => {
  const [filter, setFilter] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!items || items.length === 0) return null;

  const categories = ['All', 'Gaming', 'Editing', 'Streaming'];

  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(v => v.category === filter);

  return (
    <section id="videos" className="py-24 relative z-10 bg-[var(--color-primary-dark)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center justify-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Latest <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">Content</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-transparent rounded-full mb-6 mx-auto" />
          <p className="text-[var(--color-text-muted)] max-w-2xl text-lg mb-10">
            A curated collection of my streams, gameplay highlights, and high-end video edits.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                  filter === cat 
                    ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105' 
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
            {filteredItems.map((video, index) => (
              <motion.div
                layout
                key={video.id}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                onClick={() => setSelectedVideo(video)}
                className="group relative rounded-2xl overflow-hidden glass-panel border border-white/10 hover:border-pink-500/50 transition-all duration-500 bg-white/5 cursor-pointer shadow-lg hover:shadow-[0_15px_40px_rgba(236,72,153,0.15)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  {/* Thumbnail Image */}
                  <img 
                    src={video.thumbnail_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'} 
                    alt={video.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Hover Interactivity Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-pink-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm shadow-[0_0_25px_rgba(236,72,153,0.8)]">
                      <Play className="ml-1" fill="currentColor" size={24} />
                    </div>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold tracking-wider text-pink-500 uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {video.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 relative z-20 transition-colors duration-500 group-hover:bg-pink-500/5">
                  <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors duration-300 line-clamp-2">
                    {video.title}
                  </h3>
                </div>
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[0_0_30px_rgba(236,72,153,0.1)_inset]" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
             No videos uploaded in this category yet.
          </div>
        )}
      </div>

      {/* VIDEO PREVIEW MODAL */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(236,72,153,0.2)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Header */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50 pointer-events-none">
                <h3 className="text-xl font-bold text-white drop-shadow-md truncate pr-16">{selectedVideo.title}</h3>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 bg-black/50 hover:bg-pink-500 hover:text-black text-white rounded-full transition-colors backdrop-blur-md pointer-events-auto border border-white/10"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Theater Mode Player Frame */}
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                {isYoutubeLink(selectedVideo.video_url) ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getYoutubeEmbedUrl(selectedVideo.video_url)}
                    title={selectedVideo.title}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video 
                    controls 
                    autoPlay 
                    className="w-full h-full"
                    src={selectedVideo.video_url}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Videos;
