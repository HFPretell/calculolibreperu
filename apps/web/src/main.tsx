import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { inicializarTema } from './lib/theme'
import './styles/index.css'

inicializarTema()

const contenedor = document.getElementById('root')

if (!contenedor) {
  throw new Error('No se encontró el elemento root')
}

createRoot(contenedor).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
