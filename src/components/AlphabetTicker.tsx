import { getPalette, LETTERS } from '../data/letters'

/**
 * Бегущая строка из всех 33 букв.
 * Две одинаковые группы дают бесшовный цикл: сдвиг на -50% возвращает
 * первую группу на место второй.
 */
export function AlphabetTicker() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-b-2 border-white/70 bg-white/55 py-2 select-none"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-cream to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cream to-transparent sm:w-16" />
      <div className="alphabet-ticker-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-1.5 pr-1.5">
            {LETTERS.map((letter) => {
              const palette = getPalette(letter.palette)
              return (
                <span
                  key={`${copy}-${letter.id}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base font-black shadow-sm"
                  style={{
                    backgroundColor: palette.soft,
                    color: palette.to,
                  }}
                >
                  {letter.upper}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
