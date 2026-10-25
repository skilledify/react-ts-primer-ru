/* oxlint-disable react/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCelebration } from '../context/CelebrationContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import {
  getLetter,
  getPalette,
  KIND_LABEL,
  LETTERS,
  letterStyle,
} from '../data/letters'
import { usePageTitle } from '../lib/usePageTitle'

const BRUSH_COLORS = [
  { id: 'ink', value: '#33254A', label: 'Тёмно-фиолетовый' },
  { id: 'coral', value: '#FF6B6B', label: 'Красный' },
  { id: 'sun', value: '#FFB020', label: 'Оранжевый' },
  { id: 'mint', value: '#14B8A6', label: 'Зелёный' },
  { id: 'sky', value: '#3B82F6', label: 'Синий' },
  { id: 'grape', value: '#9B5DE5', label: 'Фиолетовый' },
  { id: 'rose', value: '#F43F8E', label: 'Розовый' },
]

const BRUSH_SIZES = [6, 12, 20]

export function TracingPage() {
  usePageTitle('Прописи')
  const [searchParams, setSearchParams] = useSearchParams()
  const selected = getLetter(searchParams.get('letter') ?? 'а') ?? LETTERS[0]
  const selectedIndex = LETTERS.findIndex((letter) => letter.id === selected.id)
  const previous = selectedIndex > 0 ? LETTERS[selectedIndex - 1] : null
  const next =
    selectedIndex < LETTERS.length - 1 ? LETTERS[selectedIndex + 1] : null

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  const [color, setColor] = useState(BRUSH_COLORS[0].value)
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1])
  const [erasing, setErasing] = useState(false)
  const [message, setMessage] = useState('')

  const { isLearned, learnLetter, addStars } = useProgress()
  const { speak, play } = useSound()
  const { celebrate } = useCelebration()
  const learned = isLearned(selected.id)
  const palette = getPalette(selected.palette)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return null
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const context = canvas.getContext('2d')
    if (!context) return null
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    return context
  }, [])

  useEffect(() => {
    setupCanvas()
    setMessage('')
    setErasing(false)

    const handleResize = () => setupCanvas()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selected.id, setupCanvas])

  const getPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
  }

  const startDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const context = event.currentTarget.getContext('2d')
    if (!context) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const point = getPoint(event)
    context.globalCompositeOperation = erasing ? 'destination-out' : 'source-over'
    context.strokeStyle = color
    context.lineWidth = erasing ? brushSize * 2.2 : brushSize
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.lineTo(point.x + 0.1, point.y + 0.1)
    context.stroke()
    drawingRef.current = true
    if (message) setMessage('')
  }

  const draw = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!context) return
    const point = getPoint(event)
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  const stopDrawing = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    drawingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    context.setTransform(1, 0, 0, 1, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    drawingRef.current = false
    setMessage('')
    play('swoosh')
  }

  const finish = () => {
    setMessage(
      learned
        ? `Молодец! Буква ${selected.upper} уже в твоей копилке.`
        : `Здорово! Буква ${selected.upper} выучена. +1 звезда!`,
    )
    if (!learned) {
      learnLetter(selected.id)
      addStars(1)
    }
    play('win')
    celebrate({ count: 130 })
    speak(`Молодец! Буква ${selected.name} выучена!`)
  }

  const selectLetter = (id: string) => {
    play('tap')
    setSearchParams({ letter: id }, { replace: true })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Link
          to={`/letter/${selected.id}`}
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold text-ink-soft transition hover:text-ink"
        >
          <span aria-hidden="true">←</span> К букве {selected.upper}
        </Link>
        <span className="chip bg-white/80 text-ink-soft">
          <span aria-hidden="true">✏️</span> рисуй пальцем или мышкой
        </span>
      </div>

      <section className="card-surface overflow-hidden p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="chip bg-sky/15 text-[#1D6FC0]">
              <span aria-hidden="true">✍️</span> прописи
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              Обведи букву {selected.upper}
            </h1>
            <p className="mt-1 text-sm font-semibold text-ink-soft">
              {selected.emoji} {selected.word} · {KIND_LABEL[selected.kind]}
            </p>
          </div>

          <div
            style={letterStyle(selected)}
            className="letter-gradient flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white text-3xl font-black text-white shadow-sticker"
            aria-hidden="true"
          >
            {selected.upper}
          </div>
        </div>

        <div className="scrollbar-hide -mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 py-2">
          {LETTERS.map((letter) => (
            <button
              key={letter.id}
              type="button"
              onClick={() => selectLetter(letter.id)}
              aria-pressed={letter.id === selected.id}
              aria-label={`Буква ${letter.upper}`}
              style={letterStyle(letter)}
              className={`letter-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-white text-base font-black text-white transition-all ${
                letter.id === selected.id
                  ? 'scale-110 ring-2 ring-ink ring-offset-2 ring-offset-paper'
                  : 'opacity-70 hover:scale-110 hover:opacity-100'
              }`}
            >
              {letter.upper}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <div>
            <div className="relative mx-auto aspect-square w-full max-w-[27rem] overflow-hidden rounded-[2rem] border-2 border-white bg-white shadow-inner">
              <svg
                viewBox="0 0 300 300"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                <line
                  x1="18"
                  y1="228"
                  x2="282"
                  y2="228"
                  stroke={palette.soft}
                  strokeWidth="2"
                  strokeDasharray="6 8"
                />
                <line
                  x1="18"
                  y1="78"
                  x2="282"
                  y2="78"
                  stroke={palette.soft}
                  strokeWidth="2"
                  strokeDasharray="6 8"
                />
                <text
                  x="150"
                  y="238"
                  textAnchor="middle"
                  fontSize="218"
                  fontWeight="900"
                  fontFamily="Nunito, Arial, sans-serif"
                  fill={palette.soft}
                  stroke={palette.to}
                  strokeWidth="2"
                  strokeDasharray="7 9"
                  opacity="0.85"
                >
                  {selected.upper}
                </text>
                <text
                  x="262"
                  y="282"
                  textAnchor="middle"
                  fontSize="44"
                  fontWeight="800"
                  fontFamily="Nunito, Arial, sans-serif"
                  fill={palette.soft}
                  opacity="0.9"
                >
                  {selected.lower}
                </text>
              </svg>

              <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                onPointerCancel={stopDrawing}
                aria-label={`Поле для рисования буквы ${selected.upper}`}
                className="absolute inset-0 h-full w-full touch-none"
              />
            </div>
            <p className="mt-2 text-center text-xs font-bold text-ink-soft">
              Обведи пунктирную букву, а потом попробуй нарисовать её сама или
              сам.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border-2 border-white bg-cream/70 p-4">
              <p className="text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                цвет
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BRUSH_COLORS.map((brush) => (
                  <button
                    key={brush.id}
                    type="button"
                    onClick={() => {
                      setColor(brush.value)
                      setErasing(false)
                      play('tap')
                    }}
                    aria-label={brush.label}
                    aria-pressed={color === brush.value && !erasing}
                    title={brush.label}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-sm transition hover:scale-110 ${
                      color === brush.value && !erasing
                        ? 'ring-2 ring-ink ring-offset-2 ring-offset-cream'
                        : ''
                    }`}
                    style={{ backgroundColor: brush.value }}
                  >
                    {color === brush.value && !erasing && (
                      <span
                        aria-hidden="true"
                        className="text-xs font-black text-white drop-shadow"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                толщина
              </p>
              <div className="mt-2 flex items-center gap-2">
                {BRUSH_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setBrushSize(size)
                      play('tap')
                    }}
                    aria-label={`Толщина ${size}`}
                    aria-pressed={brushSize === size}
                    className={`flex h-9 flex-1 items-center justify-center rounded-xl border-2 transition ${
                      brushSize === size
                        ? 'border-ink bg-white shadow-sticker'
                        : 'border-white bg-white/60 hover:bg-white'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="rounded-full bg-ink"
                      style={{ width: size, height: size }}
                    />
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setErasing((value) => !value)
                    play('tap')
                  }}
                  aria-pressed={erasing}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2 text-xs font-black transition ${
                    erasing
                      ? 'border-ink bg-ink text-white'
                      : 'border-white bg-white/70 text-ink hover:bg-white'
                  }`}
                >
                  <span aria-hidden="true">🧽</span> Ластик
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-white bg-white/70 px-3 py-2 text-xs font-black text-ink transition hover:bg-white"
                >
                  <span aria-hidden="true">🧹</span> Очистить
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={finish}
              className="flex w-full items-center justify-center gap-2 rounded-full border-b-4 border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)] px-5 py-3.5 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:border-b-2"
            >
              <span aria-hidden="true">🌟</span> Готово! Я обвёл букву
            </button>

            <div className="min-h-[3rem] text-center" aria-live="polite">
              {message && (
                <p className="animate-pop inline-flex rounded-2xl bg-sun/25 px-4 py-2 text-xs font-black text-ink">
                  {message}
                </p>
              )}
              {!message && learned && (
                <p className="text-xs font-bold text-[#0F766E]">
                  ⭐ Буква уже выучена — можно потренироваться ещё раз.
                </p>
              )}
            </div>

            <div className="rounded-3xl border-2 border-white bg-[#FFF6E3] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="chip bg-sun/30 text-ink">
                  <span aria-hidden="true">📖</span> стишок
                </span>
                <button
                  type="button"
                  onClick={() => {
                    play('tap')
                    speak(selected.rhyme.replace('\n', ' '))
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-sticker transition hover:scale-110 active:scale-95"
                  aria-label="Прочитать стишок вслух"
                  title="Прочитать стишок вслух"
                >
                  <span aria-hidden="true">🔊</span>
                </button>
              </div>
              <p className="mt-2 font-hand text-xl leading-snug font-bold whitespace-pre-line text-ink">
                {selected.rhyme}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2">
              {previous ? (
                <Link
                  to={`/write?letter=${previous.id}`}
                  className="flex items-center gap-1.5 rounded-full border-2 border-white bg-white/70 px-3.5 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5"
                >
                  <span aria-hidden="true">←</span> {previous.upper}
                </Link>
              ) : (
                <span />
              )}
              <Link
                to={`/letter/${selected.id}`}
                className="rounded-full px-3 py-2 text-xs font-extrabold text-ink-soft transition hover:text-ink"
              >
                Страница буквы
              </Link>
              {next ? (
                <Link
                  to={`/write?letter=${next.id}`}
                  className="flex items-center gap-1.5 rounded-full border-2 border-white bg-white/70 px-3.5 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5"
                >
                  {next.upper} <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </div>
        </div>
      </section>

      <p className="mx-auto mt-4 max-w-lg text-center text-xs font-bold text-ink-soft">
        <span aria-hidden="true">💡</span> Совет: начинай сверху и веди линию
        плавно, как будто рисуешь радугу.
      </p>
    </div>
  )
}
