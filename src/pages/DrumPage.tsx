/* oxlint-disable react/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { useCelebration } from '../context/CelebrationContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import {
  KIND_LABEL,
  LETTERS,
  letterStyle,
  type LetterInfo,
} from '../data/letters'
import { matchesLetter } from '../lib/letterSpeech'
import { usePageTitle } from '../lib/usePageTitle'
import {
  useSpeechRecognition,
  type SpeechResultPayload,
} from '../lib/useSpeechRecognition'

const ITEM_HEIGHT = 84
const WINDOW_ITEMS = 3
const CYCLE_HEIGHT = LETTERS.length * ITEM_HEIGHT
const SPIN_SPEED = 1150
const MIN_SPIN_TURNS = 2
const REEL = Array.from({ length: 6 }, () => LETTERS).flat()

type Phase = 'spinning' | 'stopping' | 'result'
type AnswerStatus = 'idle' | 'listening' | 'correct' | 'wrong'

export function DrumPage() {
  usePageTitle('Игра «Барабан букв»')

  const { addStars, learnLetter, recordDrumWin, progress } = useProgress()
  const { play, speak, stopSpeaking } = useSound()
  const { celebrate } = useCelebration()

  const [phase, setPhase] = useState<Phase>('spinning')
  const [selected, setSelected] = useState<LetterInfo | null>(null)
  const [status, setStatus] = useState<AnswerStatus>('idle')
  const [message, setMessage] = useState('')
  const [heard, setHeard] = useState('')
  const [manualCheck, setManualCheck] = useState(false)
  const [sessionCorrect, setSessionCorrect] = useState(0)

  const stripRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const spinActiveRef = useRef(false)
  const lastTimeRef = useRef(0)
  const selectedRef = useRef<LetterInfo | null>(null)
  const solvedRef = useRef(false)
  const hasListenedRef = useRef(false)
  const lastLetterIdRef = useRef<string | null>(null)

  const applyOffset = useCallback((value: number) => {
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(0, ${value}px, 0)`
    }
  }, [])

  const handleSuccess = useCallback(() => {
    const letter = selectedRef.current
    if (!letter || solvedRef.current) return

    solvedRef.current = true
    setStatus('correct')
    setHeard('')
    setManualCheck(false)
    setMessage(`Молодец! Буква «${letter.upper}» — верно! +2 звезды`)
    addStars(2)
    learnLetter(letter.id)
    recordDrumWin()
    setSessionCorrect((count) => count + 1)
    play('win')
    celebrate({ count: 120 })
    speak(`Молодец! Это буква ${letter.name}!`)
  }, [addStars, celebrate, learnLetter, play, recordDrumWin, speak])

  const handleWrong = useCallback(
    (transcript: string) => {
      if (!selectedRef.current || solvedRef.current) return
      setStatus('wrong')
      setHeard(transcript)
      setMessage(
        transcript
          ? `Я услышал(а) «${transcript}». Попробуй ещё раз!`
          : 'Я не расслышал. Скажи громче и попробуй ещё раз!',
      )
      play('wrong')
    },
    [play],
  )

  const handleSpeechResult = useCallback(
    ({ transcript, alternatives }: SpeechResultPayload) => {
      const letter = selectedRef.current
      if (!letter || solvedRef.current) return

      const candidates =
        alternatives.length > 0 ? alternatives : [transcript]
      const matched = candidates.some((item) => matchesLetter(item, letter))

      if (matched) handleSuccess()
      else handleWrong(transcript || candidates[0] || '')
    },
    [handleSuccess, handleWrong],
  )

  const {
    supported: speechSupported,
    listening: speechListening,
    error: speechError,
    start: speechStart,
    stop: speechStop,
    reset: speechReset,
  } = useSpeechRecognition(handleSpeechResult)

  const startSpin = useCallback(() => {
    stopSpeaking()
    speechStop()
    speechReset()
    spinActiveRef.current = false
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    solvedRef.current = false
    selectedRef.current = null
    hasListenedRef.current = false
    setSelected(null)
    setPhase('spinning')
    setStatus('idle')
    setMessage('')
    setHeard('')
    setManualCheck(false)

    spinActiveRef.current = true
    lastTimeRef.current = performance.now()

    const tick = (now: number) => {
      if (!spinActiveRef.current) return
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now
      let next = offsetRef.current - SPIN_SPEED * delta
      if (next <= -CYCLE_HEIGHT) next += CYCLE_HEIGHT
      offsetRef.current = next
      applyOffset(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [applyOffset, speechReset, speechStop, stopSpeaking])

  const stopSpin = useCallback(() => {
    if (!spinActiveRef.current) return

    spinActiveRef.current = false
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setPhase('stopping')
    play('swoosh')
    stopSpeaking()

    let index = Math.floor(Math.random() * LETTERS.length)
    if (LETTERS.length > 1 && LETTERS[index].id === lastLetterIdRef.current) {
      index =
        (index + 1 + Math.floor(Math.random() * (LETTERS.length - 1))) %
        LETTERS.length
    }
    const letter = LETTERS[index]
    lastLetterIdRef.current = letter.id

    const from = offsetRef.current
    const baseTarget = (1 - (LETTERS.length + index)) * ITEM_HEIGHT
    const base = from - MIN_SPIN_TURNS * CYCLE_HEIGHT
    const residue = baseTarget % CYCLE_HEIGHT
    const distance =
      ((base - residue) % CYCLE_HEIGHT + CYCLE_HEIGHT) % CYCLE_HEIGHT
    const target = base - distance
    const duration = 2800 + Math.random() * 600
    const startedAt = performance.now()

    const tick = (now: number) => {
      const time = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - time, 4)
      applyOffset(from + (target - from) * eased)

      if (time < 1) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      rafRef.current = null
      const normalized = target % CYCLE_HEIGHT
      offsetRef.current = normalized
      applyOffset(normalized)
      selectedRef.current = letter
      setSelected(letter)
      setPhase('result')
      setStatus('idle')
      setMessage('')
      setHeard('')
      setManualCheck(false)
      play('star')
      speak('Выпала буква! Назови её вслух!')
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [applyOffset, play, speak, stopSpeaking])

  useEffect(() => {
    offsetRef.current = -Math.random() * CYCLE_HEIGHT
    applyOffset(offsetRef.current)
    startSpin()

    return () => {
      spinActiveRef.current = false
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [applyOffset, startSpin])

  useEffect(() => {
    if (!speechSupported) setManualCheck(true)
  }, [speechSupported])

  useEffect(() => {
    if (!speechError) return
    setStatus('idle')
    setMessage(speechError)
    setManualCheck(true)
  }, [speechError])

  useEffect(() => {
    if (speechListening) {
      hasListenedRef.current = true
      return
    }
    if (!hasListenedRef.current || status !== 'listening' || speechError) {
      return
    }

    hasListenedRef.current = false
    const timer = window.setTimeout(() => {
      setStatus('idle')
      setMessage('Я не расслышал. Скажи громче и попробуй ещё раз!')
    }, 400)
    return () => window.clearTimeout(timer)
  }, [speechError, speechListening, status])

  const handleMic = () => {
    if (!selected || status === 'correct') return

    if (speechListening) {
      speechStop()
      setStatus('idle')
      return
    }

    stopSpeaking()
    hasListenedRef.current = false
    setStatus('listening')
    setMessage('')
    setHeard('')
    setManualCheck(false)
    speechReset()
    speechStart()
  }

  const listenToLetter = () => {
    if (!selected) return
    speechStop()
    stopSpeaking()
    play('tap')
    speak(selected.name)
  }

  const listenToRhyme = () => {
    if (!selected) return
    speechStop()
    stopSpeaking()
    play('tap')
    speak(selected.rhyme.replace('\n', ' '))
  }

  const tryAgain = () => {
    speechStop()
    setStatus('idle')
    setMessage('')
    setHeard('')
    setManualCheck(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold text-ink-soft transition hover:text-ink"
        >
          <span aria-hidden="true">←</span> Игры
        </Link>
        <div className="flex items-center gap-2">
          <span className="chip bg-sun/30 text-ink">
            <span aria-hidden="true">🎤</span> верно: {sessionCorrect}
          </span>
          <span className="chip bg-white/80 text-ink-soft">
            <span aria-hidden="true">⭐</span> {progress.stars}
          </span>
        </div>
      </div>

      <section className="card-surface overflow-hidden p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="chip bg-sun/25 text-[#B45309]">
              <span aria-hidden="true">🥁</span> новая игра
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              Барабан букв
            </h1>
            <p className="mt-1 max-w-xl text-sm font-semibold text-ink-soft">
              Крути барабан, жми «Стоп» и называй выпавшую букву вслух. Буквик
              проверит!
            </p>
          </div>
          <div
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-[linear-gradient(135deg,#FFD166,#F59E0B)] text-3xl shadow-sticker"
          >
            🥁
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div
              aria-hidden="true"
              className="relative mx-auto w-full max-w-[20rem] overflow-hidden rounded-[2rem] border-2 border-white bg-[#FFFDF8] shadow-inner"
              style={{ height: ITEM_HEIGHT * WINDOW_ITEMS }}
            >
              <div
                ref={stripRef}
                className="absolute inset-x-0 top-0 will-change-transform"
              >
                {REEL.map((letter, index) => (
                  <div
                    key={`${letter.id}-${index}`}
                    className="flex items-center justify-center"
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <span
                      style={letterStyle(letter)}
                      className="letter-gradient flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-white text-2xl font-black text-white shadow-sticker"
                    >
                      {letter.upper}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-3xl border-2 border-dashed border-sun/80 bg-white/10"
                style={{ height: ITEM_HEIGHT }}
              />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#FFFDF8] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#FFFDF8] to-transparent" />
              <span className="pointer-events-none absolute top-1/2 left-1 -translate-y-1/2 text-xl text-coral">
                ▶
              </span>
              <span className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-xl text-coral">
                ◀
              </span>
            </div>

            <button
              type="button"
              onClick={phase === 'result' ? startSpin : stopSpin}
              disabled={phase === 'stopping'}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full border-b-4 px-6 py-3.5 text-base font-black text-white shadow-sticker transition-all duration-200 active:translate-y-0 active:border-b-2 disabled:cursor-wait disabled:opacity-75 ${
                phase === 'spinning'
                  ? 'border-[#D94A68] bg-[linear-gradient(135deg,#FF8A8A,#FF5D8F)] hover:-translate-y-0.5'
                  : phase === 'stopping'
                    ? 'border-[#6E5C85] bg-[linear-gradient(135deg,#B9A7D0,#8E7AA8)]'
                    : 'border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)] hover:-translate-y-0.5'
              }`}
            >
              <span aria-hidden="true">
                {phase === 'spinning'
                  ? '🛑'
                  : phase === 'stopping'
                    ? '⏳'
                    : '🔁'}
              </span>
              {phase === 'spinning'
                ? 'Стоп'
                : phase === 'stopping'
                  ? 'Останавливаем...'
                  : 'Крутить ещё'}
            </button>
            <p className="mt-2 text-center text-xs font-bold text-ink-soft">
              Нажми «Стоп» — и барабан плавно остановится на случайной букве.
            </p>
          </div>

          {selected ? (
            <div className="rounded-[2rem] border-2 border-white bg-[#FFF6E3] p-5 shadow-sticker">
              <p className="text-center text-[11px] font-extrabold tracking-wide text-ink-soft uppercase">
                тебе выпала буква
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <span
                  style={letterStyle(selected)}
                  className="letter-gradient flex h-24 w-24 shrink-0 items-baseline justify-center gap-0.5 rounded-[1.75rem] border-4 border-white pt-5 text-5xl font-black text-white shadow-sticker"
                >
                  {selected.upper}
                  <span className="text-3xl opacity-80">{selected.lower}</span>
                </span>
                <div className="min-w-0 text-center sm:text-left">
                  <h2 className="font-display text-3xl font-bold text-ink">
                    Буква {selected.upper}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-ink-soft">
                    {selected.emoji} {selected.word} ·{' '}
                    {KIND_LABEL[selected.kind]}
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <button
                      type="button"
                      onClick={listenToLetter}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-white px-3 py-1.5 text-xs font-black text-ink shadow-sm transition hover:-translate-y-0.5"
                    >
                      <span aria-hidden="true">🔊</span> Послушать
                    </button>
                    <button
                      type="button"
                      onClick={listenToRhyme}
                      className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-white/70 px-3 py-1.5 text-xs font-black text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:text-ink"
                    >
                      <span aria-hidden="true">📖</span> Стишок
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/70 p-3">
                <p className="text-center text-sm font-black text-ink">
                  Скажи букву вслух
                </p>
                <p className="mt-0.5 text-center text-xs font-semibold text-ink-soft">
                  Нажми на микрофон и произнеси «{selected.name}».
                </p>

                {speechSupported ? (
                  <button
                    type="button"
                    onClick={handleMic}
                    disabled={status === 'correct'}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full border-b-4 px-5 py-3 text-sm font-black text-white shadow-sticker transition-all duration-200 active:translate-y-0 active:border-b-2 ${
                      status === 'correct'
                        ? 'border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)]'
                        : status === 'listening'
                          ? 'animate-pulse-soft border-[#B45309] bg-[linear-gradient(135deg,#FBBF24,#F59E0B)]'
                          : 'border-[#D94A68] bg-[linear-gradient(135deg,#FF8A8A,#FF5D8F)] hover:-translate-y-0.5'
                    }`}
                  >
                    <span aria-hidden="true">
                      {status === 'correct'
                        ? '✅'
                        : status === 'listening'
                          ? '🎙️'
                          : '🎤'}
                    </span>
                    {status === 'correct'
                      ? 'Верно!'
                      : status === 'listening'
                        ? 'Слушаю...'
                        : 'Сказать букву'}
                  </button>
                ) : (
                  <p className="mt-3 rounded-2xl bg-sun/20 px-3 py-2 text-center text-xs font-bold text-ink-soft">
                    Этот браузер не умеет слушать. Скажи букву вслух, а взрослый
                    проверит.
                  </p>
                )}

                <div
                  className="mt-2 min-h-[2.5rem] text-center"
                  aria-live="polite"
                >
                  {status === 'listening' && (
                    <p className="text-xs font-bold text-[#B45309]">
                      Говори громко и чётко...
                    </p>
                  )}
                  {status === 'correct' && (
                    <p className="animate-pop inline-flex rounded-2xl bg-mint/25 px-3 py-2 text-xs font-black text-[#0F766E]">
                      🎉 {message}
                    </p>
                  )}
                  {status === 'wrong' && (
                    <p className="animate-pop inline-flex rounded-2xl bg-coral/15 px-3 py-2 text-xs font-black text-[#D94A68]">
                      💡 {message}
                    </p>
                  )}
                  {status === 'idle' && message && (
                    <p className="text-xs font-bold text-ink-soft">{message}</p>
                  )}
                </div>

                {speechSupported &&
                  status !== 'correct' &&
                  status !== 'listening' &&
                  !manualCheck && (
                    <button
                      type="button"
                      onClick={() => setManualCheck(true)}
                      className="mx-auto mt-1 block text-[11px] font-extrabold text-ink-soft underline decoration-dotted underline-offset-2 transition hover:text-ink"
                    >
                      Не слышит микрофон? Проверить вручную
                    </button>
                  )}

                {manualCheck && status !== 'correct' && (
                  <div className="mt-3 rounded-2xl border-2 border-dashed border-sun/70 bg-white/80 p-3">
                    <p className="text-xs font-bold text-ink-soft">
                      Скажи букву вслух. Взрослый может проверить:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSuccess}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#14B8A6] px-4 py-2 text-xs font-black text-white shadow-sticker transition hover:-translate-y-0.5"
                      >
                        <span aria-hidden="true">✅</span> Верно
                      </button>
                      <button
                        type="button"
                        onClick={tryAgain}
                        className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-white px-4 py-2 text-xs font-black text-ink shadow-sm transition hover:-translate-y-0.5"
                      >
                        <span aria-hidden="true">🔄</span> Ещё раз
                      </button>
                    </div>
                  </div>
                )}

                {status === 'wrong' && heard && (
                  <p className="mt-2 text-center text-[11px] font-bold text-ink-soft">
                    Услышано: «{heard}»
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-[2rem] border-2 border-white bg-white/60 p-6 text-center">
              <Mascot className="w-28" />
              <p className="mt-3 font-display text-xl font-bold text-ink">
                Лови букву!
              </p>
              <p className="mt-1 max-w-xs text-sm font-semibold text-ink-soft">
                Барабан уже крутится. Нажми «Стоп», когда захочешь остановить
                его.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] font-extrabold text-ink-soft">
                <span className="chip bg-white/80">1. Крутится</span>
                <span className="chip bg-white/80">2. Стоп</span>
                <span className="chip bg-white/80">3. Скажи</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
