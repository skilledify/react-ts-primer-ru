import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Mascot } from '../components/Mascot'
import { ProgressRing } from '../components/ProgressRing'
import { useCelebration } from '../context/CelebrationContext'
import { useProgress } from '../context/ProgressContext'
import { useSound } from '../context/SoundContext'
import { GAME_WORDS, PALETTES } from '../data/letters'
import { usePageTitle } from '../lib/usePageTitle'
import { shuffle, starsLabel } from '../lib/utils'

const ROUNDS = 6

type Tile = {
  id: string
  char: string
}

type WordTask = {
  word: string
  emoji: string
}

type Status = 'idle' | 'correct' | 'wrong'

function makePool(word: string): Tile[] {
  return shuffle(
    word.split('').map((char, index) => ({
      id: `${index}-${char}-${Math.random().toString(36).slice(2, 7)}`,
      char,
    })),
  )
}

function tileStyle(char: string): CSSProperties {
  const palette = PALETTES[char.charCodeAt(0) % PALETTES.length]
  return {
    '--card-from': palette.from,
    '--card-to': palette.to,
    '--card-soft': palette.soft,
  } as CSSProperties
}

export function BuildWordPage() {
  usePageTitle('Игра «Собери слово»')
  const [queue, setQueue] = useState<WordTask[]>(() =>
    shuffle(GAME_WORDS).slice(0, ROUNDS),
  )
  const [index, setIndex] = useState(0)
  const [pool, setPool] = useState<Tile[]>(() => makePool(queue[0].word))
  const [chosen, setChosen] = useState<Tile[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [solved, setSolved] = useState(0)
  const [finished, setFinished] = useState(false)
  const [bonus, setBonus] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const timerRef = useRef<number | null>(null)

  const { addStars, recordWord, progress } = useProgress()
  const { speak, stopSpeaking, play } = useSound()
  const { celebrate } = useCelebration()

  const current = queue[index]

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      stopSpeaking()
    }
  }, [stopSpeaking])

  const finishGame = (finalSolved: number) => {
    const isPerfect = finalSolved === queue.length
    const earnedBonus = isPerfect ? 3 : 0
    setBonus(earnedBonus)
    setFinished(true)
    if (earnedBonus) addStars(earnedBonus)
    play('win')
    celebrate({ count: 160 })
    speak(
      isPerfect
        ? 'Победа! Все слова собраны! Ты настоящий волшебник слов!'
        : 'Молодец! Продолжай тренироваться!',
    )
  }

  const goNext = (nextIndex: number, solvedCount: number) => {
    if (nextIndex >= queue.length) {
      finishGame(solvedCount)
      return
    }
    setIndex(nextIndex)
    setPool(makePool(queue[nextIndex].word))
    setChosen([])
    setStatus('idle')
    setShowHint(false)
  }

  const pickTile = (tile: Tile) => {
    if (!current || status !== 'idle') return

    play('tap')
    speak(tile.char, { rate: 0.72, pitch: 1.2 })

    const nextChosen = [...chosen, tile]
    setChosen(nextChosen)
    setPool((currentPool) =>
      currentPool.filter((item) => item.id !== tile.id),
    )

    if (nextChosen.length < current.word.length) return

    const attempt = nextChosen.map((item) => item.char).join('')
    if (attempt === current.word) {
      setStatus('correct')
      play('win')
      addStars(2)
      recordWord()
      setSolved((value) => value + 1)
      celebrate({ count: 110 })
      speak(`${current.word}. Молодец!`)
      timerRef.current = window.setTimeout(() => {
        goNext(index + 1, solved + 1)
      }, 1700)
    } else {
      setStatus('wrong')
      play('wrong')
      speak('Почти получилось! Попробуй ещё раз.')
      timerRef.current = window.setTimeout(() => {
        setStatus('idle')
        setChosen([])
        setPool(makePool(current.word))
      }, 1100)
    }
  }

  const returnTile = (tile: Tile) => {
    if (status !== 'idle') return
    play('flip')
    setChosen((items) => items.filter((item) => item.id !== tile.id))
    setPool((items) => [...items, tile])
  }

  const resetRound = () => {
    if (!current || status !== 'idle') return
    play('swoosh')
    setChosen([])
    setPool(makePool(current.word))
    setShowHint(false)
  }

  const skipWord = () => {
    if (status !== 'idle' || !current) return
    play('swoosh')
    stopSpeaking()
    if (index + 1 >= queue.length) finishGame(solved)
    else goNext(index + 1, solved)
  }

  const restart = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    stopSpeaking()
    play('swoosh')
    const nextQueue = shuffle(GAME_WORDS).slice(0, ROUNDS)
    setQueue(nextQueue)
    setIndex(0)
    setPool(makePool(nextQueue[0].word))
    setChosen([])
    setStatus('idle')
    setSolved(0)
    setFinished(false)
    setBonus(0)
    setShowHint(false)
  }

  if (finished) {
    const totalStars = solved * 2 + bonus
    const message =
      solved === queue.length
        ? 'Победа! Все слова собраны без ошибок!'
        : solved >= Math.ceil(queue.length / 2)
          ? 'Отличная работа! Большинство слов собрано.'
          : 'Хорошее начало! Попробуй ещё — получится быстрее.'

    return (
      <div className="mx-auto max-w-2xl">
        <div className="card-surface relative overflow-hidden p-6 text-center sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -top-16 -left-16 h-44 w-44 rounded-full bg-mint/25 blur-2xl"
          />
          <span
            aria-hidden="true"
            className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-sun/25 blur-2xl"
          />

          <div className="relative">
            <span className="text-5xl" aria-hidden="true">
              {solved === queue.length ? '🏆' : '🧩'}
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-ink">
              Слова собраны!
            </h1>
            <p className="mt-1 text-sm font-semibold text-ink-soft">{message}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <ProgressRing value={solved} max={queue.length} size={150}>
                <span className="text-4xl leading-none font-black text-ink">
                  {solved}
                </span>
                <span className="mt-1 text-xs font-extrabold text-ink-soft">
                  из {queue.length}
                </span>
              </ProgressRing>

              <div className="rounded-3xl border-2 border-white bg-[#DEFBF0] px-6 py-4">
                <p className="text-[10px] font-extrabold tracking-wide text-ink-soft uppercase">
                  за игру
                </p>
                <p className="mt-1 text-2xl font-black text-ink">
                  <span aria-hidden="true">⭐</span> +{totalStars}
                </p>
                <p className="mt-1 text-xs font-bold text-ink-soft">
                  {starsLabel(totalStars)}
                  {bonus > 0 && ' (включая бонус!)'}
                </p>
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-xs">
              <Mascot className="mx-auto w-36" />
            </div>

            <p className="mt-2 text-xs font-bold text-ink-soft">
              Всего собрано слов за всё время: {progress.wordsBuilt}
            </p>

            <div className="mt-4 flex flex-col justify-center gap-2 sm:flex-row">
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center gap-2 rounded-full border-b-4 border-[#0F9F70] bg-[linear-gradient(135deg,#5EEAD4,#14B8A6)] px-6 py-3 text-sm font-black text-white shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0 active:border-b-2"
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
          </div>
        </div>
      </div>
    )
  }

  if (!current) return null

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
            слово {index + 1} из {queue.length}
          </span>
          <span className="chip bg-mint/20 text-[#0F766E]">
            собрано: {solved}
          </span>
          <span className="chip bg-sun/30 text-ink">
            <span aria-hidden="true">⭐</span> {progress.stars}
          </span>
        </div>
      </div>

      <div className="mt-3 flex gap-1" aria-hidden="true">
        {queue.map((_, position) => (
          <span
            key={position}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              position < index
                ? 'bg-mint'
                : position === index
                  ? 'bg-sun'
                  : 'bg-ink/10'
            }`}
          />
        ))}
      </div>

      <section className="card-surface relative mt-4 overflow-hidden p-5 text-center sm:p-7">
        <span
          aria-hidden="true"
          className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-mint/15 blur-2xl"
        />

        <div className="relative">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft uppercase">
            собери слово из букв
          </p>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="animate-bob text-7xl drop-shadow-md sm:text-8xl"
            >
              {current.emoji}
            </span>
            <button
              type="button"
              onClick={() => {
                play('tap')
                speak(current.word)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-cream text-lg shadow-sticker transition hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Послушать слово"
              title="Послушать слово"
            >
              <span aria-hidden="true">🔊</span>
            </button>
          </div>

          <p className="mt-1 text-xs font-bold text-ink-soft">
            {showHint ? (
              <>
                Подсказка:{' '}
                <strong className="text-base text-ink">{current.word}</strong>
              </>
            ) : (
              `${current.word.length} ${current.word.length === 1 ? 'буква' : current.word.length < 5 ? 'буквы' : 'букв'} — нажимай на буквы по порядку`
            )}
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {Array.from({ length: current.word.length }, (_, position) => {
              const tile = chosen[position]
              if (!tile) {
                return (
                  <span
                    key={`empty-${position}`}
                    className={`flex h-14 w-11 items-center justify-center rounded-2xl border-2 border-dashed text-sm font-black sm:h-16 sm:w-12 ${
                      position === chosen.length
                        ? 'border-sun bg-sun/15 text-ink/40'
                        : 'border-ink/15 bg-cream/70 text-ink/20'
                    }`}
                  >
                    {position + 1}
                  </span>
                )
              }
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => returnTile(tile)}
                  style={tileStyle(tile.char)}
                  title="Вернуть букву"
                  className={`letter-gradient flex h-14 w-11 items-center justify-center rounded-2xl border-2 border-white text-2xl font-black text-white shadow-sticker transition sm:h-16 sm:w-12 sm:text-3xl ${
                    status === 'correct'
                      ? 'ring-4 ring-mint ring-offset-2 ring-offset-paper'
                      : status === 'wrong'
                        ? 'animate-shake ring-4 ring-coral/60'
                        : 'hover:-translate-y-0.5'
                  }`}
                >
                  {tile.char}
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex min-h-16 flex-wrap justify-center gap-2">
            {pool.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => pickTile(tile)}
                disabled={status !== 'idle'}
                style={tileStyle(tile.char)}
                className="letter-gradient flex h-14 w-12 items-center justify-center rounded-2xl border-2 border-white text-2xl font-black text-white shadow-sticker transition hover:-translate-y-1 hover:rotate-[-2deg] active:translate-y-0 active:scale-95 disabled:opacity-50 sm:h-16 sm:w-14 sm:text-3xl"
                aria-label={`Буква ${tile.char}`}
              >
                {tile.char}
              </button>
            ))}
            {pool.length === 0 && status === 'correct' && (
              <span className="self-center text-sm font-black text-[#0F766E]">
                Все буквы на местах! 🎉
              </span>
            )}
          </div>

          <div className="mt-3 min-h-[3rem]" aria-live="polite">
            {status === 'correct' && (
              <p className="animate-pop inline-flex items-center gap-1.5 rounded-full bg-mint/20 px-4 py-2 text-sm font-black text-[#0F766E]">
                <span aria-hidden="true">🎉</span> Правильно! +2 звезды
              </p>
            )}
            {status === 'wrong' && (
              <p className="animate-pop inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-4 py-2 text-sm font-black text-[#D94A68]">
                <span aria-hidden="true">💡</span> Почти! Попробуй другой порядок
              </p>
            )}
          </div>

          <div className="mt-1 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                play('tap')
                setShowHint((value) => !value)
              }}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-cream px-3.5 py-2 text-xs font-extrabold text-ink transition hover:-translate-y-0.5"
            >
              <span aria-hidden="true">{showHint ? '🙈' : '💡'}</span>
              {showHint ? 'Скрыть подсказку' : 'Подсказка'}
            </button>
            <button
              type="button"
              onClick={resetRound}
              disabled={status !== 'idle' || chosen.length === 0}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-cream px-3.5 py-2 text-xs font-extrabold text-ink transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              <span aria-hidden="true">🧹</span> Сброс
            </button>
            <button
              type="button"
              onClick={skipWord}
              disabled={status !== 'idle'}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold text-ink-soft transition hover:bg-cream hover:text-ink disabled:opacity-40"
            >
              Пропустить <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
