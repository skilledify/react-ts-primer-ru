import { Link } from 'react-router-dom'
import { letterStyle, type LetterInfo } from '../data/letters'
import { useSound } from '../context/SoundContext'

type LetterTileProps = {
  letter: LetterInfo
  learned?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: 'text-3xl sm:text-4xl',
  md: 'text-4xl sm:text-5xl',
  lg: 'text-6xl sm:text-7xl',
}

export function LetterTile({
  letter,
  learned = false,
  className = '',
  size = 'md',
}: LetterTileProps) {
  const { play } = useSound()

  return (
    <Link
      to={`/letter/${letter.id}`}
      onClick={() => play('tap')}
      style={letterStyle(letter)}
      aria-label={`Буква ${letter.upper}, ${letter.word}`}
      className={`letter-gradient group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-white/70 text-white shadow-sticker transition-all duration-200 hover:-translate-y-1.5 hover:rotate-[-1.5deg] hover:shadow-sticker-hover active:translate-y-0 active:scale-95 ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/25 blur-md transition-transform duration-500 group-hover:scale-125"
      />

      {learned && (
        <span
          className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-sm"
          title="Буква выучена"
        >
          ⭐
        </span>
      )}

      <span className={`flex items-baseline leading-none ${SIZES[size]}`}>
        <span className="font-black drop-shadow-[0_3px_0_rgba(51,37,74,0.15)]">
          {letter.upper}
        </span>
        <span className="text-[0.58em] font-extrabold opacity-75">
          {letter.lower}
        </span>
      </span>

      <span className="mt-1.5 flex max-w-[92%] items-center gap-1 text-[11px] leading-none font-extrabold opacity-95 sm:text-xs">
        <span aria-hidden="true" className="text-sm sm:text-base">
          {letter.emoji}
        </span>
        <span className="truncate">{letter.word}</span>
      </span>
    </Link>
  )
}
