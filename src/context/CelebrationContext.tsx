/* oxlint-disable react/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

type CelebrateOptions = {
  count?: number
  x?: number
  y?: number
}

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  spin: number
  shape: 'rect' | 'circle' | 'star'
  wobble: number
}

const COLORS = [
  '#FF6B6B',
  '#FFC53D',
  '#3DDC97',
  '#4CC9F0',
  '#9B5DE5',
  '#FF8FAB',
  '#A7E04A',
  '#FF9F1C',
]

type CelebrationContextValue = {
  celebrate: (options?: CelebrateOptions) => void
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null)

function drawStar(
  context: CanvasRenderingContext2D,
  radius: number,
) {
  context.beginPath()
  for (let point = 0; point < 5; point += 1) {
    const outerAngle = (point * 2 * Math.PI) / 5 - Math.PI / 2
    const innerAngle = outerAngle + Math.PI / 5
    const outerX = Math.cos(outerAngle) * radius
    const outerY = Math.sin(outerAngle) * radius
    const innerX = Math.cos(innerAngle) * radius * 0.45
    const innerY = Math.sin(innerAngle) * radius * 0.45
    if (point === 0) context.moveTo(outerX, outerY)
    else context.lineTo(outerX, outerY)
    context.lineTo(innerX, innerY)
  }
  context.closePath()
}

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const piecesRef = useRef<Piece[]>([])
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef(0)
  const dprRef = useRef(1)

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) return
    lastTimeRef.current = performance.now()

    const tick = (now: number) => {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) {
        rafRef.current = null
        return
      }

      const dpr = dprRef.current
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.05)
      lastTimeRef.current = now

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      const alive: Piece[] = []
      for (const piece of piecesRef.current) {
        piece.vy += 1150 * delta
        piece.vx *= 0.995
        piece.vy *= 0.998
        piece.x += piece.vx * delta
        piece.y += piece.vy * delta
        piece.rotation += piece.spin * delta
        piece.wobble += delta * 6

        if (piece.y > height + 40 || piece.x < -80 || piece.x > width + 80) {
          continue
        }
        alive.push(piece)

        context.save()
        context.translate(piece.x, piece.y)
        context.rotate(piece.rotation + Math.sin(piece.wobble) * 0.2)
        context.fillStyle = piece.color
        if (piece.shape === 'circle') {
          context.beginPath()
          context.arc(0, 0, piece.size / 2, 0, Math.PI * 2)
          context.fill()
        } else if (piece.shape === 'star') {
          drawStar(context, piece.size / 1.7)
          context.fill()
        } else {
          context.fillRect(
            -piece.size / 2,
            -piece.size / 3,
            piece.size,
            piece.size * 0.66,
          )
        }
        context.restore()
      }

      piecesRef.current = alive

      if (alive.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        context.clearRect(0, 0, width, height)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const celebrate = useCallback(
    (options?: CelebrateOptions) => {
      if (
        typeof window === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      const canvas = canvasRef.current
      if (!canvas) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      dprRef.current = dpr
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)

      const count = options?.count ?? 90
      const originX = options?.x ?? window.innerWidth / 2
      const originY = options?.y ?? window.innerHeight * 0.38

      for (let index = 0; index < count; index += 1) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2
        const speed = 380 + Math.random() * 720
        piecesRef.current.push({
          x: originX + (Math.random() - 0.5) * 80,
          y: originY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 7 + Math.random() * 9,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 14,
          shape:
            Math.random() < 0.18
              ? 'star'
              : Math.random() < 0.5
                ? 'circle'
                : 'rect',
          wobble: Math.random() * 10,
        })
      }

      startLoop()
    },
    [startLoop],
  )

  const value = useMemo(() => ({ celebrate }), [celebrate])

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
      />
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const context = useContext(CelebrationContext)
  if (!context) {
    throw new Error('useCelebration должен использоваться внутри CelebrationProvider')
  }
  return context
}
