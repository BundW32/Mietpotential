import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Using curly braces { } because we are using a Named Export
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
