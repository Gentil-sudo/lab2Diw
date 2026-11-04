import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TemaProvider } from './context/TemaContext.jsx'
import ErroTela from './components/ErroTela.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErroTela>
      <TemaProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </TemaProvider>
    </ErroTela>
  </StrictMode>,
)
