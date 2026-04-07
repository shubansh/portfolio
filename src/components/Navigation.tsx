import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-[var(--color-primary-dark)]/70 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent border-transparent py-4'
        }`}
      >
        {/* Top edge glowing highlight */}
        {isScrolled && (
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-neon-blue)] to-transparent opacity-50" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-black tracking-wider uppercase text-white hover:text-[var(--color-neon-blue)] transition-colors group">
                SB<span className="text-[var(--color-neon-blue)] group-hover:text-pink-500 transition-colors drop-shadow-[0_0_8px_var(--color-neon-blue)]">.</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="relative px-3 py-2 group"
                    >
                      <span className={`relative z-10 text-sm font-bold tracking-wider uppercase transition-colors duration-300 ${
                        isActive ? 'text-[var(--color-neon-blue)]' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {link.name}
                      </span>
                      
                      {/* Active state static glow underline */}
                      {isActive && (
                        <motion.div 
                          layoutId="nav-active"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-neon-blue)] shadow-[0_0_15px_var(--color-neon-blue)]"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover effect background */}
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 transform scale-95 group-hover:scale-100" />
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white focus:outline-none p-2"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-50 bg-[var(--color-primary-dark)]/95 backdrop-blur-2xl flex flex-col justify-center items-center m-0"
          >
            <div className="flex flex-col space-y-8 text-center w-full px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative px-4 py-4 w-full rounded-xl text-3xl font-black uppercase tracking-widest transition-all ${
                    location.pathname === link.path 
                      ? 'text-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]/10 shadow-[0_0_30px_rgba(0,240,255,0.1)_inset]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            {/* Background ambient glow inside mobile menu */}
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-[var(--color-neon-blue)]/10 blur-[100px] pointer-events-none" />
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
