import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminDashboard from './AdminDashboard'
import './index.css'

// Determine which component to show based on current path
const isAdminPath = window.location.pathname === '/admin';
const ComponentToRender = isAdminPath ? AdminDashboard : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ComponentToRender />
  </React.StrictMode>,
)