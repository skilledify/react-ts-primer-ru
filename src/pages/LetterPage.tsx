import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLetter, getLetterIndex, KIND_HINT, KIND_LABEL, LETTERS, letterStyle } from '../data/letters'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { useCelebration } from '../context/CelebrationContext'
import { usePageTitle } from '../lib/usePageTitle'

const KIND_STYLES = {
  vowel: 'bg-coral/15 text-[#D94A68]',
  consonant: 'bg-sky/20 text-[#1D6FC0]',
  sign: 'bg-grape/15 text-grape',
} as const

export function LetterPage() {
  const { id } = useParams()
  const letter = getLetter(id)
  const { isLearned, learnLetter, addStars } = useProgress()
  const { speak, play } = useSound()
  const { celebrate } = useCelebration()

  usePageTitle(letter ? `Буква ${letter.upper}` : 'Буква не найдена')

  useEffect(() => {
    if (!letter) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [letter])

  if (!letter) {
    return (
      <div className="card-surface mx-auto max-w-lg p-8 text-center">
        <div className="text-6xl">🙈</div>
        <h1 className="mt-4 font-display text-2xl font-bold">
          Такой буквы нет
        </h1>
        <p className="mt-2 font-semibold text-ink-soft">
          Зато в азбуке есть все 33 буквы — выбери любую!
        </p>
        <Link
          to="/alphabet"
          className="mt-5 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-black text-white shadow-sticker"
        >
          Вернуться в азбуку
        </Link>
      </div>
    )
  }

  const index = getLetterIndex(letter.id)
  const previous = index > 0 ? LETTERS[index - 1] : null
  const next = index < LETTERS.length - 1 ? LETTERS[index + 1] : null
  const learned = isLearned(letter.id)

  const handleLearn = () => {
    if (learned) {
      play('star')
      celebrate({ count: 50 })
      speak(`Молодец! Буква ${letter.name} уже выучена.`)
      return
    }
    learnLetter(letter.id)
    addStars(1)
    play('win')
    celebrate({ count: 110 })
    speak(`Молодец! Буква ${letter.name} выучена!`)
  }

  return (
    <div>
      <Link
        to="/alphabet"
        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold text-ink-soft transition hover:text-ink"
      >
        <span aria-hidden="true">←</span> Вся азбука
      </Link>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section
          style={letterStyle(letter)}
          className="letter-gradient relative overflow-hidden rounded-[2.25rem] border-2 border-white p-6 text-center text-white shadow-soft sm:p-8"
        >
          <span
            aria-hidden="true"
            className="absolute top-4 right-5 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl bg-white/20 text-xs font-black backdrop-blur-sm"
          >
            {index + 1}/33
          </span>
          <span
            aria-hidden="true"
            className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-white/15 blur-2xl"
          />

          <span className="chip relative bg-white/25 text-white backdrop-blur-sm">
            <span aria-hidden="true">
              {letter.kind === 'vowel'
                ? '🎵'
                : letter.kind === 'consonant'
                  ? '🗣️'
                  : '✏️'}
            </span>
            {KIND_LABEL[letter.kind]}
          </span>

          <div
            className="relative mt-4 flex items-baseline justify-center leading-none"
            aria-label={`Буква ${letter.upper} ${letter.lower}`}
          >
            <span className="text-[7.5rem] font-black drop-shadow-[0_6px_0_rgba(51,37,74,0.15)] sm:text-[9rem]">
              {letter.upper}
            </span>
            <span className="ml-2 text-5xl font-extrabold opacity-75 sm:text-6xl">
              {letter.lower}
            </span>
          </div>

          <div className="relative mt-5 flex items-center justify-center gap-3 rounded-3xl bg-white/20 px-4 py-3 backdrop-blur-sm">
            <span
              aria-hidden="true"
              className="animate-bob text-5xl drop-shadow-md sm:text-6xl"
            >
              {letter.emoji}
            </span>
            <div className="text-left">
              <p className="text-2xl leading-none font-black sm:text-3xl">
                {letter.word}
              </p>
              <p className="mt-1 text-xs font-bold text-white/85">
                {letter.wordLetterIndex === 0
                  ? 'слово начинается с этой буквы'
                  : 'буква спряталась в слове'}
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                play('tap')
                speak(letter.name)
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-ink shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <span aria-hidden="true">🔊</span> Буква
            </button>
            <button
              type="button"
              onClick={() => {
                play('tap')
                speak(letter.word)
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-ink shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <span aria-hidden="true">🔊</span> Слово
            </button>
          </div>
        </section>

        <div className="space-y-4">
          <section className="card-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`chip ${KIND_STYLES[letter.kind]}`}>
                {KIND_LABEL[letter.kind]}
              </span>
              {learned && (
                <span className="chip bg-mint/20 text-[#0F766E]">
                  <span aria-hidden="true">⭐</span> выучена
                </span>
              )}
            </div>

            <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
              Буква {letter.upper}
            </h1>
            <p className="mt-1.5 text-sm font-semibold text-ink-soft">
              {KIND_HINT[letter.kind]}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5" aria-label={`Слово ${letter.word}`}>
              {letter.word.split('').map((char, charIndex) => (
                <span
                  key={`${char}-${charIndex}`}
                  style={
                    charIndex === letter.wordLetterIndex
                      ? letterStyle(letter)
                      : undefined
                  }
                  className={`flex h-11 w-10 items-center justify-center rounded-xl text-xl font-black uppercase shadow-sm transition sm:h-12 sm:w-11 ${
                    charIndex === letter.wordLetterIndex
                      ? 'letter-gradient scale-110 border-2 border-white text-white shadow-sticker'
                      : 'border-2 border-white bg-cream text-ink'
                  }`}
                >
                  {char}
                </span>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border-2 border-white bg-[#FFF6E3] p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="chip bg-sun/30 text-ink">
                  <span aria-hidden="true">📖</span> стишок
                </span>
                <button
                  type="button"
                  onClick={() => {
                    play('tap')
                    speak(letter.rhyme.replace('\n', ' '))
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-sticker transition hover:scale-110 active:scale-95"
                  aria-label="Прочитать стишок вслух"
                  title="Прочитать стишок вслух"
                >
                  <span aria-hidden="true">🔊</span>
                </button>
              </div>
              <p className="mt-2 font-hand text-2xl leading-snug font-bold whitespace-pre-line text-ink">
                {letter.rhyme}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleLearn}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border-b-4 border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)] px-5 py-3 text-sm font-black text-white shadow-sticker transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2`}
              >
                <span aria-hidden="true">{learned ? '🌟' : '✓'}</span>
                {learned ? 'Выучено! Ещё раз' : 'Я выучил эту букву'}
              </button>
              <Link
                to={`/write?letter=${letter.id}`}
                onClick={() => play('tap')}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-5 py-3 text-sm font-black text-ink shadow-sticker transition hover:-translate-y-0.5"
              >
                <span aria-hidden="true">✏️</span> Прописи
              </Link>
            </div>
          </section>

          <Link
            to="/games/find"
            onClick={() => play('tap')}
            className="group flex items-center gap-3 rounded-3xl border-2 border-white bg-[#F0E7FF] px-4 py-3 shadow-sticker transition hover:-translate-y-0.5"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm transition group-hover:rotate-6"
            >
              🎮
            </span>
            <span className="flex-1">
              <span className="block text-sm font-black text-ink">
                Проверь себя в игре
              </span>
              <span className="block text-xs font-semibold text-ink-soft">
                Найди букву, с которой начинается слово
              </span>
            </span>
            <span aria-hidden="true" className="text-lg font-black text-grape">
              →
            </span>
          </Link>
        </div>
      </div>

      <nav
        aria-label="Соседние буквы"
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            to={`/letter/${previous.id}`}
            style={letterStyle(previous)}
            className="letter-soft group flex items-center gap-3 rounded-3xl border-2 border-white p-3 shadow-sticker transition hover:-translate-y-0.5"
          >
            <span aria-hidden="true" className="text-xl font-black text-ink-soft">
              ←
            </span>
            <span
              aria-hidden="true"
              className="letter-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
            >
              {previous.upper}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                предыдущая
              </span>
              <span className="block truncate text-sm font-black text-ink">
                {previous.emoji} {previous.word}
              </span>
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}

        {next && (
          <Link
            to={`/letter/${next.id}`}
            style={letterStyle(next)}
            className="letter-soft group flex items-center justify-end gap-3 rounded-3xl border-2 border-white p-3 text-right shadow-sticker transition hover:-translate-y-0.5"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                следующая
              </span>
              <span className="block truncate text-sm font-black text-ink">
                {next.emoji} {next.word}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="letter-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white shadow-sm"
            >
              {next.upper}
            </span>
            <span aria-hidden="true" className="text-xl font-black text-ink-soft">
              →
            </span>
          </Link>
        )}
      </nav>
    </div>
  )
}
