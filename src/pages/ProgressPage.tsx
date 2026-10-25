import { Link } from 'react-router-dom'
import { ProgressRing } from '../components/ProgressRing'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { LETTERS, letterStyle, type LetterInfo } from '../data/letters'
import { usePageTitle } from '../lib/usePageTitle'
import { starsLabel, wordsLabel } from '../lib/utils'

type Achievement = {
  id: string
  icon: string
  title: string
  description: string
  bg: string
  unlocked: boolean
}

export function ProgressPage() {
  usePageTitle('Мои успехи')
  const { progress, resetProgress } = useProgress()
  const { play, speak } = useSound()

  const learnedLetters: LetterInfo[] = LETTERS.filter((letter) =>
    progress.learned.includes(letter.id),
  )
  const learnedCount = learnedLetters.length
  const nextLetter = LETTERS.find(
    (letter) => !progress.learned.includes(letter.id),
  )

  const achievements: Achievement[] = [
    {
      id: 'first-letter',
      icon: '🌱',
      title: 'Первая буква',
      description: 'Выучи 1 букву',
      bg: 'bg-[#E8F8D9]',
      unlocked: learnedCount >= 1,
    },
    {
      id: 'ten-letters',
      icon: '📚',
      title: 'Десять букв',
      description: 'Выучи 10 букв',
      bg: 'bg-[#DFF1FF]',
      unlocked: learnedCount >= 10,
    },
    {
      id: 'all-letters',
      icon: '👑',
      title: 'Знаток азбуки',
      description: 'Выучи все 33 буквы',
      bg: 'bg-[#FFF1CC]',
      unlocked: learnedCount === LETTERS.length,
    },
    {
      id: 'first-star',
      icon: '⭐',
      title: 'Первая звезда',
      description: 'Получи 1 звезду',
      bg: 'bg-[#FFF1CC]',
      unlocked: progress.stars >= 1,
    },
    {
      id: 'stars-25',
      icon: '🌟',
      title: 'Звёздный дождь',
      description: 'Собери 25 звёзд',
      bg: 'bg-[#FFE7E7]',
      unlocked: progress.stars >= 25,
    },
    {
      id: 'stars-75',
      icon: '✨',
      title: 'Сияние',
      description: 'Собери 75 звёзд',
      bg: 'bg-[#F0E7FF]',
      unlocked: progress.stars >= 75,
    },
    {
      id: 'quiz-perfect',
      icon: '🎯',
      title: 'Меткий глаз',
      description: 'Набери 10 из 10 в игре «Найди букву»',
      bg: 'bg-[#DEFBF0]',
      unlocked: progress.quizBest >= 10,
    },
    {
      id: 'memory-win',
      icon: '🃏',
      title: 'Всё в паре',
      description: 'Победи в игре «Найди пару»',
      bg: 'bg-[#E9DDFF]',
      unlocked: progress.memoryWins >= 1,
    },
    {
      id: 'word-builder',
      icon: '🧩',
      title: 'Словодел',
      description: 'Собери 5 слов',
      bg: 'bg-[#DEFBF0]',
      unlocked: progress.wordsBuilt >= 5,
    },
    {
      id: 'drum-talker',
      icon: '🎤',
      title: 'Говорун',
      description: 'Назови 5 букв в игре «Барабан букв»',
      bg: 'bg-[#FFF1CC]',
      unlocked: progress.drumWins >= 5,
    },
  ]
  const unlockedCount = achievements.filter((item) => item.unlocked).length

  const handleReset = () => {
    const confirmed = window.confirm(
      'Сбросить весь прогресс? Буквы и звёзды обнулятся, отменить это будет нельзя.',
    )
    if (!confirmed) return
    resetProgress()
    play('swoosh')
    speak('Прогресс сброшен. Начнём заново!')
  }

  return (
    <div>
      <section className="relative overflow-hidden rounded-[2.25rem] border-2 border-white bg-white/65 p-5 shadow-sticker sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-16 -right-12 h-52 w-52 rounded-full bg-sun/25 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-20 left-10 h-44 w-44 rounded-full bg-grape/20 blur-2xl"
        />

        <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-center">
          <ProgressRing value={learnedCount} max={LETTERS.length} size={168}>
            <span className="text-5xl leading-none font-black text-ink">
              {learnedCount}
            </span>
            <span className="mt-1 text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
              из {LETTERS.length} букв
            </span>
          </ProgressRing>

          <div className="flex-1 text-center md:text-left">
            <span className="chip bg-grape/15 text-grape">
              <span aria-hidden="true">🏆</span> мои успехи
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
              {learnedCount === LETTERS.length
                ? 'Ты настоящий знаток азбуки!'
                : learnedCount > 0
                  ? 'Отличный прогресс!'
                  : 'Всё начинается с первой буквы'}
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-ink-soft">
              {learnedCount === LETTERS.length
                ? 'Все 33 буквы выучены. Теперь можно читать книжки вместе с родителями!'
                : 'Открывай буквы, играй и рисуй в прописях — звёзды копятся сами собой.'}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              <span className="chip bg-sun/30 text-ink">
                <span aria-hidden="true">⭐</span> {starsLabel(progress.stars)}
              </span>
              <span className="chip bg-mint/20 text-[#0F766E]">
                <span aria-hidden="true">🃏</span> побед: {progress.memoryWins}
              </span>
              <span className="chip bg-sky/15 text-[#1D6FC0]">
                <span aria-hidden="true">🧩</span> {wordsLabel(progress.wordsBuilt)}
              </span>
              <span className="chip bg-sun/25 text-[#B45309]">
                <span aria-hidden="true">🎤</span> сказано: {progress.drumWins}
              </span>
            </div>

            {nextLetter && (
              <Link
                to={`/letter/${nextLetter.id}`}
                style={letterStyle(nextLetter)}
                className="letter-gradient mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white px-5 py-2.5 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
              >
                Продолжить: буква {nextLetter.upper}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: '⭐', label: 'звёзд', value: progress.stars, bg: 'bg-[#FFF1CC]' },
          { icon: '🎯', label: 'рекорд', value: `${progress.quizBest}/10`, bg: 'bg-[#FFE7E7]' },
          { icon: '🃏', label: 'побед', value: progress.memoryWins, bg: 'bg-[#F0E7FF]' },
          { icon: '🧩', label: 'слов', value: progress.wordsBuilt, bg: 'bg-[#DEFBF0]' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl border-2 border-white p-3 text-center shadow-sticker ${stat.bg}`}
          >
            <span aria-hidden="true" className="text-xl">
              {stat.icon}
            </span>
            <p className="mt-1 text-2xl leading-none font-black text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <span className="chip bg-sun/30 text-ink">
              <span aria-hidden="true">🎖️</span> медали
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">
              Достижения
            </h2>
          </div>
          <span className="text-xs font-extrabold text-ink-soft">
            {unlockedCount} из {achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative overflow-hidden rounded-3xl border-2 border-white p-4 transition ${
                achievement.unlocked
                  ? `${achievement.bg} shadow-sticker`
                  : 'border-dashed bg-white/75 opacity-90'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute -right-3 -bottom-4 text-6xl opacity-10"
              >
                {achievement.unlocked ? achievement.icon : '🔒'}
              </span>
              <span className="text-3xl" aria-hidden="true">
                {achievement.unlocked ? achievement.icon : '🔒'}
              </span>
              <h3 className="mt-2 text-sm leading-tight font-black text-ink">
                {achievement.title}
              </h3>
              <p className="mt-1 text-[11px] leading-snug font-semibold text-ink-soft">
                {achievement.description}
              </p>
              {achievement.unlocked && (
                <span className="mt-2 inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-black tracking-wide text-[#0F766E] uppercase">
                  получено
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="chip bg-sky/15 text-[#1D6FC0]">
              <span aria-hidden="true">🗺️</span> карта букв
            </span>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">
              Все буквы твоего букваря
            </h2>
          </div>
          <Link
            to="/alphabet"
            className="rounded-full px-3 py-2 text-xs font-extrabold text-ink-soft transition hover:bg-cream hover:text-ink"
          >
            Открыть азбуку <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {LETTERS.map((letter) => {
            const learned = progress.learned.includes(letter.id)
            return (
              <Link
                key={letter.id}
                to={`/letter/${letter.id}`}
                style={learned ? letterStyle(letter) : undefined}
                aria-label={`Буква ${letter.upper}${learned ? ', выучена' : ''}`}
                title={`${letter.upper} · ${letter.word}`}
                className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 text-sm font-black transition hover:-translate-y-0.5 ${
                  learned
                    ? 'letter-gradient border-white text-white shadow-sm'
                    : 'border-dashed border-ink/15 bg-cream/60 text-ink/35'
                }`}
              >
                {letter.upper}
              </Link>
            )
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#FF6B6B,#9B5DE5)]" />
            выучена
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-ink/30 bg-cream" />
            ещё впереди
          </span>
        </div>
      </section>

      <section className="mt-5 flex flex-col items-center justify-between gap-3 rounded-3xl border-2 border-white bg-white/60 px-5 py-4 sm:flex-row">
        <p className="text-center text-xs font-bold text-ink-soft sm:text-left">
          <span aria-hidden="true">💾</span> Прогресс хранится только в этом
          браузере. Сброс вернёт всё к началу.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="shrink-0 rounded-full border-2 border-coral/40 bg-white px-4 py-2 text-xs font-black text-[#D94A68] transition hover:bg-coral/10"
        >
          Сбросить прогресс
        </button>
      </section>
    </div>
  )
}
