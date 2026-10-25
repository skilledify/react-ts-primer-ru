/* oxlint-disable react/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'bukvar:progress:v1'

export type Progress = {
  learned: string[]
  stars: number
  quizBest: number
  memoryWins: number
  wordsBuilt: number
  drumWins: number
}

const EMPTY_PROGRESS: Progress = {
  learned: [],
  stars: 0,
  quizBest: 0,
  memoryWins: 0,
  wordsBuilt: 0,
  drumWins: 0,
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw) as Partial<Progress>
    return {
      learned: Array.isArray(parsed.learned)
        ? parsed.learned.filter((item): item is string => typeof item === 'string')
        : [],
      stars: Number.isFinite(parsed.stars) ? Number(parsed.stars) : 0,
      quizBest: Number.isFinite(parsed.quizBest) ? Number(parsed.quizBest) : 0,
      memoryWins: Number.isFinite(parsed.memoryWins)
        ? Number(parsed.memoryWins)
        : 0,
      wordsBuilt: Number.isFinite(parsed.wordsBuilt)
        ? Number(parsed.wordsBuilt)
        : 0,
      drumWins: Number.isFinite(parsed.drumWins)
        ? Number(parsed.drumWins)
        : 0,
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

type ProgressContextValue = {
  progress: Progress
  isLearned: (id: string) => boolean
  learnLetter: (id: string) => void
  toggleLearned: (id: string) => void
  addStars: (count: number) => void
  recordQuiz: (score: number) => void
  recordMemoryWin: () => void
  recordWord: () => void
  recordDrumWin: () => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Приватный режим или переполненное хранилище — просто продолжаем без сохранения.
    }
  }, [progress])

  const isLearned = useCallback(
    (id: string) => progress.learned.includes(id),
    [progress.learned],
  )

  const learnLetter = useCallback((id: string) => {
    setProgress((current) =>
      current.learned.includes(id)
        ? current
        : { ...current, learned: [...current.learned, id] },
    )
  }, [])

  const toggleLearned = useCallback((id: string) => {
    setProgress((current) => ({
      ...current,
      learned: current.learned.includes(id)
        ? current.learned.filter((item) => item !== id)
        : [...current.learned, id],
    }))
  }, [])

  const addStars = useCallback((count: number) => {
    if (!count) return
    setProgress((current) => ({
      ...current,
      stars: Math.max(0, current.stars + count),
    }))
  }, [])

  const recordQuiz = useCallback((score: number) => {
    setProgress((current) => ({
      ...current,
      quizBest: Math.max(current.quizBest, score),
    }))
  }, [])

  const recordMemoryWin = useCallback(() => {
    setProgress((current) => ({
      ...current,
      memoryWins: current.memoryWins + 1,
    }))
  }, [])

  const recordWord = useCallback(() => {
    setProgress((current) => ({
      ...current,
      wordsBuilt: current.wordsBuilt + 1,
    }))
  }, [])

  const recordDrumWin = useCallback(() => {
    setProgress((current) => ({
      ...current,
      drumWins: current.drumWins + 1,
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(EMPTY_PROGRESS)
  }, [])

  const value = useMemo(
    () => ({
      progress,
      isLearned,
      learnLetter,
      toggleLearned,
      addStars,
      recordQuiz,
      recordMemoryWin,
      recordWord,
      recordDrumWin,
      resetProgress,
    }),
    [
      progress,
      isLearned,
      learnLetter,
      toggleLearned,
      addStars,
      recordQuiz,
      recordMemoryWin,
      recordWord,
      recordDrumWin,
      resetProgress,
    ],
  )

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress должен использоваться внутри ProgressProvider')
  }
  return context
}
