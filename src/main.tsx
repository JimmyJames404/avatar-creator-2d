import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AvatarDemo } from './pages/AvatarDemo';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><AvatarDemo /></StrictMode>,
);
