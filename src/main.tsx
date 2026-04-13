import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { DemoPage } from './pages/DemoPage.tsx';
import { MaintenancePage } from './pages/MaintenancePage.tsx';
import './index.css';

// To disable maintenance mode locally, add VITE_LIVE=true to .env.local
// or temporarly change this value.
const isMaintenance = import.meta.env.VITE_LIVE !== 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {isMaintenance ? (
        <Routes>
          {/* Public Maintenance Page */}
          <Route path="/" element={<MaintenancePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
          {/* Development Routes (for you to test) */}
          <Route path="/dev" element={<App />} />
          <Route path="/dev/projects" element={<ProjectsPage />} />
          <Route path="/dev/demo" element={<DemoPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Routes>
      )}
    </BrowserRouter>
  </StrictMode>,
);
