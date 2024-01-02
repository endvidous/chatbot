import React from 'react'
import  { createRoot } from 'react-dom/client'
import App from './App.jsx'


// eslint-disable-next-line react-refresh/only-export-components
const DOMnode = document.getElementById('root');
const root = createRoot(DOMnode);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)


