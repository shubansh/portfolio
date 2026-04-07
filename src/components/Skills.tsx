import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Gamepad2, Video, Radio, Layers } from 'lucide-react';

const Skills = () => {
  const skillsData = [
    {
      category: "Web Dev",
      icon: <Code2 size={32} className="text-[var(--color-neon-blue)]" />,
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      color: "var(--color-neon-blue)"
    },
    {
      category: "Game Dev",
      icon: <Gamepad2 size={32} className="text-[var(--color-neon-purple)]" />,
      skills: ["Unity", "C#"],
      color: "var(--color-neon-purple)"
    },
    {
      category: "Editing & Design",
      subtitle: "Video Editing + Graphic Design",
      icon: <Video size={32} className="text-pink-500" />,
      skills: ["🎬 Filmora (Video Editing)", "🎨 Canva (Design)", "🖼️ Photoshop (Image Editing)"],
      color: "#ec4899"
    },
    {
      category: "Streaming",
      icon: <Radio size={32} className="text-red-500" />,
      skills: ["OBS Studio"],
      color: "#ef4444"
    },
    {
      category: "Others",
      icon: <Layers size={32} className="text-green-400" />,
      skills: ["Python (basic)", "Flutter (basic)"],
      color: "#4ade80"
    }
  ];

  return (
    <section id="skills" className="py-20 bg-[var(--color-primary-dark)] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4"><span className="text-gradient">My Arsenal</span></h2>
          <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-lg">
            A diverse toolkit ensuring flexibility across web development, game creation, and content production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillsData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{ '--hover-color': item.color } as React.CSSProperties}
              className="glass-panel p-8 relative overflow-hidden group hover:border-transparent transition-all duration-300"
            >
              {/* Dynamic Gradient Background on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${item.color} 0%, transparent 70%)` }}
              />
              
              <div className="relative z-10 flex flex-col items-center text-center h-full">
                <div className="mb-6 p-4 rounded-full bg-white/5 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[var(--hover-color)] transition-colors">
                  {item.category}
                </h3>
                {item.subtitle && (
                  <p className="text-[var(--color-text-muted)] text-sm mb-4 font-medium">{item.subtitle}</p>
                )}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-auto">
                  {item.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div 
                className="absolute -bottom-2 -right-2 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-30 rounded-full transition-opacity duration-500"
                style={{ backgroundColor: item.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
