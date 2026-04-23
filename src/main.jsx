import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import '@/i18n/config.js'

const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme === 'light' ? 'light' : 'dark'
document.documentElement.classList.toggle('dark', initialTheme === 'dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
