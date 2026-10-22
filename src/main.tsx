import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/ibm-plex-mono/latin-400.css';
import App from './app/App';
import './styles/fonts.css';
import './styles/global.css';
import './styles/milestone2.css';
import './styles/archive.css';
import './styles/constellation.css';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<StrictMode><App /></StrictMode>);
  document.getElementById('portfolio-static')?.remove();
}
