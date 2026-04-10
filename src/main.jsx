import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Routing from './App.jsx';
import Navigation from './component/Nav.jsx';
import './css/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/*This is necessary to route */}
      <Navigation />
      <Routing />
    </BrowserRouter>
  </StrictMode>
)