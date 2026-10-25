import { Link } from 'react-router-dom'
import { FloatingLetters } from '../components/FloatingLetters'
import { LetterTile } from '../components/LetterTile'
import { Mascot } from '../components/Mascot'
import { ProgressRing } from '../components/ProgressRing'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import {
  getPalette,
  LETTERS,
  letterStyle,
  STARTING_LETTERS,
  type LetterInfo,
} from '../data/letters'

const FEATURES = [
  {
    to: '/alphabet',
    icon: '🔤',
    title: 'Азбука',
    text: '33 буквы с картинками, стихами и озвучкой.',
    bg: 'bg-[#FFE7E7]',
    button: 'bg-[#FF6B6B]',
  },
  {
    to: '/games',
    icon: '🎮',
    title: 'Мини-игры',
    text: 'Найди букву, собери слово, найди пару и раскрути барабан.',
    bg: 'bg-[#DEFBF0]',
    button: 'bg-[#14B8A6]',
  },
  {
    to: '/write',
    icon: '✏️',
    title: 'Прописи',
    text: 'Обведи букву пальцем или мышкой и получи звезду.',
    bg: 'bg-[#DFF1FF]',
    button: 'bg-[#3B82F6]',
  },
  {
    to: '/progress',
    icon: '🏆',
    title: 'Награды',
    text: 'Копи звёзды и открывай весёлые медали.',
    bg: 'bg-[#F0E7FF]',
    button: 'bg-[#9B5DE5]',
  },
]

function getLetterOfTheDay(): LetterInfo {
  const dayNumber = Math.floor(Date.now() / 86_400_000)
  return STARTING_LETTERS[dayNumber % STARTING_LETTERS.length]
}

function Hero() {
  const { speak, play } = useSound()

  return (
    <section className="relative overflow-hidden rounded-[2.75rem] border-2 border-white bg-[radial-gradient(circle_at_15%_20%,#FFF3D0_0%,transparent_55%),radial-gradient(circle_at_85%_15%,#E9DDFF_0%,transparent_50%),radial-gradient(circle_at_70%_90%,#D8F8EC_0%,transparent_55%)] bg-white/70 px-5 py-9 shadow-soft sm:px-9 sm:py-12 lg:px-14">
      <FloatingLetters />

      <div className="relative grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <span className="chip border-2 border-white bg-white/80 text-ink shadow-sticker">
            <span aria-hidden="true">🎈</span> для детей 3–6 лет
          </span>

          <h1 className="mt-5 font-display text-5xl leading-[1.03] font-bold text-ink sm:text-6xl lg:text-7xl">
            Весёлый{' '}
            <span className="relative mt-1 block w-fit bg-[linear-gradient(100deg,#FF6B6B,#9B5DE5_55%,#3B82F6)] bg-clip-text text-transparent lg:mx-0">
              букварь
              <svg
                viewBox="0 0 220 14"
                aria-hidden="true"
                className="absolute -bottom-2 left-0 w-full text-sun"
              >
                <path
                  d="M3 9c40-7 90-8 128-4 25 2 55 1 85-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-md text-base leading-relaxed font-bold text-ink-soft sm:text-lg lg:mx-0">
            33 буквы, весёлые стихи и игры. Учимся читать вместе с совёнком
            Буквиком!
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              to="/alphabet"
              onClick={() => play('tap')}
              className="group inline-flex items-center gap-2 rounded-full border-b-4 border-[#D94A68] bg-[linear-gradient(135deg,#FF8A8A,#FF5D8F)] px-7 py-3.5 text-base font-black text-white shadow-sticker transition-all duration-200 hover:-translate-y-1 hover:shadow-sticker-hover active:translate-y-0 active:border-b-2"
            >
              Начать учиться
              <span
                aria-hidden="true"
                className="text-lg transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              to="/games"
              onClick={() => play('tap')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/85 px-6 py-3.5 text-base font-black text-ink shadow-sticker transition-all duration-200 hover:-translate-y-1 hover:bg-white active:translate-y-0"
            >
              <span aria-hidden="true">🎮</span> Поиграть
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-extrabold text-ink-soft lg:justify-start">
            <span className="flex items-center gap-1.5">
              <strong className="text-lg font-black text-ink">33</strong> буквы
            </span>
            <span aria-hidden="true" className="text-ink/20">
              •
            </span>
            <span className="flex items-center gap-1.5">
              <strong className="text-lg font-black text-ink">4</strong> игры
            </span>
            <span aria-hidden="true" className="text-ink/20">
              •
            </span>
            <span className="flex items-center gap-1.5">
              <strong className="text-lg font-black text-ink">33</strong> стишка
            </span>
            <span aria-hidden="true" className="hidden text-ink/20 sm:inline">
              •
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <span aria-hidden="true">🔊</span> озвучка
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[21rem] sm:max-w-sm">
          <span
            aria-hidden="true"
            className="absolute inset-6 rounded-full bg-sun/30 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="absolute top-8 left-8 h-24 w-24 animate-float rounded-full bg-coral/20"
          />
          <span
            aria-hidden="true"
            className="absolute right-6 bottom-10 h-16 w-16 animate-float-slow rounded-full bg-mint/30"
          />

          <Mascot className="relative mx-auto w-64 drop-shadow-[0_22px_26px_rgba(51,37,74,0.18)] sm:w-80" />

          <button
            type="button"
            onClick={() => {
              play('tap')
              speak('Привет! Я совёнок Буквик. Пойдём учить буквы!')
            }}
            className="absolute top-0 left-0 max-w-[11.5rem] -rotate-3 rounded-3xl rounded-bl-md border-2 border-white bg-white/95 px-4 py-3 text-left text-xs font-extrabold text-ink shadow-soft transition hover:rotate-0 hover:scale-105 active:scale-95 sm:left-2"
            aria-label="Буквик говорит: Привет! Пойдём учить буквы"
          >
            Привет! Я Буквик. Пойдём учить буквы?
            <span className="mt-1 block text-[10px] font-bold text-ink-soft">
              нажми, чтобы услышать 🔊
            </span>
          </button>

          <span
            aria-hidden="true"
            className="absolute top-24 -right-1 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl border-2 border-white bg-[linear-gradient(145deg,#FFD166,#FF9F1C)] text-2xl font-black text-white shadow-sticker"
            style={{ animation: 'float 6s ease-in-out 0.7s infinite' }}
          >
            А
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-14 -left-2 flex h-11 w-11 -rotate-6 items-center justify-center rounded-2xl border-2 border-white bg-[linear-gradient(145deg,#7DD3FC,#3B82F6)] text-xl font-black text-white shadow-sticker"
            style={{ animation: 'float 7s ease-in-out 0.2s infinite' }}
          >
            Б
          </span>
          <span
            aria-hidden="true"
            className="absolute right-2 bottom-2 flex h-10 w-10 rotate-12 items-center justify-center rounded-2xl border-2 border-white bg-[linear-gradient(145deg,#5EEAD4,#14B8A6)] text-lg font-black text-white shadow-sticker"
            style={{ animation: 'float 8s ease-in-out 1.2s infinite' }}
          >
            В
          </span>
        </div>
      </div>
    </section>
  )
}

function ContinueCard() {
  const { progress } = useProgress()
  const nextLetter = LETTERS.find(
    (letter) => !progress.learned.includes(letter.id),
  )
  const learnedCount = progress.learned.filter((id) =>
    LETTERS.some((letter) => letter.id === id),
  ).length

  return (
    <section className="card-surface flex flex-col items-center gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
      <ProgressRing value={learnedCount} max={LETTERS.length} size={118}>
        <span className="text-3xl leading-none font-black text-ink">
          {learnedCount}
        </span>
        <span className="mt-1 text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
          из 33
        </span>
      </ProgressRing>

      <div className="flex-1 text-center sm:text-left">
        <span className="chip bg-sun/25 text-ink">
          <span aria-hidden="true">🌟</span> твой прогресс
        </span>
        <h2 className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">
          {learnedCount === 0
            ? 'Начнём с буквы А!'
            : learnedCount === LETTERS.length
              ? 'Ух ты! Все 33 буквы выучены!'
              : `Выучено ${learnedCount} из 33 букв`}
        </h2>
        <p className="mt-1 text-sm font-semibold text-ink-soft">
          {progress.stars > 0
            ? `В копилке ${progress.stars} ${progress.stars === 1 ? 'звезда' : progress.stars < 5 ? 'звезды' : 'звёзд'}. Продолжаем?`
            : 'Открывай буквы, играй и собирай звёзды.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {nextLetter ? (
            <Link
              to={`/letter/${nextLetter.id}`}
              style={letterStyle(nextLetter)}
              className="letter-gradient inline-flex items-center gap-2 rounded-full border-2 border-white px-4 py-2 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
            >
              Продолжить: {nextLetter.upper}
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              to="/games"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5"
            >
              Играть <span aria-hidden="true">🎮</span>
            </Link>
          )}
          <Link
            to="/alphabet"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-extrabold text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            Вся азбука
          </Link>
        </div>
      </div>

      {nextLetter && (
        <div className="hidden shrink-0 sm:block">
          <p className="mb-1.5 text-center text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
            следующая
          </p>
          <div className="w-20">
            <LetterTile letter={nextLetter} size="sm" />
          </div>
        </div>
      )}
    </section>
  )
}

function LetterOfTheDay() {
  const letter = getLetterOfTheDay()
  const { speak, play } = useSound()
  const palette = getPalette(letter.palette)

  return (
    <section className="card-surface relative overflow-hidden p-5 sm:p-6">
      <span
        aria-hidden="true"
        className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: palette.from }}
      />
      <div className="relative">
        <span className="chip bg-grape/12 text-grape">
          <span aria-hidden="true">🎁</span> буква дня
        </span>

        <div className="mt-3 flex items-start gap-4">
          <Link
            to={`/letter/${letter.id}`}
            style={letterStyle(letter)}
            aria-label={`Открыть букву ${letter.upper}`}
            className="letter-gradient flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl border-2 border-white text-white shadow-sticker transition hover:-translate-y-1 hover:rotate-3 sm:h-24 sm:w-24"
          >
            <span className="text-4xl leading-none font-black drop-shadow-[0_3px_0_rgba(51,37,74,0.15)] sm:text-5xl">
              {letter.upper}
            </span>
            <span className="mt-0.5 text-[10px] font-extrabold opacity-90">
              {letter.lower}
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold text-ink">
              {letter.emoji} {letter.word}
            </h2>
            <p className="mt-1.5 text-sm leading-snug font-semibold whitespace-pre-line text-ink-soft">
              {letter.rhyme}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              play('tap')
              speak(`${letter.name}. ${letter.word}`)
            }}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-cream px-3.5 py-2 text-xs font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-sun/30 active:translate-y-0"
          >
            <span aria-hidden="true">🔊</span> Послушать
          </button>
          <Link
            to={`/letter/${letter.id}`}
            onClick={() => play('tap')}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            Открыть букву <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <span className="chip bg-mint/20 text-[#0F766E]">
            <span aria-hidden="true">🚀</span> куда пойдём?
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
            Выбирай приключение
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => (
          <Link
            key={feature.to}
            to={feature.to}
            className={`group relative flex flex-col overflow-hidden rounded-4xl border-2 border-white p-5 shadow-sticker transition-all duration-200 hover:-translate-y-1.5 hover:shadow-sticker-hover ${feature.bg}`}
          >
            <span
              aria-hidden="true"
              className="absolute -right-4 -bottom-5 text-8xl opacity-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            >
              {feature.icon}
            </span>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-white bg-white/85 text-2xl shadow-sticker transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              {feature.icon}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">
              {feature.title}
            </h3>
            <p className="mt-1 flex-1 text-sm leading-snug font-semibold text-ink-soft">
              {feature.text}
            </p>
            <span
              className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black text-white shadow-sticker transition group-hover:gap-2.5 ${feature.button}`}
            >
              Открыть <span aria-hidden="true">→</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <div>
      <Hero />
      <div className="mt-5 grid gap-4 lg:mt-6 lg:grid-cols-[1.15fr_0.85fr]">
        <ContinueCard />
        <LetterOfTheDay />
      </div>
      <Features />
    </div>
  )
}
