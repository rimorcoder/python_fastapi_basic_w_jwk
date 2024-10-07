import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '@descope/react-sdk';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider projectId='P2n4bomXP9l1HOCAxjNN5T0xBXvy'>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)