import React from 'react';
import { motion } from 'framer-motion';
import { Download, PlayCircle, FolderArchive } from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';

interface HeroProps {
  profile: any;
  loading: boolean;
}

const Hero: React.FC<HeroProps> = ({ profile, loading }) => {
  const defaultProfile = {
    name: "Shubhanshu Bilgaiyan",
    roles: ["Developer", "Video Editor", "Gamer", "Streamer"],
    bio: "Passionate about building games, developing web apps, and creating engaging content."
  };

  const data = loading || !profile ? defaultProfile : profile;
  const name = data.name && data.name.trim() !== '' ? data.name : defaultProfile.name;
  const roles = data.roles && data.roles.length > 0 ? data.roles : defaultProfile.roles;

  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 2, // 2px to 6px
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    duration: Math.random() * 10 + 10, // 10s to 20s
    color: Math.random() > 0.5 ? 'var(--color-neon-blue)' : 'var(--color-neon-purple)'
  }));

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Immersive Animated Particles Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            animate={{
              y: ['0%', '-50%', '50%', '0%'],
              x: ['0%', '30%', '-30%', '0%'],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-4"
        >
          <h2 className="text-xl md:text-2xl font-medium text-gray-400 tracking-widest uppercase">Welcome to my universe</h2>
          
          <div className="relative inline-block mt-4 mb-2">
             {/* Massive text glow */}
            <div className="absolute inset-0 blur-[80px] bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] opacity-30 pointer-events-none" />
            
            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black tracking-tight flex flex-col md:flex-row items-center justify-center gap-4">
              <span className="text-white drop-shadow-lg">Hi, I'm</span>
              <span className="text-gradient neon-glow bg-clip-text whitespace-nowrap pb-2">
                {name}
              </span>
            </h1>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold mt-6 h-12 flex items-center justify-center gap-2">
            <span className="text-gray-200">A Creative</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 font-black">
              <Typewriter
                words={roles}
                loop={true}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </h3>

          <p className="mt-8 text-lg md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed glass-panel p-6 shadow-2xl">
            {data.bio || defaultProfile.bio}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap items-center justify-center gap-6 pt-10"
        >
          <a
            href="#projects"
            className="group relative px-8 py-4 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_50px_rgba(0,240,255,0.8)] transition-all flex items-center gap-2 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            <FolderArchive size={20} className="relative z-10" />
            <span className="relative z-10">Explore Projects</span>
          </a>

          <a
            href="#videos"
            className="group px-8 py-4 bg-transparent border-2 border-[var(--color-neon-purple)] text-white font-bold rounded-lg overflow-hidden shadow-[0_0_15px_rgba(176,38,255,0.2)_inset] hover:bg-[var(--color-neon-purple)]/15 hover:shadow-[0_0_30px_rgba(176,38,255,0.5)] transition-all flex items-center gap-2 transform hover:-translate-y-1 backdrop-blur-sm"
          >
            <PlayCircle size={20} />
            <span>Watch Content</span>
          </a>

          {data.resume_url && (
            <a
              href={data.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-[var(--color-neon-purple)] text-white font-bold rounded-lg overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] transition-all flex items-center gap-2 transform hover:-translate-y-2 hover:scale-105 duration-300"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <Download size={20} className="relative z-10 group-hover:animate-bounce" />
              <span className="relative z-10 tracking-widest uppercase text-sm">Download Resume</span>
            </a>
          )}
        </motion.div>
      </div>
      
      {/* Bottom gradient fade for smoother transition into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-primary-dark)] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default Hero;
