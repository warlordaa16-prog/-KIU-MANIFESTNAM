import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker for offline support & standalone mobile installation
try {
  registerSW({
    immediate: true,
    onOfflineReady() {
      // App cached for offline use
    },
  });
} catch {
  // Ignore if SW registration is unavailable in restricted preview frames
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
