import { useId, type ReactNode } from 'react'

type ProgressRingProps = {
  value: number
  max: number
  size?: number
  stroke?: number
  children?: ReactNode
  className?: string
}

export function ProgressRing({
  value,
  max,
  size = 132,
  stroke = 13,
  children,
  className = '',
}: ProgressRingProps) {
  const uid = useId().replace(/:/g, '')
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = Math.max(0, Math.min(1, max ? value / max : 0))
  const offset = circumference * (1 - ratio)

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Прогресс: ${value} из ${max}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFC53D" />
            <stop offset="0.5" stopColor="#FF6B6B" />
            <stop offset="1" stopColor="#9B5DE5" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F0E5D6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${uid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}
