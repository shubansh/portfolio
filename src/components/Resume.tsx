import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download } from 'lucide-react';

interface ResumeProps {
  resumeUrl: string;
}

const Resume: React.FC<ResumeProps> = ({ resumeUrl }) => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden glass-panel border border-[var(--color-neon-purple)]/30 p-1 md:p-2"
        >
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)] via-[var(--color-neon-purple)] to-[var(--color-neon-blue)] animate-[spin_4s_linear_infinite] opacity-20" />
          
          <div className="relative bg-[var(--color-primary-dark)] rounded-[1.25rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-neon-purple)]/10 flex items-center justify-center border border-[var(--color-neon-purple)]/30 shadow-[0_0_15px_rgba(176,38,255,0.2)]">
                <FileText size={32} className="text-[var(--color-neon-purple)]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Want to know more?</h3>
                <p className="text-gray-400">Download my latest resume to see my full experience and qualifications.</p>
              </div>
            </div>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 bg-[var(--color-neon-purple)] text-white font-bold rounded-xl shadow-[0_0_20px_var(--color-neon-purple)] hover:shadow-[0_0_30px_var(--color-neon-purple)] hover:-translate-y-1 transition-all flex items-center gap-3 shrink-0"
            >
              <Download size={20} className="group-hover:animate-bounce" />
              <span>Download Resume</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Resume;
