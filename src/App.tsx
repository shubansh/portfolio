import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ErrorBoundary from './components/common/ErrorBoundary';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-text-main)]">
          {/* Background Ambient Glow */}
          <div className="fixed top-[-50%] left-[-10%] w-[80%] h-[150%] rounded-full bg-[var(--color-neon-purple)]/5 blur-[120px] pointer-events-none" />
          <div className="fixed bottom-[-50%] right-[-10%] w-[80%] h-[150%] rounded-full bg-[var(--color-neon-blue)]/5 blur-[120px] pointer-events-none" />
          
          <Navigation />
          <div className="relative z-10 pt-20">
            <AnimatedRoutes />
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
