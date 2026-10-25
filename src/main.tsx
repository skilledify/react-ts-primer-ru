import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { CelebrationProvider } from './context/CelebrationContext'
import { ProgressProvider } from './context/ProgressContext'
import { SoundProvider } from './context/SoundContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <SoundProvider>
        <ProgressProvider>
          <CelebrationProvider>
            <App />
          </CelebrationProvider>
        </ProgressProvider>
      </SoundProvider>
    </HashRouter>
  </StrictMode>,
)
