import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added curly brackets { } because we switched to Named Export
import { App } from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
