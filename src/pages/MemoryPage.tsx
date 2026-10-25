/* oxlint-disable react/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCelebration } from '../context/CelebrationContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import {
  LETTERS,
  letterStyle,
  type LetterInfo,
} from '../data/letters'
import { usePageTitle } from '../lib/usePageTitle'
import { shuffle, starsLabel } from '../lib/utils'

const PAIRS = 6

type Face = 'upper' | 'lower'

type MemoryCard = {
  key: string
  letter: LetterInfo
  face: Face
}

function createCards(): MemoryCard[] {
  const letters = shuffle(
    LETTERS.filter((letter) => letter.kind !== 'sign'),
  ).slice(0, PAIRS)
  return shuffle(
    letters.flatMap((letter) => [
      { key: `${letter.id}-upper`, letter, face: 'upper' as const },
      { key: `${letter.id}-lower`, letter, face: 'lower' as const },
    ]),
  )
}

export function MemoryPage() {
  usePageTitle('Игра «Найди пару»')
  const [cards, setCards] = useState<MemoryCard[]>(createCards)
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<string>>(() => new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [bonus, setBonus] = useState(0)

  const { addStars, recordMemoryWin, progress } = useProgress()
  const { speak, stopSpeaking, play } = useSound()
  const { celebrate } = useCelebration()
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      stopSpeaking()
    }
  }, [stopSpeaking])

  useEffect(() => {
    if (matched.size !== PAIRS || hasWon) return
    setHasWon(true)
    setBonus(3)
    play('win')
    addStars(3)
    recordMemoryWin()
    celebrate({ count: 170 })
    speak('Молодец! Все пары найдены!')
  }, [matched, hasWon, play, addStars, recordMemoryWin, celebrate, speak])

  const restart = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    stopSpeaking()
    play('swoosh')
    setCards(createCards())
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setHasWon(false)
    setBonus(0)
  }

  const flipCard = (index: number) => {
    if (locked || hasWon) return
    const card = cards[index]
    if (!card || flipped.includes(index) || matched.has(card.letter.id)) return

    play('flip')
    const nextFlipped = [...flipped, index]
    setFlipped(nextFlipped)

    if (nextFlipped.length < 2) return

    setLocked(true)
    setMoves((current) => current + 1)
    const [firstIndex, secondIndex] = nextFlipped
    const first = cards[firstIndex]
    const second = cards[secondIndex]

    if (first.letter.id === second.letter.id) {
      timerRef.current = window.setTimeout(() => {
        setMatched((current) => {
          const next = new Set(current)
          next.add(first.letter.id)
          return next
        })
        setFlipped([])
        setLocked(false)
        play('correct')
        addStars(1)
        speak(`${first.letter.upper}. ${first.letter.lower}.`)
      }, 380)
    } else {
      timerRef.current = window.setTimeout(() => {
        setFlipped([])
        setLocked(false)
        play('flip')
      }, 900)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold text-ink-soft transition hover:text-ink"
        >
          <span aria-hidden="true">←</span> Игры
        </Link>
        <div className="flex items-center gap-2">
          <span className="chip bg-white/80 text-ink-soft">
            ходы: {moves}
          </span>
          <span className="chip bg-mint/20 text-[#0F766E]">
            пар: {matched.size}/{PAIRS}
          </span>
          <span className="chip bg-sun/30 text-ink">
            <span aria-hidden="true">⭐</span> {progress.stars}
          </span>
        </div>
      </div>

      <section className="mt-3 rounded-[2rem] border-2 border-white bg-[linear-gradient(135deg,#F0E7FF,#E3F4FF)] p-4 shadow-sticker sm:p-6">
        <div className="text-center">
          <span className="chip bg-white/80 text-grape">
            <span aria-hidden="true">🎴</span> найди пару
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Заглавная и строчная
          </h1>
          <p className="mx-auto mt-1 max-w-md text-xs font-semibold text-ink-soft sm:text-sm">
            Открывай по две карточки и находи одинаковые буквы: большую и
            маленькую.
          </p>
        </div>

        {hasWon && (
          <div className="animate-pop mt-4 rounded-3xl border-2 border-white bg-white/90 p-4 text-center shadow-sticker">
            <p className="text-2xl" aria-hidden="true">
              🎉🏆🎉
            </p>
            <p className="mt-1 font-display text-xl font-bold text-ink">
              Все пары найдены!
            </p>
            <p className="mt-1 text-sm font-bold text-ink-soft">
              {starsLabel(matched.size + bonus)} за игру, включая бонус
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={restart}
                className="rounded-full border-b-4 border-[#6D28D9] bg-[linear-gradient(135deg,#B79CFF,#8B5CF6)] px-5 py-2.5 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:border-b-2"
              >
                🔁 Ещё раз
              </button>
              <Link
                to="/games"
                className="rounded-full border-2 border-white bg-white px-5 py-2.5 text-sm font-black text-ink shadow-sticker transition hover:-translate-y-0.5"
              >
                Другая игра
              </Link>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {cards.map((card, index) => {
            const isMatched = matched.has(card.letter.id)
            const isFlipped = isMatched || flipped.includes(index)
            const shownLetter =
              card.face === 'upper' ? card.letter.upper : card.letter.lower

            return (
              <button
                key={card.key}
                type="button"
                onClick={() => flipCard(index)}
                disabled={isMatched || hasWon}
                aria-pressed={isFlipped}
                aria-label={
                  isFlipped
                    ? `Буква ${shownLetter}`
                    : 'Закрытая карточка'
                }
                style={letterStyle(card.letter)}
                className={`flip-scene relative aspect-[3/4] w-full rounded-2xl transition-transform duration-200 ${
                  isMatched ? 'cursor-default' : 'hover:-translate-y-1 active:scale-95'
                }`}
              >
                <div
                  className={`flip-inner relative h-full w-full ${isFlipped ? 'is-flipped' : ''}`}
                >
                  <div className="flip-face absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-white bg-[linear-gradient(145deg,#5B21B6,#33254A)] shadow-sticker">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-dots opacity-30"
                    />
                    <span
                      aria-hidden="true"
                      className="relative text-3xl font-black text-sun/90"
                    >
                      ?
                    </span>
                    <span className="relative mt-1 text-[9px] font-black tracking-[0.18em] text-white/50 uppercase">
                      букварь
                    </span>
                  </div>

                  <div className="flip-face flip-back letter-gradient absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-white text-white shadow-sticker">
                    <span
                      aria-hidden="true"
                      className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-white/20 blur-md"
                    />
                    <span className="text-4xl leading-none font-black drop-shadow-[0_3px_0_rgba(51,37,74,0.15)] sm:text-5xl">
                      {shownLetter}
                    </span>
                    <span className="mt-1 text-[10px] font-extrabold opacity-80">
                      {card.letter.emoji} {card.letter.word}
                    </span>
                    {isMatched && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1 right-1.5 text-sm"
                      >
                        ⭐
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-center text-[11px] font-bold text-ink-soft">
          <span aria-hidden="true">💡</span> За каждую пару — звезда, за все
          пары — бонус!
        </p>
      </section>

      {!hasWon && (
        <button
          type="button"
          onClick={restart}
          className="mx-auto mt-4 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold text-ink-soft transition hover:bg-white/60 hover:text-ink"
        >
          <span aria-hidden="true">🔁</span> Начать заново
        </button>
      )}
    </div>
  )
}
