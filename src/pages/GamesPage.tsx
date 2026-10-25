import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { usePageTitle } from '../lib/usePageTitle'

const GAMES = [
  {
    to: '/games/find',
    icon: '🔎',
    badge: '10 вопросов',
    title: 'Найди букву',
    description:
      'Посмотри на картинку и выбери букву, с которой начинается слово.',
    bg: 'bg-[#FFE7E7]',
    accent: 'text-[#D94A68]',
    chip: 'bg-coral/15',
    button: 'bg-[#FF6B6B]',
    decor: ['А', 'Б', 'В'],
  },
  {
    to: '/games/build',
    icon: '🧩',
    badge: '6 слов',
    title: 'Собери слово',
    description:
      'Поставь буквы по порядку, чтобы получилось название картинки.',
    bg: 'bg-[#DEFBF0]',
    accent: 'text-[#0F766E]',
    chip: 'bg-mint/20',
    button: 'bg-[#14B8A6]',
    decor: ['К', 'О', 'Т'],
  },
  {
    to: '/games/memory',
    icon: '🎴',
    badge: '6 пар',
    title: 'Найди пару',
    description:
      'Открывай карточки и соединяй заглавную букву со строчной.',
    bg: 'bg-[#F0E7FF]',
    accent: 'text-grape',
    chip: 'bg-grape/15',
    button: 'bg-[#9B5DE5]',
    decor: ['А', 'а', '★'],
  },
  {
    to: '/games/drum',
    icon: '🥁',
    badge: '33 буквы',
    title: 'Барабан букв',
    description:
      'Крути барабан, останавливай его и называй выпавшую букву вслух — Буквик проверит.',
    bg: 'bg-[#FFF3D6]',
    accent: 'text-[#B45309]',
    chip: 'bg-sun/25',
    button: 'bg-[#F59E0B]',
    decor: ['Б', 'А', 'Я'],
  },
]

export function GamesPage() {
  const { progress } = useProgress()
  const { play } = useSound()
  usePageTitle('Игры')

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2.25rem] border-2 border-white bg-white/65 p-5 shadow-sticker sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-14 right-8 h-40 w-40 rounded-full bg-mint/25 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-16 left-16 h-40 w-40 rounded-full bg-grape/20 blur-2xl"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="chip bg-mint/20 text-[#0F766E]">
              <span aria-hidden="true">🎮</span> игровая комната
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              Играем и запоминаем
            </h1>
            <p className="mt-1.5 max-w-xl text-sm font-semibold text-ink-soft sm:text-base">
              Четыре весёлые игры помогут выучить буквы без зубрёжки. За каждый
              правильный ответ — звёздочка!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-3xl border-2 border-white bg-white/85 px-4 py-3 text-center shadow-sticker">
              <div className="text-2xl leading-none font-black text-ink">
                {progress.quizBest}
                <span className="text-sm text-ink-soft">/10</span>
              </div>
              <div className="mt-1 text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                рекорд
              </div>
            </div>
            <div className="rounded-3xl border-2 border-white bg-sun/80 px-4 py-3 text-center shadow-sticker">
              <div className="text-2xl leading-none font-black text-ink">
                {progress.stars}
              </div>
              <div className="mt-1 text-[10px] font-extrabold tracking-wide text-ink/70 uppercase">
                звёзд
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {GAMES.map((game) => {
          const stat =
            game.to === '/games/find'
              ? `Лучший результат: ${progress.quizBest}/10`
              : game.to === '/games/build'
                ? `Собрано слов: ${progress.wordsBuilt}`
                : game.to === '/games/memory'
                  ? `Побед: ${progress.memoryWins}`
                  : `Букв сказано: ${progress.drumWins}`

          return (
            <Link
              key={game.to}
              to={game.to}
              onClick={() => play('tap')}
              className={`group relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-white p-5 shadow-sticker transition-all duration-200 hover:-translate-y-1.5 hover:shadow-sticker-hover ${game.bg}`}
            >
              <div className="relative mb-4 flex h-32 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/70 bg-white/55">
                <span className="text-6xl drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                  {game.icon}
                </span>
                {game.decor.map((decor, index) => (
                  <span
                    key={decor}
                    aria-hidden="true"
                    className="absolute font-black text-ink/15"
                    style={{
                      top: [8, 70, 18][index],
                      left: [16, 42, 84][index],
                      fontSize: [26, 34, 22][index],
                      transform: `rotate(${[-12, 6, 18][index]}deg)`,
                    }}
                  >
                    {decor}
                  </span>
                ))}
                <span
                  className={`absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black ${game.accent}`}
                >
                  {game.badge}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold text-ink">
                {game.title}
              </h2>
              <p className="mt-1 flex-1 text-sm leading-snug font-semibold text-ink-soft">
                {game.description}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={`chip ${game.chip} ${game.accent}`}>
                  {stat}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-sticker transition-transform duration-200 group-hover:translate-x-1 ${game.button}`}
                >
                  →
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <section className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[2rem] border-2 border-white bg-[#FFF3D6] px-5 py-4 shadow-sticker sm:flex-row">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-white text-2xl shadow-sm"
          >
            🦉
          </span>
          <p className="text-sm font-bold text-ink-soft">
            <strong className="text-ink">Совет Буквика:</strong> играй по 10
            минут в день — так буквы запомнятся лучше всего!
          </p>
        </div>
        <Link
          to="/progress"
          onClick={() => play('tap')}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-black text-ink shadow-sticker transition hover:-translate-y-0.5"
        >
          <span aria-hidden="true">🏆</span> Мои награды
        </Link>
      </section>
    </div>
  )
}
