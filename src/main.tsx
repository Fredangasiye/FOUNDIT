import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppSimple';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
