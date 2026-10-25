/* oxlint-disable react/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'bukvar:sound:v1'

export type SoundName =
  | 'tap'
  | 'correct'
  | 'wrong'
  | 'win'
  | 'flip'
  | 'star'
  | 'swoosh'

type SoundContextValue = {
  soundOn: boolean
  toggleSound: () => void
  speak: (text: string, options?: { rate?: number; pitch?: number }) => void
  stopSpeaking: () => void
  play: (name: SoundName) => void
}

const SoundContext = createContext<SoundContextValue | null>(null)

const TONES: Record<
  SoundName,
  { notes: number[]; duration: number; type: OscillatorType; gain: number; gap: number }
> = {
  tap: { notes: [620], duration: 0.07, type: 'sine', gain: 0.05, gap: 0 },
  flip: { notes: [430, 560], duration: 0.07, type: 'sine', gain: 0.04, gap: 0.05 },
  correct: {
    notes: [523.25, 659.25, 783.99],
    duration: 0.12,
    type: 'triangle',
    gain: 0.06,
    gap: 0.09,
  },
  wrong: { notes: [220, 174.61], duration: 0.16, type: 'sawtooth', gain: 0.035, gap: 0.1 },
  win: {
    notes: [523.25, 659.25, 783.99, 1046.5],
    duration: 0.16,
    type: 'triangle',
    gain: 0.065,
    gap: 0.11,
  },
  star: {
    notes: [880, 1174.66, 1567.98],
    duration: 0.1,
    type: 'sine',
    gain: 0.045,
    gap: 0.06,
  },
  swoosh: { notes: [300, 500, 700], duration: 0.1, type: 'sine', gain: 0.03, gap: 0.04 },
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'off'
    } catch {
      return true
    }
  })

  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, soundOn ? 'on' : 'off')
    } catch {
      // Сохранение не критично.
    }
  }, [soundOn])

  useEffect(() => {
    if (!soundOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [soundOn])

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number }) => {
      if (!soundOn || !('speechSynthesis' in window) || !text.trim()) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ru-RU'
      utterance.rate = options?.rate ?? 0.82
      utterance.pitch = options?.pitch ?? 1.15
      utterance.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const russianVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith('ru'),
      )
      if (russianVoice) utterance.voice = russianVoice
      window.speechSynthesis.speak(utterance)
    },
    [soundOn],
  )

  const play = useCallback(
    (name: SoundName) => {
      if (!soundOn) return
      try {
        let context = audioContextRef.current
        if (!context) {
          context = new AudioContext()
          audioContextRef.current = context
        }
        if (context.state === 'suspended') {
          void context.resume()
        }
        const config = TONES[name]
        const now = context.currentTime
        config.notes.forEach((frequency, index) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()
          const start = now + index * config.gap
          const end = start + config.duration
          oscillator.type = config.type
          oscillator.frequency.setValueAtTime(frequency, start)
          gain.gain.setValueAtTime(0.0001, start)
          gain.gain.exponentialRampToValueAtTime(config.gain, start + 0.015)
          gain.gain.exponentialRampToValueAtTime(0.0001, end)
          oscillator.connect(gain)
          gain.connect(context.destination)
          oscillator.start(start)
          oscillator.stop(end + 0.02)
        })
      } catch {
        // Web Audio может быть недоступен — звук просто не сыграет.
      }
    },
    [soundOn],
  )

  const toggleSound = useCallback(() => {
    setSoundOn((current) => !current)
  }, [])

  const value = useMemo(
    () => ({ soundOn, toggleSound, speak, stopSpeaking, play }),
    [soundOn, toggleSound, speak, stopSpeaking, play],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error('useSound должен использоваться внутри SoundProvider')
  }
  return context
}
