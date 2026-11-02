import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/base.css'
import './styles/phone.css'
import './styles/pc.css'
import './styles/v2.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
)
