import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LetterTile } from '../components/LetterTile'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import {
  CONSONANTS,
  KIND_LABEL,
  LETTERS,
  SIGNS,
  VOWELS,
  type LetterKind,
} from '../data/letters'

type Filter = 'all' | LetterKind

const FILTERS: { id: Filter; label: string; count: number; icon: string }[] = [
  { id: 'all', label: 'Все буквы', count: LETTERS.length, icon: '🔤' },
  { id: 'vowel', label: 'Гласные', count: VOWELS.length, icon: '🎵' },
  { id: 'consonant', label: 'Согласные', count: CONSONANTS.length, icon: '🗣️' },
  { id: 'sign', label: 'Знаки', count: SIGNS.length, icon: '✏️' },
]

export function AlphabetPage() {
  const { progress, isLearned } = useProgress()
  const { speak, stopSpeaking, play } = useSound()
  const [filter, setFilter] = useState<Filter>('all')
  const [playing, setPlaying] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const visibleLetters = useMemo(
    () =>
      filter === 'all'
        ? LETTERS
        : LETTERS.filter((letter) => letter.kind === filter),
    [filter],
  )

  const learnedCount = LETTERS.filter((letter) =>
    progress.learned.includes(letter.id),
  ).length

  useEffect(() => {
    if (!playing) return

    const letter = LETTERS[activeIndex]
    if (!letter) return

    speak(letter.name, { rate: 0.88 })

    const current = document.getElementById(`letter-${letter.id}`)
    current?.scrollIntoView({ block: 'center', behavior: 'smooth' })

    const delay = 850 + letter.name.length * 70
    const timeout = window.setTimeout(() => {
      if (activeIndex === LETTERS.length - 1) {
        setPlaying(false)
        setActiveIndex(-1)
      } else {
        setActiveIndex(activeIndex + 1)
      }
    }, delay)

    return () => window.clearTimeout(timeout)
  }, [playing, activeIndex, speak])

  useEffect(() => {
    return () => stopSpeaking()
  }, [stopSpeaking])

  const startOrStopSong = () => {
    if (playing) {
      setPlaying(false)
      setActiveIndex(-1)
      stopSpeaking()
      play('tap')
      return
    }
    play('swoosh')
    setFilter('all')
    setActiveIndex(0)
    setPlaying(true)
  }

  const changeFilter = (next: Filter) => {
    play('tap')
    setFilter(next)
    setPlaying(false)
    setActiveIndex(-1)
    stopSpeaking()
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2.25rem] border-2 border-white bg-white/65 p-5 shadow-sticker sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-sun/25 blur-2xl"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="chip bg-coral/15 text-[#D94A68]">
              <span aria-hidden="true">🔤</span> 33 буквы
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Русская азбука
            </h1>
            <p className="mt-1.5 max-w-lg text-sm font-semibold text-ink-soft sm:text-base">
              Нажми на любую букву, чтобы услышать её, выучить стишок и открыть
              прописи.
            </p>
          </div>

          <button
            type="button"
            onClick={startOrStopSong}
            className={`inline-flex items-center gap-2 rounded-full border-b-4 px-5 py-3 text-sm font-black text-white shadow-sticker transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2 ${
              playing
                ? 'border-[#B91C4A] bg-[linear-gradient(135deg,#FF8A8A,#F43F8E)]'
                : 'border-[#6D28D9] bg-[linear-gradient(135deg,#B79CFF,#8B5CF6)]'
            }`}
          >
            <span aria-hidden="true" className={playing ? 'animate-wiggle' : ''}>
              {playing ? '⏹' : '🎵'}
            </span>
            {playing
              ? `Остановить${activeIndex >= 0 && activeIndex < LETTERS.length ? ` · ${LETTERS[activeIndex].upper}` : ''}`
              : 'Спеть алфавит'}
          </button>
        </div>

        <div className="relative mt-6">
          <div className="flex items-center justify-between gap-3 text-xs font-extrabold text-ink-soft">
            <span>
              Выучено{' '}
              <strong className="text-base text-ink">{learnedCount}</strong> из{' '}
              {LETTERS.length}
            </span>
            <span>{Math.round((learnedCount / LETTERS.length) * 100)}%</span>
          </div>
          <div
            className="mt-2 h-3.5 overflow-hidden rounded-full bg-cream"
            role="progressbar"
            aria-valuenow={learnedCount}
            aria-valuemin={0}
            aria-valuemax={LETTERS.length}
            aria-label="Выучено букв"
          >
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#FFC53D,#FF6B6B_50%,#9B5DE5)] transition-[width] duration-700"
              style={{
                width: `${Math.max(learnedCount ? 4 : 0, (learnedCount / LETTERS.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-xs font-extrabold transition-all duration-200 sm:text-sm ${
              filter === item.id
                ? 'border-ink bg-ink text-white shadow-sticker'
                : 'border-white bg-white/75 text-ink-soft hover:-translate-y-0.5 hover:text-ink'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === item.id ? 'bg-white/20' : 'bg-cream'
              }`}
            >
              {item.count}
            </span>
          </button>
        ))}

        <span className="ml-auto hidden text-xs font-bold text-ink-soft sm:block">
          {filter === 'all'
            ? 'Нажми на букву 👆'
            : `${KIND_LABEL[filter]}: ${visibleLetters.length}`}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
        {visibleLetters.map((letter, index) => (
          <div
            key={letter.id}
            id={`letter-${letter.id}`}
            className={`animate-pop scroll-m-24 ${
              playing && LETTERS[activeIndex]?.id === letter.id
                ? 'z-10 scale-110 rounded-3xl ring-4 ring-sun ring-offset-2 ring-offset-cream'
                : ''
            }`}
            style={{
              animationDelay: `${Math.min(index * 22, 450)}ms`,
              transition: 'transform 200ms ease',
            }}
          >
            <LetterTile letter={letter} learned={isLearned(letter.id)} />
          </div>
        ))}
      </div>

      {visibleLetters.length === 0 && (
        <p className="mt-8 text-center font-bold text-ink-soft">
          Здесь пока пусто. Выбери другую группу букв.
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-3xl border-2 border-white bg-white/60 px-5 py-4 text-center sm:flex-row sm:text-left">
        <p className="text-sm font-bold text-ink-soft">
          <span aria-hidden="true" className="mr-1">
            💡
          </span>
          Совет: после каждой буквы загляни в прописи — так буква запомнится
          быстрее!
        </p>
        <Link
          to="/write"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sky px-4 py-2 text-xs font-black text-white shadow-sticker transition hover:-translate-y-0.5"
        >
          Открыть прописи <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
