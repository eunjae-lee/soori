import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { name } from 'soori/test';
import { cat1 } from 'soori/json-gen';

console.log('# name:', name);
console.log('# cat1:', cat1.name);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
