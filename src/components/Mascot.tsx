import { useId } from 'react'

type MascotProps = {
  className?: string
  withBook?: boolean
}

/** Совёнок Буквик — талисман азбуки. */
export function Mascot({ className = 'w-56', withBook = true }: MascotProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      role="img"
      aria-label="Совёнок Буквик"
    >
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B79CFF" />
          <stop offset="0.55" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id={`wing-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id={`belly-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="1" stopColor="#FFEAC2" />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="224" rx="60" ry="9" fill="#33254A" opacity="0.13" />

      <g className="animate-bob">
        <path d="M86 204c-4 10-2 16 8 16h12c-6-4-8-8-6-16z" fill="#FF9F1C" />
        <path d="M154 204c4 10 2 16-8 16h-12c6-4 8-8 6-16z" fill="#FFB938" />

        <path
          d="M62 116c-26 18-28 54-6 76 0-30 10-54 26-66z"
          fill={`url(#wing-${uid})`}
        />
        <path
          d="M178 116c26 18 28 54 6 76 0-30-10-54-26-66z"
          fill={`url(#wing-${uid})`}
        />

        <path d="M75 80 64 46l30 16z" fill="#8B5CF6" />
        <path d="M165 80l11-34-30 16z" fill="#8B5CF6" />

        <ellipse cx="120" cy="136" rx="70" ry="75" fill={`url(#body-${uid})`} />
        <ellipse cx="120" cy="154" rx="47" ry="52" fill={`url(#belly-${uid})`} />

        <g stroke="#F0DFFF" strokeWidth="2.6" fill="none" opacity="0.9">
          <path d="M88 150q10 7 20 0" />
          <path d="M132 150q10 7 20 0" />
          <path d="M92 168q9 6 18 0" />
          <path d="M130 168q9 6 18 0" />
        </g>

        <ellipse cx="75" cy="150" rx="11" ry="7" fill="#FF8FAB" opacity="0.65" />
        <ellipse cx="165" cy="150" rx="11" ry="7" fill="#FF8FAB" opacity="0.65" />

        <circle cx="95" cy="114" r="28" fill="#FFFDF8" />
        <circle cx="145" cy="114" r="28" fill="#FFFDF8" />

        <g
          className="animate-blink"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx="98" cy="117" r="13.5" fill="#33254A" />
          <circle cx="142" cy="117" r="13.5" fill="#33254A" />
          <circle cx="93" cy="111" r="4.6" fill="#fff" />
          <circle cx="137" cy="111" r="4.6" fill="#fff" />
          <circle cx="102" cy="121" r="2" fill="#fff" opacity="0.8" />
          <circle cx="146" cy="121" r="2" fill="#fff" opacity="0.8" />
        </g>

        <path
          d="M108 138q12-8 24 0l-12 17z"
          fill="#FF9F1C"
          stroke="#E07B00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {withBook && (
          <g transform="rotate(-3 120 190)">
            <path
              d="M76 176h40v28q-22-8-40-4z"
              fill="#FFC53D"
              stroke="#33254A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M164 176h-40v28q22-8 40-4z"
              fill="#FFB021"
              stroke="#33254A"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M120 176v24" stroke="#33254A" strokeWidth="3" />
            <text
              x="96"
              y="195"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#33254A"
              fontFamily="Nunito, sans-serif"
            >
              АБ
            </text>
            <text
              x="143"
              y="195"
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#33254A"
              fontFamily="Nunito, sans-serif"
            >
              ВГ
            </text>
          </g>
        )}

        <g transform="rotate(-7 120 44)">
          <rect x="78" y="42" width="84" height="13" rx="6.5" fill="#33254A" />
          <path d="M84 45 120 24l36 21z" fill="#4C1D95" />
          <circle cx="120" cy="23" r="4" fill="#FFC53D" />
          <path
            d="M155 46c18 4 20 18 12 30"
            stroke="#FFC53D"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="166" cy="79" r="5" fill="#FFC53D" />
        </g>

        <g fill="#FFC53D" className="animate-sparkle">
          <path d="M24 76l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          <path d="M214 112l2.4 5.6 5.6 2.4-5.6 2.4-2.4 5.6-2.4-5.6-5.6-2.4 5.6-2.4z" />
        </g>
      </g>
    </svg>
  )
}
