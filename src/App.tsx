import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AlphabetPage } from './pages/AlphabetPage'
import { BuildWordPage } from './pages/BuildWordPage'
import { DrumPage } from './pages/DrumPage'
import { FindLetterPage } from './pages/FindLetterPage'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { LetterPage } from './pages/LetterPage'
import { MemoryPage } from './pages/MemoryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProgressPage } from './pages/ProgressPage'
import { TracingPage } from './pages/TracingPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="alphabet" element={<AlphabetPage />} />
        <Route path="letter/:id" element={<LetterPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="games/find" element={<FindLetterPage />} />
        <Route path="games/build" element={<BuildWordPage />} />
        <Route path="games/memory" element={<MemoryPage />} />
        <Route path="games/drum" element={<DrumPage />} />
        <Route path="write" element={<TracingPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
