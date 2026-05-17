import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { DemoPage } from './pages/DemoPage.tsx';
import { MaintenancePage } from './pages/MaintenancePage.tsx';
import { NewsPage } from './pages/NewsPage.tsx';
import { NewsArticlePage } from './pages/NewsArticlePage.tsx';
import { SyncPage } from './pages/SyncPage.tsx';
import './index.css';

// To enable maintenance mode, add VITE_MAINTENANCE=true to your environment variables
const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';

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
          <Route path="/dev/news" element={<NewsPage />} />
          <Route path="/dev/news/:slug" element={<NewsArticlePage />} />
          <Route path="/dev/sync" element={<SyncPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:slug" element={<NewsArticlePage />} />
          <Route path="/sync" element={<SyncPage />} />
        </Routes>
      )}
    </BrowserRouter>
  </StrictMode>,
);
