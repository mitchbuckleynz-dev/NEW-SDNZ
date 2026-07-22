import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { EstimatePage } from './pages/EstimatePage.tsx';
import { DemoPage } from './pages/DemoPage.tsx';
import { MaintenancePage } from './pages/MaintenancePage.tsx';
import { ProjectsSyncPage } from './pages/ProjectsSyncPage.tsx';
import './index.css';

// To enable maintenance mode, add VITE_MAINTENANCE=true to your environment variables
const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Respect the OS "reduce motion" setting for all motion/react animations */}
    <MotionConfig reducedMotion="user">
    <BrowserRouter>
      {isMaintenance ? (
        <Routes>
          {/* Public Maintenance Page */}
          <Route path="/" element={<MaintenancePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Development Routes (for you to test) */}
          <Route path="/dev" element={<App />} />
          <Route path="/dev/services" element={<ServicesPage />} />
          <Route path="/dev/projects" element={<ProjectsPage />} />
          <Route path="/dev/about" element={<AboutPage />} />
          <Route path="/dev/contact" element={<ContactPage />} />
          <Route path="/dev/estimate" element={<EstimatePage />} />
          <Route path="/dev/demo" element={<DemoPage />} />
          <Route path="/dev/projects-sync" element={<ProjectsSyncPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/estimate" element={<EstimatePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/projects-sync" element={<ProjectsSyncPage />} />
          {/* Old routes (/news, /sync, etc.) fall through to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
);
