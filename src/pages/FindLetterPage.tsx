import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { ProgressRing } from '../components/ProgressRing'
import { useCelebration } from '../context/CelebrationContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { letterStyle, STARTING_LETTERS, type LetterInfo } from '../data/letters'
import { usePageTitle } from '../lib/usePageTitle'
import { starsLabel, shuffle } from '../lib/utils'

const TOTAL_ROUNDS = 10

type Question = {
  letter: LetterInfo
  options: LetterInfo[]
}

type AnswerStatus = 'idle' | 'correct' | 'wrong'

function createQuestions(): Question[] {
  return shuffle(STARTING_LETTERS)
    .slice(0, TOTAL_ROUNDS)
    .map((letter) => ({
      letter,
      options: shuffle([
        letter,
        ...shuffle(
          STARTING_LETTERS.filter((item) => item.id !== letter.id),
        ).slice(0, 3),
      ]),
    }))
}

export function FindLetterPage() {
  usePageTitle('Игра «Найди букву»')
  const [questions, setQuestions] = useState<Question[]>(createQuestions)
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<AnswerStatus>('idle')
  const [chosenId, setChosenId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [bonus, setBonus] = useState(0)
  const timerRef = useRef<number | null>(null)

  const { addStars, recordQuiz, progress } = useProgress()
  const { speak, stopSpeaking, play } = useSound()
  const { celebrate } = useCelebration()

  const question = questions[round]

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      stopSpeaking()
    }
  }, [stopSpeaking])

  const finishGame = (finalScore: number) => {
    const earnedBonus = finalScore >= 8 ? 3 : 0
    setBonus(earnedBonus)
    setFinished(true)
    recordQuiz(finalScore)
    if (earnedBonus) addStars(earnedBonus)
    play(finalScore >= 8 ? 'win' : 'correct')
    if (finalScore >= 8) celebrate({ count: 150 })
    speak(
      finalScore >= 8
        ? 'Здорово! Ты настоящий знаток азбуки!'
        : 'Хорошая игра! Попробуй ещё раз!',
    )
  }

  const chooseAnswer = (option: LetterInfo) => {
    if (!question || status !== 'idle' || finished) return

    const isRight = option.id === question.letter.id
    const nextScore = score + (isRight ? 1 : 0)

    setChosenId(option.id)
    setStatus(isRight ? 'correct' : 'wrong')
    setScore(nextScore)

    if (isRight) {
      play('correct')
      addStars(1)
      celebrate({ count: 45 })
      speak(`${question.letter.word}. Молодец!`)
    } else {
      play('wrong')
      speak(`Правильно — ${question.letter.name}. ${question.letter.word}.`)
    }

    timerRef.current = window.setTimeout(() => {
      if (round + 1 >= TOTAL_ROUNDS) {
        finishGame(nextScore)
      } else {
        setRound((current) => current + 1)
        setStatus('idle')
        setChosenId(null)
      }
    }, isRight ? 1150 : 1600)
  }

  const restart = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    stopSpeaking()
    play('swoosh')
    setQuestions(createQuestions())
    setRound(0)
    setScore(0)
    setStatus('idle')
    setChosenId(null)
    setFinished(false)
    setBonus(0)
  }

  if (finished) {
    const message =
      score === 10
        ? 'Невероятно! Все десять букв угаданы!'
        : score >= 8
          ? 'Отличный результат! Ты почти знаток азбуки.'
          : score >= 5
            ? 'Хорошо! Ещё немного тренировки — и будет отлично.'
            : 'Начало положено! Попробуй ещё раз, у тебя получится.'

    return (
      <div className="mx-auto max-w-2xl">
        <div className="card-surface relative overflow-hidden p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -top-16 -left-16 h-44 w-44 rounded-full bg-sun/25 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="absolute -right-14 -bottom-16 h-48 w-48 rounded-full bg-mint/25 blur-2xl"
          />

          <div className="relative">
            <span className="text-5xl" aria-hidden="true">
              {score >= 8 ? '🏆' : score >= 5 ? '🌟' : '💪'}
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink">
              Игра окончена!
            </h1>
            <p className="mt-1 text-sm font-semibold text-ink-soft">{message}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <ProgressRing value={score} max={TOTAL_ROUNDS} size={150}>
                <span className="text-4xl leading-none font-black text-ink">
                  {score}
                </span>
                <span className="mt-1 text-xs font-extrabold text-ink-soft">
                  из {TOTAL_ROUNDS}
                </span>
              </ProgressRing>

              <div className="rounded-3xl border-2 border-white bg-[#FFF6E3] px-6 py-4">
                <p className="text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                  за игру
                </p>
                <p className="mt-1 text-2xl font-black text-ink">
                  <span aria-hidden="true">⭐</span> +{score + bonus}
                </p>
                <p className="mt-1 text-xs font-bold text-ink-soft">
                  {starsLabel(score + bonus)}
                  {bonus > 0 && ' (включая бонус!)'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center gap-2 rounded-full border-b-4 border-[#D94A68] bg-[linear-gradient(135deg,#FF8A8A,#FF5D8F)] px-6 py-3 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:border-b-2"
              >
                <span aria-hidden="true">🔁</span> Играть ещё
              </button>
              <Link
                to="/games"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white bg-white px-6 py-3 text-sm font-black text-ink shadow-sticker transition hover:-translate-y-0.5"
              >
                Все игры
              </Link>
            </div>

            <div className="mx-auto mt-5 max-w-xs">
              <Mascot className="mx-auto w-40" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/games"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-extrabold text-ink-soft transition hover:text-ink"
        >
          <span aria-hidden="true">←</span> Игры
        </Link>
        <div className="flex items-center gap-2">
          <span className="chip bg-white/80 text-ink-soft">
            вопрос {round + 1} из {TOTAL_ROUNDS}
          </span>
          <span className="chip bg-sun/30 text-ink">
            <span aria-hidden="true">✅</span> верно: {score}
          </span>
          {progress.quizBest > 0 && (
            <span className="chip hidden bg-grape/15 text-grape sm:inline-flex">
              рекорд {progress.quizBest}/10
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {Array.from({ length: TOTAL_ROUNDS }, (_, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              index < round
                ? 'bg-mint'
                : index === round
                  ? 'bg-sun'
                  : 'bg-ink/10'
            }`}
          />
        ))}
      </div>

      <section className="card-surface relative mt-4 overflow-hidden p-5 text-center sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-sun/15 blur-2xl"
        />

        <div className="relative">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">
            с какой буквы начинается слово?
          </p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="animate-bob text-7xl drop-shadow-md sm:text-8xl"
            >
              {question.letter.emoji}
            </span>
            <button
              type="button"
              onClick={() => {
                play('tap')
                speak(question.letter.word)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-cream text-lg shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Послушать слово"
              title="Послушать слово"
            >
              <span aria-hidden="true">🔊</span>
            </button>
          </div>

          <div className="mt-2 flex justify-center gap-1.5">
            {question.letter.word.split('').map((char, index) => {
              const revealed = index === 0 && status !== 'idle'
              return (
                <span
                  key={`${char}-${index}`}
                  className={`flex h-11 w-9 items-center justify-center rounded-xl border-2 text-xl font-black uppercase sm:h-12 sm:w-10 ${
                    index === 0
                      ? revealed
                        ? 'letter-gradient border-white text-white shadow-sticker'
                        : 'border-dashed border-sun bg-sun/20 text-ink/40'
                      : 'border-white bg-cream text-ink'
                  }`}
                  style={index === 0 ? letterStyle(question.letter) : undefined}
                >
                  {index === 0 ? (revealed ? question.letter.upper : '?') : char}
                </span>
              )
            })}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {question.options.map((option) => {
              const isCorrectOption =
                status !== 'idle' && option.id === question.letter.id
              const isWrongChoice =
                status === 'wrong' && chosenId === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={status !== 'idle'}
                  onClick={() => chooseAnswer(option)}
                  aria-label={`Буква ${option.upper}`}
                  className={`relative flex min-h-[5.5rem] items-center justify-center rounded-3xl border-2 text-4xl font-black transition-all duration-200 sm:min-h-24 sm:text-5xl ${
                    isCorrectOption
                      ? 'border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)] text-white shadow-sticker'
                      : isWrongChoice
                        ? 'animate-shake border-[#D94A68] bg-[linear-gradient(135deg,#FF8A8A,#FF5D8F)] text-white'
                        : 'border-white bg-white text-ink shadow-sticker hover:-translate-y-1 hover:border-sun hover:bg-[#FFFBF0] active:translate-y-0 active:scale-95 disabled:hover:translate-y-0'
                  }`}
                >
                  {option.upper}
                  {isCorrectOption && (
                    <span
                      className="absolute top-1.5 right-2 text-lg"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  {isWrongChoice && (
                    <span
                      className="absolute top-1.5 right-2 text-lg"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4 min-h-[3rem]" aria-live="polite">
            {status === 'correct' && (
              <p className="animate-pop inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-4 py-2 text-sm font-black text-[#0F766E]">
                <span aria-hidden="true">🎉</span> Молодец! +1 звезда
              </p>
            )}
            {status === 'wrong' && (
              <p className="animate-pop inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-4 py-2 text-sm font-black text-[#D94A68]">
                <span aria-hidden="true">💡</span> Правильно — {question.letter.upper}.{' '}
                {question.letter.word}
              </p>
            )}
            {status === 'idle' && (
              <p className="text-xs font-bold text-ink-soft">
                Подсказка: {question.letter.kind === 'vowel' ? 'это гласная' : 'это согласная'} ·{' '}
                {question.letter.word.length} букв в слове
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
